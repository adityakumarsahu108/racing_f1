
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import AppRouter from './AppRouter';


const App1 = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppRouter />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default App1;