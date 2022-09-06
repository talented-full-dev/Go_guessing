package controllers

import (
	"encoding/json"
	"errors"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
	"guess_the_score/backend/models"
	"guess_the_score/backend/utils/constants"
	"guess_the_score/backend/views"
	"log"
	"net/http"
)

func setupCorsResponse(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Content-Type", "application/json")
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Authorization")
}

func NewAuthController(us models.UserService) *AuthController {
	return &AuthController{
		us: us,
	}
}

type AuthController struct {
	us models.UserService
}

func (self *AuthController) Register(w http.ResponseWriter, r *http.Request) {
	setupCorsResponse(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}

	var newUser *models.User

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&newUser)
	if err != nil {
		log.Println(err)
		views.SendResponse(w, nil, http.StatusForbidden)
		return
	}

	found, err := self.us.FindByEmail(newUser.Email)
	if found != nil {
		log.Println(err)
		data := map[string]string{"success": "false", "errorMsg": constants.ErrRegisteredEmail.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}

	err = self.us.Validate(newUser, "create")
	if err != nil {
		log.Println(err)
		data := map[string]string{"success": "false", "errorMsg": err.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}

	bytes, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Println(err)
		data := map[string]string{"success": "false", "errorMsg": constants.ErrInternalServer.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}
	newUser.PasswordHash = string(bytes)

	newUser.UUID = uuid.New().String()
	log.Println(newUser.UUID)

	err = self.us.Create(newUser)
	if err != nil {
		log.Println(err)
		data := map[string]string{"success": "false", "errorMsg": constants.ErrInternalServer.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}

	err = self.us.SendActivationLink(newUser)
	if err != nil {
		log.Println(err)
		data := map[string]string{"success": "false", "errorMsg": errors.New("Internal Server Error").Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}
	data := map[string]string{"success": "true"}
	views.SendResponse(w, data, http.StatusCreated)
}

func (self *AuthController) Login(w http.ResponseWriter, r *http.Request) {
	setupCorsResponse(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}

	var loginUser *models.User

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&loginUser)
	if err != nil {
		log.Println(err)
		data := map[string]string{"errorMsg": constants.ErrInternalServer.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}

	resUser, err := self.us.Authenticate(loginUser)
	if err != nil {
		data := map[string]string{"errorMsg": err.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
		return
	}

	token, err := self.us.GenerateAccessToken(resUser.Email)
	if err != nil {
		log.Println(err)
		data := map[string]string{"errorMsg": constants.ErrInternalServer.Error()}
		views.SendResponse(w, data, http.StatusForbidden)
	}

	res := struct {
		Token        string
		Id           primitive.ObjectID
		AccessRights models.AccessRights
		Email        string
		Username     string
		Score        int
	}{
		token,
		resUser.Id,
		resUser.AccessRights,
		resUser.Email,
		resUser.Username,
		resUser.Score,
	}

	views.SendResponse(w, res, http.StatusOK)
}

func (self *AuthController) Activation(w http.ResponseWriter, r *http.Request) {
	setupCorsResponse(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}

	params := mux.Vars(r)
	tokenUUID := params["token"]

	if tokenUUID == "" {
		views.SendResponse(w, nil, http.StatusForbidden)
		return
	}

	err := self.us.Activate(tokenUUID)
	if err != nil {
		views.SendResponse(w, nil, http.StatusForbidden)
		return
	}

	views.SendResponse(w, nil, http.StatusOK)
}
