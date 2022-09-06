import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import UserService from "../../services/user.service";
import AuthService from "../../services/auth.service";
import { useTranslation } from "react-i18next";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';


const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const user = AuthService.getCurrentUser()

export default function UsersTableRow(props) {
    const { t } = useTranslation();

    const [open, setOpen] = React.useState(false);
    const [isActive, setIsActive] = React.useState(props.row.isActive.toString());
    const [access, setAccess] = React.useState({
        read: true,
        write: false,
        edit: false,
      });
    
    const handleChangeCheckbox = (event) => {
        setAccess({ ...access, [event.target.name]: event.target.checked });
    };

    const handleChangeRadio = (event) => {
        setIsActive(event.target.value);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function updateUser() {
        let email = document.getElementById('email').value
        let username = document.getElementById('username').value
        let score = document.getElementById('score').value
        let a_read = document.getElementById('aread').value
        let a_write = document.getElementById('awrite').value
        let a_edit = document.getElementById('aedit').value
        let active = isActive
        console.log(a_read)
        console.log()

        UserService.updateuser(props.row.id, email, username, {
            "read":  a_read === "true" ? true : false ,
            "write":  a_write === "true" ? true : false , 
            "edit": a_edit === "true" ? true : false
        },
            active === "true" ? true : false, 
            parseInt(score))
        const newList = props.rows.map((item) => {
          if (item.id === props.row.id) {
            const updatedItem = {
                id: props.row.id,
                email: email,
                username: username,
                access: a_read+","+a_write+","+a_edit,
                isActive: active,
                score: score,
            };
            return updatedItem;
          } return item;
        });

        props.setRows(newList)
        handleClose()
    }

    function deleteUser() {
        console.log(props.rows)
        UserService.deleteUser(props.row.id)

        let newList = props.rows.filter((item) => item.id !== props.row.id);
        props.setRows(newList)
    }
    const user = AuthService.getCurrentUser()

return (<React.Fragment>
        <StyledTableRow key={props.row.id}>
            <StyledTableCell component="th" scope="row">
                {props.row.email}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row">
                {props.row.username}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row">
                {props.row.access}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row">
                {props.row.isActive.toString()}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row">
                {props.row.score}
            </StyledTableCell>
            <StyledTableCell align="right">
                {user.Email !== props.row.email &&
                    <React.Fragment>
                        <EditIcon color="primary" onClick={handleClickOpen} />
                        <DeleteIcon color="secondary" onClick={deleteUser} />
                    </React.Fragment>
                }
            </StyledTableCell>
        </StyledTableRow>


        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{t("update_title")} - {props.row.username}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {t("user_details_text")}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    variant="outlined"
                    label="Email"
                    type="text"
                    defaultValue={props.row.email}
                    fullWidth
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="username"
                    variant="outlined"
                    label="Username"
                    type="text"
                    defaultValue={props.row.username}
                    fullWidth
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="score"
                    variant="outlined"
                    label="score"
                    type="text"
                    defaultValue={props.row.score}
                    fullWidth
                />
                <br /><br />
                <DialogContentText>
                    {t("access_rights_text")}
                </DialogContentText>
                <FormGroup row>
                    <FormControlLabel
                        control={<Checkbox checked={access.read} onChange={handleChangeCheckbox} color="primary" name="read" value={access.read}
                        id="aread"
                        />}
                        label="Read"
                        
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="awrite"
                                checked={access.write}
                                onChange={handleChangeCheckbox}
                                name="write"
                                color="secondary"
                                value={access.write}
                            />
                        }
                        label="Write"
                    />
                     <FormControlLabel
                        control={
                            <Checkbox
                                checked={access.edit}
                                id="aedit"
                                onChange={handleChangeCheckbox}
                                name="edit"
                                color="secondary"
                                value={access.edit}
                            />
                        }
                        label="Edit"
                    />
                    
                </FormGroup>
                <br />
                <FormControl component="fieldset">
                    <FormLabel component="legend">{t("is_active_text")}</FormLabel><br/>
                    <RadioGroup aria-label="isactive" name="uactive" value={isActive} onChange={handleChangeRadio}>
                        <FormControlLabel value="true" control={<Radio />} label="True" />
                        <FormControlLabel value="false" control={<Radio color="primary"/>}  label="False" />
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    {t("cancel")}
                </Button>
                <Button onClick={updateUser} color="primary">
                    {t("edit")}
                </Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>
    );
}