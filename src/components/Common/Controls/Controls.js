import React from 'react';
import StreamControls from './StreamControls/StreamControls';
import classes from './Controls.module.css';

const Controls = ({ size, styles={} }) => {
  return (
    <div style={styles} className={classes.Controls}>
      <StreamControls size={size} />
    </div>
  )
}

export default Controls;
