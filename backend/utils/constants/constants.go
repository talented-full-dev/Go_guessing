package constants

import "errors"

var (
	ErrInternalServer     = errors.New("Internal Server Error")
	ErrNotFound           = errors.New("resource not found")
	ErrUserMustLogin      = errors.New("user must login")
	ErrClaimsExtract      = errors.New("Can't extract from Claims; not provided or malformed;")
	ErrNoToken            = errors.New("Token not provided or malformed")
	ErrIsNotActivated     = errors.New("Account must be activated first.")
	ErrNoEmail            = errors.New("Email is required.")
	ErrNoUsername         = errors.New("Username is required.")
	ErrNoPassword         = errors.New("Password is required.")
	ErrIncorrectPassEmail = errors.New("Email or password is incorect. Please, try again.")
	ErrRegisteredEmail = errors.New("Email is already used. Please, try to sign in or  to use another email.")
	ErrNoAccessRights = errors.New("No sufficient access rights.")
)
