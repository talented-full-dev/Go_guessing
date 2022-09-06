import axios from "axios";
import authHeader from './auth-header';

const API_URL = "http://localhost:5000/";

class UserService {
    allMatches() {
        return axios
            .get(API_URL + "matches", { headers: authHeader()})
            .then(response => {
                return response.data;
            });
    }

    allUsers() {
        return axios
            .get(API_URL + "users", { headers: authHeader()})
            .then(response => {
                return response.data;
            });
    }

    getPredictiosByMatches() {
        return axios
            .get(API_URL + "predictions/matches", { headers: authHeader()})
            .then(response => {
                return response.data;
            });
    }

    getFavouriteScores() {
        return axios
            .get(API_URL + "predictions/scores", { headers: authHeader()})
            .then(response => {
                return response.data;
            });
    }

    addMatch(teamA, teamB, group, date, image) {
        return axios
            .post(API_URL + "matches", {
                teamA,
                teamB,
                group,
                date,
                image
            },{ headers: authHeader()})
            .then(response => {
                console.log(response.data)
                return response.data;
            });
    }

    deleteMatch(id) {
        return axios
            .delete(API_URL + "matches/" + id, { headers: authHeader()})
            .then(response => {
                console.log(response.data)
                return response.data;
            });
    }

    deleteUser(id) {
        return axios
            .delete(API_URL + "users/" + id, { headers: authHeader()})
            .then(response => {
                console.log(response.data)
                return response.data;
            });
    }

    editMatch(id, teamA, teamB, group, date, image) {
        return axios
            .put(API_URL + "matches/" + id, {
                teamA,
                teamB,
                group,
                date,
                image
            },{ headers: authHeader()})
            .then(response => {
                console.log(response.data)
                return response.data;
            });
    }

    updateuser(id, email, username, access, active, score) {
        return axios
            .put(API_URL + "users/" + id, {
                email,
                username,
                "access_rights": access,
                "is_active": active,
                score
            },{ headers: authHeader()})
            .then(response => {
                console.log(response.data)
                return response.data;
            });
    }

    getTopPlayers() {
        return axios
            .get(API_URL + "users/top", { headers: authHeader()})
            .then(response => {
                return response.data;
            });
    }

    addPrediction(match_id, user_id, teamA_score, teamB_score) {
        return axios
            .post(API_URL + "predictions", {
                match_id,
                user_id,
                teamA_score,
                teamB_score,
            },{ headers: authHeader()})
            .then(response => {
                console.log(response.data)
                return response.data;
            });
    }

    getUserPredictions(id) {
        return axios
            .get(API_URL + "predictions/" + id, { headers: authHeader()})
            .then(response => {
                console.log(response.data)
                return response.data;
            });
    }

    // getCurrentUser() {
    //     return JSON.parse(localStorage.getItem('user'));;
    // }
}

export default new UserService();