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

export default function EditMatch(props) {
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function editMatch() {
    let teamA = document.getElementById('teamA').value
    let teamB = document.getElementById('teamB').value
    let group = document.getElementById('group').value
    let date = document.getElementById('date').value
    let image = document.getElementById('image').value

    UserService.editMatch(props.post._id, teamA, teamB, group, date, image)

    const newList = props.featuredPosts.map((item) => {
      if (item._id === props.post._id) {
        const updatedItem = {
          teamA: teamA,
          teamB: teamB,
          group: group,
          date: date,
          image: image,
        };
        return updatedItem;
      } return item;
    });

    // let deleteList = props.featuredPosts.filter((item) => item._id !== props.post._id);
    // let newList = deleteList.concat({teamA, teamB, group, date, image})
    props.setFeaturedPosts(newList)
    handleClose()
  }

  function deleteMatch() {
    console.log(props.featuredPosts)
    UserService.deleteMatch(props.post._id)

    let newList = props.featuredPosts.filter((item) => item._id !== props.post._id);
    props.setFeaturedPosts(newList)
  }

  return (
    <React.Fragment>
      { AuthService.canWrite() && <Button color="primary" onClick={handleClickOpen}>{t("edit_button")}</Button>}
      { AuthService.canWrite() && <Button color="secondary" onClick={deleteMatch}> {t("delete_button")} </Button>}
      <div>

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{t("edit_match_title")}</DialogTitle>
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
              defaultValue={props.post.teamA}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="teamB"
              label={t("teamB")}
              type="text"
              defaultValue={props.post.teamB}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="group"
              label={t("group")}
              type="text"
              defaultValue={props.post.group}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="date"
              label={t("date")}
              type="text"
              defaultValue={props.post.date}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="image"
              label={t("image_url")}
              type="text"
              defaultValue={props.post.image}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {t("cancel")}
          </Button>
            <Button onClick={editMatch} color="primary">
              {t("edit")}
          </Button>
          </DialogActions>
        </Dialog>
      </div>
    </React.Fragment>
  );
}

