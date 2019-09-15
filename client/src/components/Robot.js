import React from 'react';
import Camera from './Camera';
import ManualControl from './ManualControl';
import Status from './Status';

function Robot(props) {
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