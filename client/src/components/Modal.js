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
import Microphone from './Microphone';

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

function Modal(props) {
  const classes = useStyles();
  const socket = props.socket;
  const [open1, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [string, setString] = React.useState('');
  const [recording, setRecording] = React.useState(false);
  const [search, setSearch] = React.useState('');

  socket.on('confirm', (data) => {
    setSearch(data);
  })

  const useTranscript = (transcript) => {
    setString(transcript);
  };

  const handleClickOpen = () => {
    setRecording(true);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const askConfirm = () => {
    setOpen(false);
    setOpen2(true);
  };

  const closeSecond = () => {
    setOpen2(false);
  }

  const openSecond = () => {
    setOpen2(true);
  }

  return (
    <div>
      <Button onClick={handleClickOpen} variant="contained" color="success" className={classes.record} fullWidth>
        Find An Object!
      </Button>
        {search == '' &&
          <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open1}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              Find Object
            </DialogTitle>
            <DialogContent dividers>
              <Typography className={classes.prompt} align="center" gutterBottom>
                What would you like to find?
              </Typography>
              <Typography align="center" gutterBottom>
                <Mic className={classes.mic}/>
              </Typography>
              {string != '' && 
                <Typography align="center" gutterBottom>
                  {string}
                </Typography>
              }
            </DialogContent>
            <DialogActions>
                <Microphone report={setString} recording={recording} close={askConfirm}/>
            </DialogActions>
          </Dialog>
        }
        {search != '' &&
          <Dialog onClose={openSecond} aria-labelledby="customized-dialog-title" open={open2}>
            <DialogTitle id="customized-dialog-title" onClose={openSecond}>
              Confirm Object
            </DialogTitle>
            <DialogContent dividers>
              <Typography className={classes.prompt} align="center" gutterBottom>
                Is the following object correct?
              </Typography>
              <Typography className={classes.search} align="center" gutterBottom>
                {search}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={closeSecond}>Try Again</Button>
              <Button color="primary" onClick={closeSecond}>Confirm!</Button>
            </DialogActions>
          </Dialog>
        }
        
      
    </div>
  );
}

export default Modal;
