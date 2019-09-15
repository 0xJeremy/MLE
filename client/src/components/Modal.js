import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Button from "./packs/Button.js";
import RecordingModal from './RecordingModal';
import ConfirmModal from './ConfirmModal';
import LoadingModal from './LoadingModal';
import SpeechRecognition from "react-speech-recognition";

const useStyles = makeStyles(theme => ({
  record: {
    height: '72px',
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


function Modal(props) {
  const transcript = props.transcript;
  const resetTranscript = props.resetTranscript;
  const startListening = props.startListening;
  const stopListening = props.stopListening;

  const classes = useStyles();
  const socket = props.socket;

  const [recordModal, setRecordModal] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState(false);
  const [loadingModal, setLoadingModal] = React.useState(false);
  const [text, setText] = React.useState('');
  const [searchItem, setSearchItem] = React.useState(null);

  const openRecord = () => {
    startListening();
    setRecordModal(true);
  }

  const cancelRecord = () => {
    stopListening();
    setRecordModal(false);
    resetTranscript();
  }

  const closeRecord = () => {
    stopListening();
    setRecordModal(false);
    setLoadingModal(true);
    socket.emit('speech', transcript)
  }

  const cancelConfirm = () => {
    setConfirmModal(false);
    resetTranscript();
  }

  const tryAgain = () => {
    setConfirmModal(false);
    openRecord();
  }

  const confirm = () => {
    setConfirmModal(false);
    socket.emit('confirmItem', true);
  }

  const closeLoading = () => {
    setLoadingModal(false);
    resetTranscript();
  }

  socket.on('searchItem', (data) => {
    setLoadingModal(false);
    setConfirmModal(true);
    setSearchItem(data);
  });

  return (
    <div>
      <Button onClick={openRecord} variant="contained" color="success" className={classes.record} fullWidth>
        Find An Object!
      </Button>
      <RecordingModal state={recordModal} close={closeRecord} cancel={cancelRecord}/>
      <LoadingModal state={loadingModal} cancel={closeLoading}/>
      <ConfirmModal state={confirmModal} cancel={cancelConfirm} again={tryAgain} confirm={confirm} text={searchItem}/>
    </div>
  );
}

export default SpeechRecognition(Modal);
