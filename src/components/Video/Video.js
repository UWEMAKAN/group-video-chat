import React from 'react';
import classes from './Video.module.css';

const Video = (props) => {
  return <video className={classes.Video} ref={props.videoRef} autoPlay playsInline></video>;
};

export default Video;
