import React from 'react';
import SpeechRecognition from "react-speech-recognition";
import Button from "./packs/Button.js";

function Microphone(props) {
	const transcript = props.transcript;
	const resetTranscript = props.resetTranscript;
	const browserSupportsSpeechRecognition = props.browserSupportsSpeechRecognition
	const startListening = props.startListening;
	const stopListening = props.stopListening;
	const report = props.report;
	const recording = props.recording;
	const close = props.close;
  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  if(recording) {
  	startListening();
  }

  function finishRecording() {
  	console.log("Reporting: " + transcript)
  	report(transcript);
  	resetTranscript();
  	stopListening();
  	close();
  }

  return (
    <div>
      <Button color="primary" onClick={finishRecording}>DO IT</Button>
    </div>
  );
}

export default SpeechRecognition(Microphone);
