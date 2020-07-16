import React from 'react';
import { FiPower } from 'react-icons/fi';
import Controls from '../Controls/Controls';
import Control from '../Controls/Control/Control';
import classes from './Footer.module.css';

const Footer = () => {
  const size = "2rem";
  const controlsStyles = {
    justifySelf: 'center'
  };
  const controlStyles = {
    justifySelf: 'end',
    marginRight: '5rem'
  };
  return (
    <div className={classes.Footer}>
      <h1 className={classes.Heading}>Survix</h1>
      <Controls styles={controlsStyles} className={classes.Controls} size={size} />
      <Control styles={controlStyles} Type={FiPower} size={size} />
    </div>
  );
}

export default Footer;
