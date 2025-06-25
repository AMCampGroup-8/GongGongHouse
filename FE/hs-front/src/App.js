import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HousingListPage from './pages/HousingListPage';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<HousingListPage />} />
        </Routes>
      </Router>
  );
}

export default App;
