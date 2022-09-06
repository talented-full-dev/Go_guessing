package models

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
	"guess_the_score/backend/utils/constants"
	"guess_the_score/backend/utils/email"
	"log"
	"time"
)

func NewUserService(services *Services) UserService {
	cg := &userMongo{services}
	cv := newClientValidator(cg, services)
	defineClientValidators(cv)
	return &userService{
		UserModel: cv,
		services:  services,
	}
}

// UserService is a set of methods used to manipulate and
// work with the user model
type UserService interface {
	// Authenticate will verify the provided email address and
	// password are correct. If they are correct, the user
	// corresponding to that email will be returned.
	Authenticate(*User) (*User, error)

	SendActivationLink(user *User) error
	Activate(string) error

	ParseAndVerifyAccessToken(string) error
	GenerateAccessToken(string) (string, error)

	UserModel
}
type UserDB interface {
	// Methods for querying for single user
	FindById(id uint32) (*User, error)
}

var _ UserService = &userService{}

type userService struct {
	UserModel
	services *Services
}

func (us *userService) Authenticate(user *User) (*User, error) {
	err := validateAuthenticationParams(user.Email, user.Password)
	if err != nil {
		return nil, err
	}

	dbUser, err := us.UserModel.FindByEmail(user.Email)
	if err != nil {
		fmt.Println(err)
		return nil, constants.ErrIncorrectPassEmail
	}

	err = bcrypt.CompareHashAndPassword([]byte(dbUser.PasswordHash), []byte(user.Password))
	if err != nil {
		fmt.Println(err)
		return nil, constants.ErrIncorrectPassEmail
	}
	fmt.Println(dbUser)
	if dbUser.IsActive == false {
		return nil, constants.ErrIsNotActivated
	}

	return dbUser, nil
}

func validateAuthenticationParams(email, password string) error {
	if email == "" {
		return constants.ErrNoEmail
	}
	if password == "" {
		return constants.ErrNoPassword
	}

	return nil
}

func (us *userService) SendActivationLink(user *User) error {
	var activationEmail email.Email

	activationEmail.Init()
	log.Println(activationEmail)

	err := activationEmail.Send(user.UUID, user.Email)
	if err != nil {
		return err
	}

	return nil
}

func (us *userService) Activate(token string) error {
	user, err := us.UserModel.FindByUUID(token)
	if err != nil {
		return err
	}

	user.IsActive = true

	err = us.UserModel.Update(user)
	if err != nil {
		return err
	}

	return nil
}

func (us *userService) ParseAndVerifyAccessToken(myToken string) error {
	//token, err := jwt.Parse(myToken, func(token *jwt.Token) ([]byte, error) {
	//	return myLookupKey(token.Header["kid"])
	//})
	//
	//if err == nil && token.Valid {
	//	deliverGoodness("!")
	//} else {
	//	deliverUtterRejection(":(")
	//}
	return nil
}

func (us *userService) GenerateAccessToken(email string) (string, error) {
	mySigningKey := []byte("shhhhhh")

	claims := jwt.MapClaims{}
	claims["email"] = email
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(mySigningKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
