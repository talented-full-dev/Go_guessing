import React, {useState} from 'react';
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Link,
    Grid,
    Box,
    Typography,
    Container
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {makeStyles} from '@material-ui/core/styles';
import AuthService from "../../services/auth.service";
import {useHistory} from "react-router-dom";
import Alert from '@material-ui/lab/Alert';
import {useTranslation} from "react-i18next";
import Copyright from './Copyright'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
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
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

export default function SignUp() {
    const classes = useStyles();
    let history = useHistory();
    const {t} = useTranslation();

    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault()
        let email = document
            .getElementById('email')
            .value
        let username = document
            .getElementById('username')
            .value
        let password = document
            .getElementById('password')
            .value

            AuthService
            .register(email, username, password)
            .then(() => {
                history.push("/");
                window
                    .location
                    .reload();
            }, error => {
                setErrorMsg(error.response.data.errorMsg)
            });
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    {t("sign_up")}
                </Typography>
                <form className={classes.form} noValidate="noValidate">
                    <Grid container="container" spacing={2}>
                        <Grid item="item" xs={12}>
                            <TextField
                                variant="outlined"
                                required="required"
                                fullWidth="fullWidth"
                                id="email"
                                label={t("email_address")}
                                name="email"
                                autoComplete="email"/>
                        </Grid>
                        <Grid item="item" xs={12}>
                            <TextField
                                variant="outlined"
                                required="required"
                                fullWidth="fullWidth"
                                id="username"
                                label={t("username")}
                                name="username"
                                autoComplete="username"/>
                        </Grid>
                        <Grid item="item" xs={12}>
                            <TextField
                                variant="outlined"
                                required="required"
                                fullWidth="fullWidth"
                                name="password"
                                label={t("password")}
                                type="password"
                                id="password"
                                autoComplete="current-password"/>
                        </Grid>
                        <Grid item="item" xs={12}>
                            {/* <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              /> */
                            }
                        </Grid>
                    </Grid>
                    {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                    <Button
                        type="submit"
                        fullWidth="fullWidth"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSubmit}>
                        {t("register_button")}
                    </Button>
                    <Grid container="container" justify="flex-end">
                        <Grid item="item">
                            <Link href="/" variant="body2">
                                {t("try_login")}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright/>
            </Box>
        </Container>
    );
}