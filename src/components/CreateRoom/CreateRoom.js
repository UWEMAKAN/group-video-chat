import React from 'react';
import { v1 as uuid } from 'uuid';
import classes from './CreateRoom.module.css';

const CreateRoom = (props) => {
  const create = () => {
    const id = uuid();
    props.history.push(`/rooms/${id}`);
  }

  return (
    <div className={classes.CreateRoom}>
      <button className={classes.Button} onClick={create}>Create room</button>
    </div>
  );
};

export default CreateRoom;
