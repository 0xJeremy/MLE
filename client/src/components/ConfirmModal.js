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
    fontSize: '1.5em'
  },
  search: {
    fontSize: '2em'
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

function ConfirmModal(props) {
  const classes = useStyles();
  const state = props.state;
  const again = props.again;
  const confirm = props.confirm;
  const cancel = props.cancel;
  const text = props.text;

  return (
    <div>
      <Dialog onClose={cancel} aria-labelledby="customized-dialog-title" open={state}>
        <DialogTitle id="customized-dialog-title" onClose={cancel}>
          Confirm Object
        </DialogTitle>
        <DialogContent dividers>
          <Typography className={classes.prompt} align="center" gutterBottom>
            Is the following object correct?
          </Typography>
          <Typography className={classes.search} align="center" gutterBottom>
            {text}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="danger" onClick={again}>Try Again</Button>
          <Button color="success" onClick={confirm}>Confirm!</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfirmModal;
