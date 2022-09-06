import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import Footer from './Footer';
import Table from './UsersTable';
import { useTranslation } from "react-i18next";
import AuthService from "../../services/auth.service";

export default function LeaderboardPage() {
  const { t } = useTranslation();

  const sections = [
    { title: t("menu_matches"), url: '/dashboard' },
    { title: t("menu_profile"), url: '/profile' },
    { title: t("menu_leaderboard"), url: '/leaderboard' },
  ];

  const mainFeaturedPost = {
    title: t("admin_panel"),
    description:
      t("manage_users"),
    image: 'https://source.unsplash.com/featured/?administrator',
  };
  if (AuthService.canEdit() && AuthService.canWrite())
    return (
        <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg">
            <Header title={t("header_title")} sections={sections} />
            <main>
            <MainFeaturedPost post={mainFeaturedPost} />
            <Grid container>
                <h3>{t("users_list")}</h3>
                <Table />
            
            </Grid>
            </main>
        </Container>
        <Footer title="PW 2021" description={t("footer_desc")} />
        </React.Fragment>
        );
  else
      return <div>nothing</div>
}