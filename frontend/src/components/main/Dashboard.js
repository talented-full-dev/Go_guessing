import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Footer from './Footer';
import UserService from "../../services/user.service";
import AddMatch from './AddMatch'
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  pad: {
    paddingBottom: 10
  }
}));


export default function Dashboard() {
  const classes = useStyles();
  let [featuredPosts, setFeaturedPosts] = useState([])
  const { t } = useTranslation();

  const mainFeaturedPost = {
    title: t("banner_title"),
    description:
      t("banner_desc"),
    image: 'https://source.unsplash.com/featured/?soccer',
  };

  const sections = [
    { title: t("menu_matches"), url: '/dashboard' },
    { title: t("menu_profile"), url: '/profile' },
    { title: t("menu_leaderboard"), url: '/leaderboard' },
  ];

  useEffect(() => {
    async function getAllMatches()  {
      const results = await UserService.allMatches()
      setFeaturedPosts(results)
    }
    getAllMatches()
  },[]);

  if(featuredPosts)
    return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg">
          <Header title={t("header_title")} sections={sections} />
          <main>
            <MainFeaturedPost post={mainFeaturedPost} />
            <Grid container justify="flex-end" className={classes.pad}>
              <AddMatch featuredPosts={featuredPosts} setFeaturedPosts={setFeaturedPosts}/>
            </Grid>

            <Grid container spacing={4}>
              {featuredPosts.map((post) => (
                <FeaturedPost key={post._id} post={post} featuredPosts={featuredPosts} setFeaturedPosts={setFeaturedPosts}/>
              ))}
            </Grid>
          </main>
        </Container>
        <Footer title="PW 2021" description={t("footer_desc")} />
      </React.Fragment>
    );
  else
    return <div><center> <ClipLoader size={150} /></center></div>
}