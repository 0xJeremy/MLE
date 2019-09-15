import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import OpenWith from "@material-ui/icons/OpenWith";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Card from "./packs/Card.js";
import CardBody from "./packs/CardBody.js";
import CardHeader from "./packs/CardHeader.js";
import CardIcon from "./packs/CardIcon.js";
import Button from "./packs/Button.js";
import Modal from "./Modal"


const useStyles = makeStyles(theme => ({
  button: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  body: {
    paddingTop: '0',
    paddingBottom: '0'
  },
  end: {
    marginBottom: '40px',
  },
  textField: {
    width: '100%',
  },
}));

function ManualControl(props) {
  const classes = useStyles();

  const rNum = props.rNum;
  const socket = props.socket;

  const [searchItem, setSearchItem] = useState({
    item: '// not currently searching //',
  });

  socket.on('newItem', (data) => {
    setSearchItem(data);
  });

  const handleChange = item => event => {
    setSearchItem({ ...searchItem, [item]: event.target.value });
  };


  function Row1() {
    return (
      <React.Fragment>
        <Grid item xs={4}>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" color="warning" className={classes.button} fullWidth>
            <ExpandLess />
          </Button>
        </Grid>
        <Grid item xs={4}>
        </Grid>
      </React.Fragment>
    );
  }

  function Row2() {
    return (
      <React.Fragment>
        <Grid item xs={4}>
          <Button variant="contained" color="warning" className={classes.button} fullWidth>
            <ChevronLeft />
          </Button>
        </Grid>
        <Grid item xs={4}>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" color="warning" className={classes.button} fullWidth>
            <ChevronRight />
          </Button>
        </Grid>
      </React.Fragment>
    );
  }

  function Row3() {
    return (
      <React.Fragment>
        <Grid item xs={4}>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" color="warning" className={classes.button} fullWidth>
            <ExpandMore />
          </Button>
        </Grid>
        <Grid item xs={4}>
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <Card className={classes.end}>
      <CardHeader color="warning" icon>
        <CardIcon color="warning">
        <OpenWith />
      </CardIcon>
      </CardHeader>
      <CardBody className={classes.body}>
        <Grid container spacing={1}>


          <Grid item xs={6} sm={6}>
            <TextField id="outlined-name" label="Search Item" className={classes.textField} 
              value={searchItem.item} onChange={handleChange('item')} 
              margin="normal" variant="outlined" />
            <Modal socket={socket}/>
          </Grid>

          <Grid item xs={6} sm={6}>
            <Grid container spacing={0} justify="center">
              <Grid container item xs={12} spacing={2}>
                <Row1 />
              </Grid>
              <Grid container item xs={12} spacing={2}>
                <Row2 />
              </Grid>
              <Grid container item xs={12} spacing={2}>
                <Row3 />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        
      </CardBody>
    </Card>
  );
}

export default ManualControl;
