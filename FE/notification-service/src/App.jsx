import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar.jsx'
import NotificationPage from './components/NotificationPage.jsx'

import BoardList from './components/boardlist.jsx'
import BoardWrite from './components/boardwrite.jsx'
import BoardEdit from './components/boardedit.jsx'
import BoardDetail from './components/boardDetail.jsx'

import HousingListPage from './pages/HousingListPage.jsx';
import HousingPagedt from './pages/HousingPagedt.jsx';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path='/boards' element={<BoardList />} />
        <Route path="/boards" element={<BoardList />} />
        <Route path="/boards/write" element={<BoardWrite />} />
        {/* <Route path="/" element={<BoardList />} /> */}
        <Route path="/boards/:boardId/edit" element={<BoardEdit />} />
        <Route path="/boards/:boardId" element={<BoardDetail />} />
        <Route path="/housing" element={<HousingListPage />} />
        <Route path="/" element={<HousingListPage />} />
        <Route path="/housing/:panId" element={<HousingPagedt />} />
      </Routes>
    </Router>
  )
}

export default App