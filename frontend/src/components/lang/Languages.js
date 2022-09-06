import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import FlagIcon from '@material-ui/icons/Flag';
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function LanguageButtons() {
  const classes = useStyles();
  const { i18n } = useTranslation();

  // const [currLang, setLang] = useState('ro');

  const setRoLang = () => {
    i18n.changeLanguage('ro');
  };

  const setEnLang = () => {
    i18n.changeLanguage('en');
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        className={classes.button}
        startIcon={<FlagIcon />}
        onClick={setEnLang}
      >
        EN
      </Button>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        className={classes.button}
        startIcon={<FlagIcon />}
        onClick={setRoLang}
      >
        RO
      </Button>
    </div>
  );
}