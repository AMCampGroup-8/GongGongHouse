import BoardList from './components/boardlist';
import BoardWrite from './components/boardwrite';
import BoardEdit from './components/boardedit';
import BoardDetail from './components/boardDetail';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div>
          <Routes>
            <Route path="/boards" element={<BoardList />} />
            <Route path="/boards/write" element={<BoardWrite />} />
            <Route path="/" element={<BoardList />} />
            <Route path="/boards/:boardId/edit" element={<BoardEdit />} />
            <Route path="/boards/:boardId" element={<BoardDetail />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
