import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HousingListPage from './pages/HousingListPage';
import HousingPagedt from './pages/HousingPagedt';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/housing" element={<HousingListPage />} />
                <Route path="/housing/:panId" element={<HousingPagedt />} />
            </Routes>
        </Router>
    );
}

export default App; // ✅ 이 줄이 없으면 index.js에서 import 불가능
