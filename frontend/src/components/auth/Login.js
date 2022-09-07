import React, {useState} from 'react';
import Alert from '@material-ui/lab/Alert';
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Checkbox,
    Link,
    Paper,
    Box,
    Grid
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Copyright from './Copyright'
import {useHistory} from "react-router-dom";
import AuthService from "../../services/auth.service";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh'
    },
    image: {
        backgroundImage: 'url(https://source.unsplash.com/featured/?soccer)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: theme.palette.type === 'light'
            ? theme.palette.grey[50]
            : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

export default function SignInSide(props) {
    let history = useHistory();
    const classes = useStyles();
    const {t} = useTranslation();

    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault()
        let email = document.getElementById('email').value
        let password = document.getElementById('password').value
            AuthService.login(email, password).then(() => {
                props.setLogged(true)
                history.push("/dashboard");
            }, error => {
                setErrorMsg(error.response.data.errorMsg)
            });
    }

    return (
        <Grid container="container" component="main" className={classes.root}>
            <CssBaseline/>
            <Grid item="item" xs={false} sm={4} md={7} className={classes.image}/>
            <Grid
                item="item"
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square="square">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} noValidate="noValidate">
                        <TextField
                            margin="normal"
                            required="required"
                            fullWidth="fullWidth"
                            id="email"
                            label={t("email_address")}
                            name="email"
                            autoComplete="email"
                            autoFocus="autoFocus"/>
                        <TextField
                            margin="normal"
                            required="required"
                            fullWidth="fullWidth"
                            name="password"
                            label={t("password")}
                            type="password"
                            id="password"
                            autoComplete="current-password"/>
                        <FormControlLabel
                            control={<Checkbox value = "remember" color = "primary" />}
                            label={t("remember")}/> {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                        <Button
                            type="submit"
                            fullWidth="fullWidth"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={handleSubmit}>
                            {t("login_button")}
                        </Button>
                        <Grid container="container">
                            <Grid item="item" xs="xs">
                                {/* <Link href="#" variant="body2">
                                    Forgot password?
                                 </Link> */
                                }
                            </Grid>
                            <Grid item="item">
                                <Link href="/register" variant="body2">
                                    {t("try_sign_up")}
                                </Link>
                            </Grid>
                        </Grid>
                        <Box mt={5}>
                            <Copyright/>
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}