import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Camera from './Camera';
import ManualControl from './ManualControl';
import Status from './Status';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  camera: {
    borderRadius: '6px',
    border: '1px rgb(100, 100, 100) solid',
    borderWidth: '10px 2px 2px 2px',
    marginBottom: '16px',
    marginRight: '8px'
  },
}));

function Robot(props) {
  const classes = useStyles();

  const socket = props.socket;

  const rNum = props.rNum;

  return (
    <div>
      <Camera socket={socket} rNum={rNum} />
      <ManualControl socket={socket} rNum={rNum} />
      <Status socket={socket} rNum={rNum} />
    </div>
  );
}

export default Robot;