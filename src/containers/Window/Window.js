import React from 'react';
// import Footer from '../../components/Common/Footer/Footer';
import classes from './Window.module.css';
import QuadruplePeersView from '../QuadruplePeersView/QuadruplePeersView';

const Window = (props) => {
  return (
    <div className={classes.Window}>
      <QuadruplePeersView
        {...props}
      />
      {/* <Footer /> */}
    </div>
  );
};

export default Window;
