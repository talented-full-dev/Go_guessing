import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import Footer from './Footer';
import Table from './PlayersTable';
import { useTranslation } from "react-i18next";
import DonutChart from './statistics/DonutChart';
import LineChart from './statistics/LineChart';
import BarChart from './statistics/BarChart';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import AuthService from "../../services/auth.service";

const useStyles = makeStyles((theme) => ({
  statistics: {
    padding: 50,
    backgroundColor: theme.palette.grey[100],
    display: 'flex',
    justifyContent: 'center',
    margin: 20
  },
}));

export default function LeaderboardPage() {
  const classes = useStyles();

  const { t } = useTranslation();

  const sections = [
    { title: t("menu_matches"), url: '/dashboard' },
    { title: t("menu_profile"), url: '/profile' },
    { title: t("menu_leaderboard"), url: '/leaderboard' },
  ];

  const mainFeaturedPost = {
    title: t("menu_leaderboard"),
    description:
      t("top_100"),
    image: 'https://source.unsplash.com/featured/?mathematics',
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title={t("header_title")} sections={sections} />
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container>
            <h3>{t("top_100")}</h3>
            <Table />
            { AuthService.canEdit() &&
             AuthService.canWrite() &&
             <React.Fragment>
            <Grid item xs={6} >
              <center><h3>{t("player_scores")}</h3></center>
              <Paper elevation={3} className={classes.statistics}>
                <BarChart />
              </Paper>
            </Grid>
            <Grid item xs={6} >
            <center><h3>{t("prediction_by_matches")}</h3></center>
            <Paper elevation={3} className={classes.statistics}>
            <LineChart />
            </Paper>
            </Grid>
            <Grid item xs={12} >
            <center><h3>{t("favourite_scores")}</h3></center>
              <Paper elevation={3} className={classes.statistics}>
                <DonutChart />
              </Paper>
            </Grid>
            </React.Fragment>
          }
          </Grid>
        </main>
      </Container>
      <Footer title="PW 2021" description={t("footer_desc")} />
    </React.Fragment>
  );
}