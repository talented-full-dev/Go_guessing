package models

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"log"
)

func NewMatchModel(services *Services) MatchModel {
	return &matchMongo{services}
}

type Match struct {
	Id    primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	TeamA string             `json:"teamA" bson:"teamA"`
	TeamB string             `json:"teamB" bson:"teamB"`
	Group string             `json:"group" bson:"group"`
	Date  string             `json:"date" bson:"date"`
	Image string             `json:"image" bson:"image"`
}

type MatchModel interface {
	FindById(id primitive.ObjectID) (*Match, error)
	FindAll() ([]Match, error)
	//
	Create(match *Match) error
	Update(match *Match) error
	Delete(id primitive.ObjectID) error
}

var _ MatchModel = &matchMongo{}

type matchMongo struct {
	servs *Services
}

func (mg *matchMongo) FindById(id primitive.ObjectID) (*Match, error) {
	var resultMatch Match
	matchesCollection := mg.servs.db.Collection("matches")

	filter := bson.D{{"_id", id}}

	err := matchesCollection.FindOne(context.TODO(), filter).Decode(&resultMatch)
	if err != nil {
		return nil, err
	}

	fmt.Printf("Found a single document: %+v\n", resultMatch)

	return &resultMatch, nil
}

func (mg *matchMongo) FindAll() ([]Match, error) {
	var results []Match

	matchesCollection := mg.servs.db.Collection("matches")

	cursor, err := matchesCollection.Find(context.TODO(), bson.D{})
	if err != nil {
		return nil, err
	}

	if err := cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	fmt.Printf("Extracted all matches: %+v\n", results)
	return results, nil

}

func (mg *matchMongo) Create(match *Match) error {
	matchesCollection := mg.servs.db.Collection("matches")

	res, err := matchesCollection.InsertOne(context.TODO(), match)
	if err != nil {
		return err
	}

	log.Println("Created match with id=", res.InsertedID)
	return nil
}

func (mg *matchMongo) Update(match *Match) error {
	matchesCollection := mg.servs.db.Collection("matches")

	filter := bson.D{{"_id", match.Id}}

	updateResult, err := matchesCollection.ReplaceOne(context.TODO(), filter, match)
	if err != nil {
		return err
	}

	fmt.Printf("Matched %v documents and updated %v documents.\n", updateResult.MatchedCount, updateResult.ModifiedCount)

	return nil
}

func (mg *matchMongo) Delete(id primitive.ObjectID) error {
	matchesCollection := mg.servs.db.Collection("matches")

	filter := bson.M{"_id": id}

	_, err := matchesCollection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return err
	}

	fmt.Printf("Deleted object with _id: %v \n", id)
	return nil
}
