
import AuthService from "../../services/auth.service";
import {useParams, useHistory } from "react-router-dom";

export default function Activate(props) {
    let { id } = useParams();
    let history = useHistory();

    AuthService.activate(id).then(
        () => {
            history.push("/");
        },
        error => {
            history.push("/notfound");
        }
    );
    return null;
}
