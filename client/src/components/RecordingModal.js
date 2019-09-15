import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from "@material-ui/core/styles";
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from "./packs/Button.js";
import Mic from "@material-ui/icons/Mic";

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles(theme => ({
  record: {
    height: '45%',
    fontSize: '1.2em',
  },
  mic: {
    width: '80px',
    height: '80px'
  },
  prompt: {
    fontSize: '2em'
  },
  search: {
    color: ''
  }
}));

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function RecordingModal(props) {
  const classes = useStyles();
  const state = props.state;
  const close = props.close;
  const cancel = props.cancel;

  return (
    <div>
      <Dialog onClose={cancel} aria-labelledby="customized-dialog-title" open={state}>
        <DialogTitle id="customized-dialog-title" onClose={cancel}>
          Find Object
        </DialogTitle>
        <DialogContent dividers>
          <Typography className={classes.prompt} align="center" gutterBottom>
            What would you like to find?
          </Typography>
          <Typography align="center" gutterBottom>
            <Mic className={classes.mic}/>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="success" onClick={close}>Done!</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RecordingModal;
