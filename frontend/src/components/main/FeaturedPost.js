import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Hidden from '@material-ui/core/Hidden';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import EditMatch from "./EditMatch";
import { useTranslation } from "react-i18next";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";

const useStyles = makeStyles({
  card: {
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
  vsText: {
    fontSize: 20,
  },
});

const user = AuthService.getCurrentUser()

export default function FeaturedPost(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { post } = props;

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
    let teamAScore = document.getElementById('teamA_score').value
    let teamBScore = document.getElementById('teamB_score').value
    console.log(matchId, userId, teamAScore, teamBScore)
    UserService.addPrediction(matchId, userId, teamAScore, teamBScore)
    handleClose()
  }

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component="a" href="#" onClick={handleClickOpen}>
        <Card className={classes.card}>
          <div className={classes.cardDetails}>
            <CardContent>
              <Typography component="h2" variant="h5">
                {post.teamA} vs {post.teamB}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {post.date}
              </Typography>
              <Typography variant="subtitle1" paragraph>
                {post.group}
              </Typography>
              <Typography variant="subtitle1" color="primary">
                {t("place_bet")}
              </Typography>
            </CardContent>
          </div>
          <Hidden xsDown>
            <CardMedia className={classes.cardMedia} image={post.image} />
          </Hidden>
        </Card>
      </CardActionArea>
      
      <EditMatch post={props.post} featuredPosts={props.featuredPosts} setFeaturedPosts={props.setFeaturedPosts}/>


      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth="true" maxWidth="xs">
        <DialogTitle id="form-dialog-title">{t("place_match_title")}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignItems="center" justify="center">
            <Grid item xs={3}>
              <TextField id="teamA_score" type="number" inputProps={{ min: "0", max: "20", step: "1" }} label={post.teamA} fullWidth="true" />
            </Grid>
            <p className={classes.vsText}>vs</p>
            <Grid item xs={3}>
              <TextField id="teamB_score" type="number" inputProps={{ min: "0", max: "20", step: "1" }} label={post.teamB} fullWidth="true" />
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
  post: PropTypes.object,
};