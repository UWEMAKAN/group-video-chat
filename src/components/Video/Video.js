import React from 'react';
import classes from './Video.module.css';

const Video = (props) => {
  if (props.muted) {
    return <video muted className={classes.Video} ref={props.videoRef} autoPlay playsInline></video>;
  }
  return <video className={classes.Video} ref={props.videoRef} autoPlay playsInline></video>;
};

export default Video;
