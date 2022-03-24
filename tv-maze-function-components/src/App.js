import React from 'react';
import logo from './img/tvm-header-logo.png';
import './App.css';
import Home from './components/Home';
import Characters from './components/Characters';
import ShowCharacter from './components/ShowCharacter';
import Comics from './components/Comics';
import ShowComic from './components/ShowComic';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>
            Welcome to the React.js TV Maze API Example
          </h1>
          <Link className='showlink' to='/'>
            Home
          </Link>
          <Link className='showlink' to='/characters/page/0'>
            Characters
          </Link>
          <Link className='showlink' to='/comics/page/0'>
            Comics
          </Link>
          <Link className='showlink' to='/series/page/0'>
            Series
          </Link>
        </header>
        <br />
        <br />
        <div className='App-body'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/characters/page/:pageNum' element={<Characters />} />
            <Route path='/characters/:characterId' element={<ShowCharacter />} /> 
            <Route path='/comics/page/:pageNum' element={<Comics />} />
            <Route path='/comics/:comicId' element={<ShowComic />} /> 
            {/* <Route path='/shows/:id' element={<Show />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
