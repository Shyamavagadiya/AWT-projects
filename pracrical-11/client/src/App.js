import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import JobList from './components/JobList';
import JobDetail from './components/JobDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<JobList />} />
            <Route path="/job/:id" element={<JobDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
