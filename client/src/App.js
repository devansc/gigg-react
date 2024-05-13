// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SongList from './SongList';
import SongDetail from './SongDetail';
import SongForm from './SongForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <SongList /> } />
        <Route path="/song/:id" element={ <SongDetail /> } />
        <Route path="/add" element={ <SongForm /> } />
      </Routes>
    </Router>
  );
}

export default App;