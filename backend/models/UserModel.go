package models

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
)

// User represents the user model stored in our database
type User struct {
	Id           primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Email        string             `json:"email" bson:"email"`
	Username     string             `json:"username" bson:"username"`
	PasswordHash string             `json:"password_hash" bson:"password_hash"`
	Password     string             `json:"password" bson:"-"`
	UUID         string             `json:"uuid" bson:"uuid"`
	AccessRights AccessRights       `json:"access_rights" bson:"access_rights"`
	IsActive     bool               `json:"is_active" bson:"is_active"`
	Score        int                `json:"score" bson:"score"`
}

type AccessRights struct {
	Read  bool `json:"read" bson:"read"`
	Write bool `json:"write" bson:"write"`
	Edit  bool `json:"edit" bson:"edit"`
}

type UserModel interface {
	FindAll() ([]User, error)

	// Methods for querying for single user
	FindById(id primitive.ObjectID) (*User, error)
	FindByEmail(email string) (*User, error)
	FindByUUID(token string) (*User, error)

	// This function validate all fields for create and update
	Validate(user *User, action string) error

	// Methods for altering user
	Create(user *User) error
	Update(user *User) error
	Delete(id primitive.ObjectID) error

	GetTop() ([]User, error)
}

var _ UserModel = &userValidator{}
var _ UserModel = &userMongo{}

type userMongo struct {
	servs *Services
}


func (ug *userMongo) FindAll() ([]User, error) {
	usersCollection := ug.servs.db.Collection("users")
	var results []User

	cursor, err := usersCollection.Find(context.TODO(), bson.D{})
	if err != nil {
		return nil, err
	}

	if err := cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	fmt.Printf("Extracted all users: %+v\n", results)
	return results, nil
}

func (ug *userMongo) FindById(id primitive.ObjectID) (*User, error) {
	usersCollection := ug.servs.db.Collection("users")
	var resultUser User

	filter := bson.D{{"_id", id}}

	err := usersCollection.FindOne(context.TODO(), filter).Decode(&resultUser)
	if err != nil {
		return nil, err
	}

	fmt.Printf("Found a single document: %+v\n", resultUser)

	return &resultUser, nil
}

func (ug *userMongo) FindByUUID(uuidToken string) (*User, error) {
	usersCollection := ug.servs.db.Collection("users")
	var resultUser User

	filter := bson.D{{"uuid", uuidToken}}

	err := usersCollection.FindOne(context.TODO(), filter).Decode(&resultUser)
	if err != nil {
		return nil, err
	}

	fmt.Printf("Found a single document: %+v\n", resultUser)

	return &resultUser, nil
}

func (ug *userMongo) FindByEmail(email string) (*User, error) {
	usersCollection := ug.servs.db.Collection("users")
	var resultUser User

	filter := bson.D{{"email", email}}

	err := usersCollection.FindOne(context.TODO(), filter).Decode(&resultUser)
	if err != nil {
		return nil, err
	}

	fmt.Printf("Found a single document: %+v\n", resultUser)

	return &resultUser, nil
}

func (ug *userMongo) Validate(user *User, action string) error {
	return nil
}

func (ug *userMongo) Create(user *User) error {
	usersCollection := ug.servs.db.Collection("users")

	res, err := usersCollection.InsertOne(context.TODO(), user)
	if err != nil {
		return err
	}

	log.Println("Created user with id=", res.InsertedID)

	return nil
}

func (ug *userMongo) Update(user *User) error {
	usersCollection := ug.servs.db.Collection("users")

	filter := bson.D{{"_id", user.Id}}

	updateResult, err := usersCollection.ReplaceOne(context.TODO(), filter, user)
	if err != nil {
		return err
	}

	fmt.Printf("Matched %v documents and updated %v documents.\n", updateResult.MatchedCount, updateResult.ModifiedCount)

	return nil
}

func (ug *userMongo) Delete(id primitive.ObjectID) error {
	usersCollection := ug.servs.db.Collection("users")

	filter := bson.M{"_id": id}

	_, err := usersCollection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return err
	}

	fmt.Printf("Deleted object with _id: %v \n", id)
	return nil
}

func (ug *userMongo) GetTop() ([]User, error) {
	findOptions := options.Find()
	// Sort by `score` field descending
	findOptions.SetSort(bson.D{{"score", -1}})

	usersCollection := ug.servs.db.Collection("users")
	var results []User

	cursor, err := usersCollection.Find(context.TODO(), bson.D{}, findOptions)
	if err != nil {
		return nil, err
	}

	if err := cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	fmt.Printf("Extracted top users: %+v\n", results)
	return results, nil
}


