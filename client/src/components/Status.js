import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Card from "./packs/Card.js";
import CardBody from "./packs/CardBody.js";
import CardHeader from "./packs/CardHeader.js";
import Button from "./packs/Button.js";
import Slider from '@material-ui/core/Slider';


const useStyles = makeStyles(theme => ({
  cardTitle: {
    marginTop: "0",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    fontSize: '1.5em'
  },
}));

function Status(props) {
	const classes = useStyles();
  const socket = props.socket;

  const [ip, setIP] = useState('127.0.0.1');
  const [ram, setRAM] = useState('50%');
  const [cpu, setCPU] = useState('75%');
  socket.on('status', (data) => {
    setIP(data.ip);
    setRAM(data.ram);
    setCPU(data.cpu);
  });

	return (
    <Card>
      <CardHeader color="danger">
        <h4 className={classes.cardTitle}>Raspberry Pi Info</h4>
      </CardHeader>
      <CardBody>
        <Grid container spacing={1}>
          <Grid item xs={6} sm={6}>
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Device Name
                  </TableCell>
                  <TableCell align="right">Raspberry Pi</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    IPv4 Address
                  </TableCell>
                  <TableCell align="right">{ip}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    RAM Usage
                  </TableCell>
                  <TableCell align="right">{ram}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    CPU Usage
                  </TableCell>
                  <TableCell align="right">{cpu}</TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </Grid>


          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="danger" className={classes.button} fullWidth>
              Autonomous Mode
            </Button>
            <Typography id="discrete-slider" gutterBottom>
              Robot Speed Controller
              <Slider defaultValue={50} aria-labelledby="discrete-slider"
                valueLabelDisplay="auto" step={10} marks min={10} max={100} />
            </Typography>
            <Typography id="discrete-slider" gutterBottom>
              Instruction Duration (sec)
              <Slider defaultValue={1} aria-labelledby="discrete-slider"
                valueLabelDisplay="auto" step={0.5} marks min={0.5} max={5} />
            </Typography>
          </Grid>


        </Grid>
      </CardBody>
    </Card>
  );
}

export default Status;
