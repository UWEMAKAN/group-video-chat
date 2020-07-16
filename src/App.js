import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CreateRoom from './components/CreateRoom/CreateRoom';
import ChatRoom from './containers/ChatRoom/ChatRoom';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={process.env.PUBLIC_URL + '/rooms/:roomID'} component={ChatRoom} />
        <Route path={process.env.PUBLIC_URL + '/'} exact component={CreateRoom} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
