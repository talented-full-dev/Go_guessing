package main

import (
	"encoding/json"
	"fmt"
	"os"
)

type Config struct {
	AppName       string        `json:"app_name"`
	HTTPServer    HTTPServer    `json:"http_server"`
	MongoDBConfig MongoDBConfig `json:"database"`
	//Recaptcha   GoogleRecaptchaConfig `json:"google_recaptcha"`
}

type HTTPServer struct {
	Port string `json:"port"`
}

type MongoDBConfig struct {
	Username     string `json:"username"`
	Password     string `json:"password"`
	DatabaseName string `json:"database_name"`
}

func LoadConfig() (*Config, error) {
	f, err := os.Open(".config.json")
	if err != nil {
		return nil, err
	}

	var c Config
	dec := json.NewDecoder(f)
	err = dec.Decode(&c)
	if err != nil {
		return nil, err
	}

	return &c, nil
}

func (c MongoDBConfig) ConnectionInfo() string {
	apiURI := fmt.Sprintf("mongodb+srv://%s:%s@cluster0.l0qbw.mongodb.net/%s?retryWrites=true&w=majority",
		c.Username, c.Password, c.DatabaseName)
	return apiURI
}

func (c MongoDBConfig) Name() string {
	return c.DatabaseName
}
