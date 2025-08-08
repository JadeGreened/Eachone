import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Works from './pages/Works';
import About from './pages/About';
import AcademicPage_1_CHI from './pages/AcademicPage_1_CHI';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/about" element={<About />} />
          <Route path="/academic/AcademicPage_1_CHI" element={<AcademicPage_1_CHI />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
