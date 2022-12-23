import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home'
import Account from './components/Account'
import './App.css';


function App() {
  
  return (
    <div className='App-header'>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/account' element={<Account/>}/>
      </Routes>
    </Router>
    </div>

  );
}

export default App;
