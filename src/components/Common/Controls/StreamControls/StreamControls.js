import React from 'react';
import { FiMic, FiVideo } from 'react-icons/fi';
import Control from '../Control/Control';
import classes from './StreamControls.module.css';

const Controls = ({ size }) => {
  return (
    <div className={classes.Controls}>
      <Control Type={FiMic} size={size} />
      <Control Type={FiVideo} size={size} />
    </div>
  )
}

export default Controls;
