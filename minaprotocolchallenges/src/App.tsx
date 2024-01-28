import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import HomePage from './Pages/Home/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
