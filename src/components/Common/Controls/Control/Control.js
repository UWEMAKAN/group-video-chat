import React from 'react';
import { IconContext } from 'react-icons';
import classes from './Control.module.css';


const Control = ({ Type, size, styles={} }) => {
  return (
    <IconContext.Provider value={{ size, className: classes.Color }}>
      <button style={styles} type="button" className={classes.Control}>
        <Type />
      </button>
    </IconContext.Provider>
  );
};

export default Control;
