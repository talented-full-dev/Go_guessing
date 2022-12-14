import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import {
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Hidden,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField
} from '@material-ui/core';
import EditMatch from "./EditMatch";
import {useTranslation} from "react-i18next";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";

const useStyles = makeStyles({
    card: {
        display: 'flex'
    },
    cardDetails: {
        flex: 1
    },
    cardMedia: {
        width: 160
    },
    vsText: {
        fontSize: 20
    }
});

const user = AuthService.getCurrentUser()

export default function FeaturedPost(props) {
    const {t} = useTranslation();
    const classes = useStyles();
    const {post} = props;

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function addPrediction() {
        let matchId = props.post._id
        let userId = user.Id
        let teamAScore = document
            .getElementById('teamA_score')
            .value
        let teamBScore = document
            .getElementById('teamB_score')
            .value
            console
            .log(matchId, userId, teamAScore, teamBScore)
        UserService.addPrediction(matchId, userId, teamAScore, teamBScore)
        handleClose()
    }

    return (
        <Grid item="item" xs={12} md={6}>
            <CardActionArea component="a" href="#" onClick={handleClickOpen}>
                <Card className={classes.card}>
                    <div className={classes.cardDetails}>
                        <CardContent>
                            <Typography component="h2" variant="h5">
                                {post.teamA}
                                vs {post.teamB}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                {post.date}
                            </Typography>
                            <Typography variant="subtitle1" paragraph="paragraph">
                                {post.group}
                            </Typography>
                            <Typography variant="subtitle1" color="primary">
                                {t("place_bet")}
                            </Typography>
                        </CardContent>
                    </div>
                    <Hidden xsDown="xsDown">
                        <CardMedia className={classes.cardMedia} image={post.image}/>
                    </Hidden>
                </Card>
            </CardActionArea>

            <EditMatch
                post={props.post}
                featuredPosts={props.featuredPosts}
                setFeaturedPosts={props.setFeaturedPosts}/>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth="true"
                maxWidth="xs">
                <DialogTitle id="form-dialog-title">{t("place_match_title")}</DialogTitle>
                <DialogContent>
                    <Grid container="container" spacing={2} alignItems="center" justify="center">
                        <Grid item="item" xs={3}>
                            <TextField
                                id="teamA_score"
                                type="number"
                                inputProps={{
                                    min: "0",
                                    max: "20",
                                    step: "1"
                                }}
                                label={post.teamA}
                                fullWidth="true"/>
                        </Grid>
                        <p className={classes.vsText}>vs</p>
                        <Grid item="item" xs={3}>
                            <TextField
                                id="teamB_score"
                                type="number"
                                inputProps={{
                                    min: "0",
                                    max: "20",
                                    step: "1"
                                }}
                                label={post.teamB}
                                fullWidth="true"/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {t("cancel")}
                    </Button>
                    <Button onClick={addPrediction} color="primary">
                        {t("bet")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}

FeaturedPost.propTypes = {
    post: PropTypes.object
};