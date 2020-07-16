import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CreateRoom from './components/CreateRoom/CreateRoom';
import ChatRoom from './containers/ChatRoom/ChatRoom';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={CreateRoom} />
        <Route path="/rooms/:roomID" component={ChatRoom} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
