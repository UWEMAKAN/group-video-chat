import React from 'react';
import classes from './QuadruplePeersView.module.css';
import Video from '../../components/Video/Video';

const QuadruplePeersView = (props) => {
  const { localVideo, remoteVideos } = props;
  const videos = remoteVideos.length
    ? remoteVideos.map((remoteVideo, index) =>   <Video videoRef={remoteVideo} />)
    : null;
  return (
    <div className={classes.Quadruple}>
      <Video videoRef={localVideo} muted={true} />
      {videos}
    </div>
  );
}

export default QuadruplePeersView;
