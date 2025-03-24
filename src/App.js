import React, { useState } from 'react';
import './App.css';
import Main from './Main';
import Login from './Login';

function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  return (
    <div className="App">
      {loggedIn ? <Main /> : <Login />}
    </div>
  );
}

export default App;
