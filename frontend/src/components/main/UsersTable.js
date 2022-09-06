import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import UserService from "../../services/user.service";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
import UsersTableRow from './UsersTableRow';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

function createData(id, email, username, access, isActive, score) {
  return {id, email , username, access, isActive, score};
}

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function UsersTable() {
  const classes = useStyles();
  const { t } = useTranslation();

  let [rows, setRows] = useState(null)

  useEffect(() => {
    async function getUsers()  {
      const results = await UserService.allUsers()
      const rows = results.map((user) => (
        createData(user._id, user.email, user.username, user.access_rights['read']+","+user.access_rights['write']+","+user.access_rights['edit'], user.is_active, user.score)
      ))
      setRows(rows)
      console.log(rows)
    }
    getUsers()
  },[]);

  if (rows)
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell >{t("username")}</StyledTableCell>
              <StyledTableCell >{t("access_rights_group")}</StyledTableCell>
              <StyledTableCell >{t("is_active_text")}</StyledTableCell>
              <StyledTableCell >{t("score")}</StyledTableCell>
              <StyledTableCell align="right">{t("actions_text")}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <UsersTableRow  rows={rows} row={row} setRows={setRows}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  else 
    return <div><center> <ClipLoader size={150} /></center></div>
}