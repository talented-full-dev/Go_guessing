import React, {useEffect, useState} from 'react';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@material-ui/core/Table';
import UserService from "../../services/user.service";
import AuthService from "../../services/auth.service";
import {useTranslation} from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover
        }
    }
}))(TableRow);

function createData(teamA, teamB, score) {
    return {teamA, teamB, score};
}

const useStyles = makeStyles({
    table: {
        minWidth: 700
    }
});

const user = AuthService.getCurrentUser()

export default function PredictionsTable() {
    const classes = useStyles();
    const {t} = useTranslation();

    let [rows, setRows] = useState(null)

    useEffect(() => {
        async function getPredictions() {
            const results = await UserService.getUserPredictions(user.Id)
            if (results !== null) {
                const rows = results.map(
                    (pred) => (createData(pred.TeamAName, pred.TeamBName, pred.TeamAScore + " - " + pred.TeamBScore))
                )
                setRows(rows)
            } else {
                setRows(false)
            }
            console.log(rows)
        }
        getPredictions()
    }, []);

    if (rows) 
        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>{t("teamA")}</StyledTableCell>
                            <StyledTableCell >{t("teamB")}</StyledTableCell>
                            <StyledTableCell align="right">{t("score")}</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            rows.map((row) => (
                                <StyledTableRow key={row.teamA}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.teamA}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.teamB}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">{row.score}</StyledTableCell>
                                </StyledTableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        );
    else if (rows === false) 
        return <div>
            <center>
                nothing to display
            </center>
        </div>
    else 
        return <div>
            <center>
                <ClipLoader size={150}/></center>
        </div>

}