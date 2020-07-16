import React from 'react';
import { FiVolumeX, FiVolume1, FiBarChart, FiVolume2 } from 'react-icons/fi';
import Control from '../Control/Control';
import classes from './Controls.module.css';

const Controls = ({ size }) => {
  return (
    <div className={classes.Controls}>
      <Control Type={FiVolumeX} size={size} />
      <Control Type={FiVolume1} size={size} />
      <Control Type={FiBarChart} size={size} />
      <Control Type={FiVolume2} size={size} />
    </div>
  )
}

export default Controls;
