import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotificationPage from './components/NotificationPage';
import NavBar from './components/NavBar';  // 종 아이콘 들어간 NavBar

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/" element={<div>홈</div>} />
      </Routes>
    </Router>
  );
}

export default App;
