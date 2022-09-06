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

func NewMatchController(mm models.MatchModel) *MatchController {
	return &MatchController{
		mm: mm,
	}
}

type MatchController struct {
	mm models.MatchModel
}

func (self *MatchController) GetAll(w http.ResponseWriter, r *http.Request) {
	setupCorsResponse(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}

	matches, err := self.mm.FindAll()
	if err != nil {
		fmt.Println(err)
		data := map[string]string{"success": "false", "errorMsg": err.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}

	views.SendResponse(w, matches, http.StatusOK)
}

func (self *MatchController) Create(w http.ResponseWriter, r *http.Request) {
	setupCorsResponse(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}

	user := context.User(r.Context())
	if user.AccessRights.Write == false {
		fmt.Println("no sufficient rights")
		data := map[string]string{"errorMsg": constants.ErrNoAccessRights.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}

	var match *models.Match

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&match)
	if err != nil {
		log.Println(err)
		data := map[string]string{"errorMsg": constants.ErrInternalServer.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}

	err = self.mm.Create(match)
	if err != nil {
		log.Println(err)
		data := map[string]string{"errorMsg": err.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}

	views.SendResponse(w, nil, http.StatusOK)
}

func (self *MatchController) Update(w http.ResponseWriter, r *http.Request) {
	setupCorsResponse(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}

	user := context.User(r.Context())
	if user.AccessRights.Write == false {
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

	var match *models.Match

	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&match)
	if err != nil {
		log.Println(err)
		data := map[string]string{"errorMsg": constants.ErrInternalServer.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}

	match.Id = objId
	err = self.mm.Update(match)
	if err != nil {
		log.Println(err)
		data := map[string]string{"errorMsg": err.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}

	views.SendResponse(w, nil, http.StatusOK)
}

func (self *MatchController) Delete(w http.ResponseWriter, r *http.Request) {
	setupCorsResponse(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}

	user := context.User(r.Context())
	if user.AccessRights.Write == false {
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

	err = self.mm.Delete(objId)
	if err != nil {
		log.Println(err)
		data := map[string]string{"errorMsg": err.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}

	views.SendResponse(w, nil, http.StatusOK)
}
