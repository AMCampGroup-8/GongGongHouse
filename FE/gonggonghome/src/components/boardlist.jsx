import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import styles from '../components/boardlist.module.css';

function BoardList() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBoards, setExpandedBoards] = useState({});

  const navigate = useNavigate();

  const fetchBoards = async () => {
    try {
      const response = await axios.get('/boards');
      setBoards(response.data.data.boards);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleBoardClick = (boardId) => {
    setExpandedBoards(prevExpandedBoards => ({
      ...prevExpandedBoards,
      [boardId]: !prevExpandedBoards[boardId]
    }));
  };

  const handleBoardDoubleClick = (boardId) => {
    navigate(`/boards/${boardId}`); // 상세 페이지로 이동
  };

  if (loading) return <div>게시글을 불러오는 중입니다...</div>;
  if (error) return <div>오류 발생: {error.message}</div>;

  return (
    <div className={styles.boardListContainer}>
      <h1>게시글 목록</h1>
      <button onClick={() => navigate('/boards/write')}>새 게시글 작성</button>
      <ul>
        {boards.map(board => (
          <li key={board.id}>
            <div className={styles.boardHeader}>
              <h2
                onClick={() => handleBoardClick(board.id)}
                onDoubleClick={() => handleBoardDoubleClick(board.id)}
              >
                {board.title}
              </h2>
            </div>

            {expandedBoards[board.id] && (
              <div className={styles.boardContentDetails}>
                <p>{board.content}</p>
                <p>작성자: {board.authorNickname}</p>
                <p>작성일: {new Date(board.createdAt).toLocaleString()}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BoardList;
