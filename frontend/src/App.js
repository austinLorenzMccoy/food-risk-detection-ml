import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/results"
          element={<ResultsPage />}
        />
        <Route path="/error" element={<ErrorPage message="Something went wrong." />} />
      </Routes>
    </Router>
  );
}

export default App;
