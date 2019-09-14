import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Card from "./packs/Card.js";
import CardBody from "./packs/CardBody.js";
import CardHeader from "./packs/CardHeader.js";

const useStyles = makeStyles(theme => ({
  value: {
  	paddingRight: '20px',
  },
  cardTitle: {
    marginTop: "0",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    fontSize: '1.5em'
  }
}));

function createData(name, value) {
  return { name, value };
}

const rows = [
  createData('Device Name', 'Raspberry Pi'),
  createData('IPv4 Address', '127.0.0.1'),
  createData('IPv6 Address', '127.0.0.1'),
];

function Status(props) {
	const classes = useStyles();
  const socket = props.socket;
	return (

    <Card>
      <CardHeader color="danger">
        <h4 className={classes.cardTitle}>Raspberry Pi Info</h4>
      </CardHeader>
      <CardBody>
        <Table>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
              <TableCell className={classes.value} align="right">{row.value}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}

export default Status;
