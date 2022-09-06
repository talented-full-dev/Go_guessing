package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"guess_the_score/backend/models"
	"guess_the_score/backend/utils/constants"
	"guess_the_score/backend/utils/context"
	"guess_the_score/backend/views"
	"log"
	"net/http"
)

func NewUserController(us models.UserService, pm models.PredictionModel) *UserController {
	return &UserController{
		us: us,
		pm: pm,
	}
}

type UserController struct {
	us models.UserService
	pm models.PredictionModel
}

func (self *UserController) GetTop(w http.ResponseWriter, r *http.Request) {

	topUsers, err := self.us.GetTop()
	if err != nil {
		fmt.Println(err)
		data := map[string]string{"success": "false", "errorMsg": err.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
	}

	views.SendResponse(w, topUsers, http.StatusOK)
}

func (self *UserController) GetAll(w http.ResponseWriter, r *http.Request) {
	setupCorsResponse(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}

	topUsers, err := self.us.FindAll()
	if err != nil {
		fmt.Println(err)
		data := map[string]string{"success": "false", "errorMsg": err.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
	}

	views.SendResponse(w, topUsers, http.StatusOK)
}


func (self *UserController) Update(w http.ResponseWriter, r *http.Request) {
	setupCorsResponse(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}

	tokenUser := context.User(r.Context())
	if tokenUser.AccessRights.Edit == false {
		fmt.Println("no sufficient rights")
		data := map[string]string{"errorMsg": constants.ErrNoAccessRights.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}

	params := mux.Vars(r)
	id := params["id"]
	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		fmt.Println(err)
		data := map[string]string{"success": "false", "errorMsg": err.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
	}

	var decodedUser *models.User
	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&decodedUser)
	if err != nil {
		log.Println(err)
		data := map[string]string{"errorMsg": constants.ErrInternalServer.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}

	userDatabase, err := self.us.FindById(objId)
	if err != nil {
		log.Println(err)
		data := map[string]string{"errorMsg": err.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}
	userDatabase.Username = decodedUser.Username
	userDatabase.Email = decodedUser.Email
	userDatabase.IsActive = decodedUser.IsActive
	userDatabase.AccessRights = decodedUser.AccessRights
	userDatabase.Score = decodedUser.Score

	fmt.Println("----------------2222------------", decodedUser)

	fmt.Println("-0---------------------------", userDatabase)
	err = self.us.Update(userDatabase)
	if err != nil {
		log.Println(err)
		data := map[string]string{"errorMsg": err.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}

	views.SendResponse(w, nil, http.StatusOK)
}

func (self *UserController) Delete(w http.ResponseWriter, r *http.Request) {
	setupCorsResponse(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}
	params := mux.Vars(r)
	id := params["id"]
	objId, err := primitive.ObjectIDFromHex(id)

	err = self.pm.DeleteAllByUserId(objId)
	if err != nil {
		fmt.Println(err)
		data := map[string]string{"success": "false", "errorMsg": err.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
	}

	err = self.us.Delete(objId)
	if err != nil {
		fmt.Println(err)
		data := map[string]string{"success": "false", "errorMsg": err.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
	}

	data := map[string]string{"success": "true"}
	views.SendResponse(w, data, http.StatusOK)
}


