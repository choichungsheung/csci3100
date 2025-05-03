import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Main from './Main';
import Login from './Login';
import Register from './Register';
import Cookies from 'js-cookie';

function App() {
  const [loggedIn, setLoggedIn] = useState(Cookies.get("username") ? true : false);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={loggedIn ? <Main setLoggedIn={setLoggedIn}/> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setLogin={setLoggedIn} />} />
          <Route path="/register" element={<Register setLogin={setLoggedIn} />} />
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
