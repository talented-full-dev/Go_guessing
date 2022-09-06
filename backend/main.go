package main

import (
	"github.com/gorilla/mux"
	"guess_the_score/backend/controllers"
	"guess_the_score/backend/middleware"
	"guess_the_score/backend/models"

	"log"
	"net/http"
	"time"
)

// TODO
// 2. link
// 3. demo datas

func main() {
	var cfg *Config
	cfg, err := LoadConfig()
	must(err)

	// Initiate services with all parameters
	services, err := models.NewServices(
		models.WithDatabase(cfg.MongoDBConfig.ConnectionInfo(), cfg.MongoDBConfig.Name()),
		models.WithUserService(),
		models.WithMatchModel(),
		models.WithPredictionModel(),
	)
	must(err)

	// Initiate controllers
	authController := controllers.NewAuthController(services.User)
	userController := controllers.NewUserController(services.User, services.Prediction)
	matchController := controllers.NewMatchController(services.Match)
	predictionController := controllers.NewPredictionController(services.Match, services.Prediction)

	//Initiate all midlewares
	userMW := middleware.RequireUser{
		UserService: services.User,
	}

	// Initiate all server routes
	r := mux.NewRouter()
	r.HandleFunc("/register", authController.Register).Methods(http.MethodPost, http.MethodOptions)
	r.HandleFunc("/login", authController.Login).Methods(http.MethodPost, http.MethodOptions)
	r.HandleFunc("/activation/{token}", authController.Activation).Methods(http.MethodGet, http.MethodOptions)

	r.HandleFunc("/users", userMW.Required(userController.GetAll)).Methods(http.MethodGet, http.MethodOptions)
	//r.HandleFunc("/users/{id}", userMW.Required(userController.Index)).Methods("GET")
	r.HandleFunc("/users/top", userMW.Required(userController.GetTop)).Methods(http.MethodGet, http.MethodOptions)
	//r.HandleFunc("/users/", authController.Update).Methods("PUT")
	//r.HandleFunc("/users/", authController.Delete).Methods("DELETE")
	r.HandleFunc("/users/{id}", userMW.Required(userController.Update)).Methods(http.MethodPut, http.MethodOptions)
	r.HandleFunc("/users/{id}", userMW.Required(userController.Delete)).Methods(http.MethodDelete, http.MethodOptions)


	r.HandleFunc("/matches", userMW.Required(matchController.GetAll)).Methods(http.MethodGet, http.MethodOptions)
	r.HandleFunc("/matches", userMW.Required(matchController.Create)).Methods(http.MethodPost, http.MethodOptions)
	r.HandleFunc("/matches/{id}", userMW.Required(matchController.Update)).Methods(http.MethodPut, http.MethodOptions)
	r.HandleFunc("/matches/{id}", userMW.Required(matchController.Delete)).Methods(http.MethodDelete, http.MethodOptions)

	r.HandleFunc("/predictions/matches", userMW.Required(predictionController.GetPredictionsByMatches)).Methods(http.MethodGet, http.MethodOptions)
	r.HandleFunc("/predictions/scores", userMW.Required(predictionController.GetFavouriteScores)).Methods(http.MethodGet, http.MethodOptions)
	r.HandleFunc("/predictions/{id}", userMW.Required(predictionController.GetAllByUserId)).Methods(http.MethodGet, http.MethodOptions)
	r.HandleFunc("/predictions", userMW.Required(predictionController.Create)).Methods(http.MethodPost, http.MethodOptions)


	defer func() {
		// Close Database connection
		err = services.CloseDatabase()
		must(err)
	}()

	// Initiate server configuration
	server := &http.Server{
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
		Handler:      r,
		Addr:         ":" + cfg.HTTPServer.Port,
	}

	log.Println("Starting backend application on " + cfg.HTTPServer.Port)
	log.Fatal(server.ListenAndServe())
}

func must(err error) {
	if err != nil {
		log.Println(err)
	}
}
