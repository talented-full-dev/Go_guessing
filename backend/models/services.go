package models

import (
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"context"
	"log"
)

type ServicesConfig func(*Services) error

// Initialize all services with all necessary parameters
func NewServices(cfgs ...ServicesConfig) (*Services, error) {
	var s Services
	for _, cfg := range cfgs {
		if err := cfg(&s); err != nil {
			return nil, err
		}
	}
	return &s, nil
}

type Services struct {
	User       UserService
	Match      MatchModel
	Prediction PredictionModel

	clientDB *mongo.Client
	db       *mongo.Database
}

// Initialize User Service
func WithUserService() ServicesConfig {
	return func(s *Services) error {
		s.User = NewUserService(s)
		return nil
	}
}

func WithMatchModel() ServicesConfig {
	return func(s *Services) error {
		s.Match = NewMatchModel(s)
		return nil
	}
}

func WithPredictionModel() ServicesConfig {
	return func(s *Services) error {
		s.Prediction = NewPredictionModel(s)
		return nil
	}
}

// Open database connection with GORM Package
func WithDatabase(apiURI, databaseName string) ServicesConfig {
	return func(s *Services) error {
		// Connect to MongoDB
		client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(apiURI))
		if err != nil {
			log.Fatal(err)
		}

		// Check the connection
		err = client.Ping(context.TODO(), nil)
		if err != nil {
			log.Fatal(err)
		}

		s.clientDB = client

		db := client.Database(databaseName)

		s.db = db

		log.Println("Connected successfully to Mongo Database!")
		return nil
	}
}

// Closes the database connection.
func (s *Services) CloseDatabase() error {
	return s.clientDB.Disconnect(context.TODO())
}
