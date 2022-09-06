package models

import (
	"errors"
	"regexp"
	"strings"
)

func newClientValidator(um UserModel, servs *Services) *userValidator {
	return &userValidator{
		servs:     servs,
		UserModel: um,
	}
}

type userValidator struct {
	UserModel
	servs      *Services
	validators map[string]map[string][]UserValFunc
}

// defineClientValidators is a function that return a slice of
// validator functions to each field of Client model
func defineClientValidators(uv *userValidator) {
	uv.validators = map[string]map[string][]UserValFunc{
		"email": {
			"create": {
				uv.requireEmail,
				uv.requireEmailRegExp,
			},
		},
		"username": {
			"create": {
				uv.requireUsername,
			},
		},
		"password": {
			"create": {
				uv.requirePassword,
			},
		},
	}
}

// Validate is used to validate data before save into database
func (uv *userValidator) Validate(user *User, action string) error {
	err := runClientValidation(user, uv, action)
	if err != nil {
		return err
	}
	return nil
}

func runClientValidation(user *User, uv *userValidator, action string) error {
	for _, valueField := range uv.validators {
		for keyAction, valueAction := range valueField {
			if strings.Contains(keyAction, action) {
				err := runClientValFuncs(user, valueAction...)
				if err != nil {
					return err
				}
			}
		}
	}
	return nil
}

type UserValFunc func(*User) error

func runClientValFuncs(user *User, fns ...UserValFunc) error {
	for _, fn := range fns {
		if err := fn(user); err != nil {
			return err
		}
	}
	return nil
}

func (uv *userValidator) requireUsername(user *User) error {
	if user.Username == "" || len(user.Username) < 6 {
		return errors.New("Username must be more than 5 characters.")
	}
	return nil
}

func (uv *userValidator) requirePassword(user *User) error {
	if user.Password == "" || len(user.Password) < 6 {
		return errors.New("Password must be more than 5 characters.")
	}
	return nil
}

func (uv *userValidator) requireEmail(user *User) error {
	if user.Email == "" || len(user.Email) <= 5 {
		return errors.New("Email must be more than 5 characters.")
	}
	return nil
}

func (uv *userValidator) requireEmailRegExp(user *User) error {
	var emailEXP = regexp.MustCompile(`^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$`)
	if emailEXP.MatchString(user.Email) == false {
		return errors.New("Email must match a form of test@test.com ")
	}
	return nil
}
