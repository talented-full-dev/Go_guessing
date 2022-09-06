import React from 'react';
import Button from '@material-ui/core/Button';
import AuthService from "../../services/auth.service";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import UserService from "../../services/user.service";
import { useTranslation } from "react-i18next";

export default function AddMatch(props) {
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function addMatch() {
    let teamA = document.getElementById('teamA').value
    let teamB = document.getElementById('teamB').value
    let group = document.getElementById('group').value
    let date = document.getElementById('date').value
    let image = document.getElementById('image').value

    UserService.addMatch(teamA, teamB, group, date, image)

    let newList = props.featuredPosts.concat({ teamA, teamB, group, date, image })
    props.setFeaturedPosts(newList)
    handleClose()
  }

  return (
    <React.Fragment>
      {AuthService.canWrite() &&
        <Button variant="contained" color="primary" onClick={handleClickOpen}> {t("add_match")} </Button>}
      <div>

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{t("add_match_title")}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t("match_desc")}
          </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="teamA"
              label={t("teamA")}
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="teamB"
              label={t("teamB")}
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="group"
              label={t("group")}
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="date"
              label={t("date")}
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="image"
              label={t("image_url")}
              type="text"
              defaultValue="https://source.unsplash.com/featured/?soccer"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {t("cancel")}
          </Button>
            <Button onClick={addMatch} color="primary">
              {t("add")}
          </Button>
          </DialogActions>
        </Dialog>
      </div>
    </React.Fragment>
  );
}

