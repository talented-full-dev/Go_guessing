import axios from "axios";

const API_URL = "http://localhost:5000/";

class AuthService {
    login(email, password) {
        return axios
            .post(API_URL + "login", {
                email,
                password
            })
            .then(response => {
                if (response.data.Token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(email, username, password) {
        return axios.post(API_URL + "register", {
            email,
            username,
            password
        });
    }

    activate(id) {
        return axios.get(API_URL + "activation/" + id, {});
    }

    isLogged() {
        return localStorage.getItem('user') !== null
    }

    canWrite() {
        return JSON.parse(localStorage.getItem('user')).AccessRights["write"] === true
    }

    canEdit() {
        return JSON.parse(localStorage.getItem('user')).AccessRights["edit"] === true
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));;
    }
}

export default new AuthService();