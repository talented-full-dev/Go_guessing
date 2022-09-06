import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import Paper from '@material-ui/core/Paper';
import Footer from './Footer';
import Typography from '@material-ui/core/Typography';
import Avatar from '../avatar.png'
import AuthService from "../../services/auth.service";
import { useTranslation } from "react-i18next";
import Predictions from './PredictionsTable';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  sidebarAboutBox: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    textAlign: 'center',
  },
}));

const user = AuthService.getCurrentUser()

export default function ProfilePage() {
  const classes = useStyles();
  const { t } = useTranslation();

  const mainFeaturedPost = {
    title: t("menu_profile"),
    description:
      t("title_profile"),
    image: 'https://source.unsplash.com/random',
  };
  
  const sections = [
    { title: t("menu_matches"), url: '/dashboard' },
    { title: t("menu_profile"), url: '/profile' },
    { title: t("menu_leaderboard"), url: '/leaderboard' },
  ];
  
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title={t("header_title")} sections={sections} />
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={3} justify="center" alignItems="center">
            <Grid item xs={12}>
                <Paper elevation={3} className={classes.sidebarAboutBox}>
                    <Typography gutterBottom>
                        <img src={Avatar} alt=""/>
                    </Typography>
                    <Typography variant="h6">
                        {t("email_address")}: {user.Email}
                    </Typography>
                    <Typography variant="h6">
                    {t("username")}: {user.Username}
                    </Typography>
                    <Typography variant="h6">
                    {t("score")}: {user.Score}
                    </Typography>
                    {/* <Typography variant="h6">
                        Predictions: 13
                    </Typography> */}
                </Paper>
            </Grid>
            <Grid item xs={12}>
              <h3>{t("history")}</h3>
                <Predictions/>
            </Grid>
          </Grid>
        </main>
      </Container>
      <Footer title="PW 2021" description={t("footer_desc")} />
     
     
    </React.Fragment>
  );
}