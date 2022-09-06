package views

import (
	"encoding/json"
	"log"
	"net/http"
)

func SendResponse(w http.ResponseWriter, data interface{}, code int) {
	w.Header().Set("Content-Type", "application/json")

	jsonRes, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusForbidden)
		return
	}
	w.WriteHeader(code)
	w.Write(jsonRes)
}
