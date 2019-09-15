import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from "@material-ui/core/styles";
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

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
  },
  progress: {
    margin: theme.spacing(4),
  },
  title: {
    marginRight: '100px',
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

function LoadingModal(props) {
  const classes = useStyles();
  const state = props.state;
  const cancel = props.cancel;

  return (
    <div>
      <Dialog onClose={cancel} aria-labelledby="customized-dialog-title" open={state}>
        <DialogTitle id="customized-dialog-title" onClose={cancel} >
          <Typography className={classes.title}>
            Processing Speech
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography align="center" gutterBottom>
            <CircularProgress className={classes.progress} />
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LoadingModal;
