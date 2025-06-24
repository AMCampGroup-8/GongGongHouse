import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CommentSection from './boardSection';

import styles from './boardDetail.module.css';

function BoardDetail() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const response = await axios.get(`/boards/${boardId}`);
        setBoard(response.data.data);
      } catch (err) {
        console.error('게시글 상세 불러오기 실패:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardDetail();
  }, [boardId]);

  const handleDeleteBoard = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/boards/${boardId}`);
        alert('게시글이 삭제되었습니다.');
        navigate('/boards');
      } catch (err) {
        console.error('게시글 삭제 실패:', err);
        alert('게시글 삭제에 실패했습니다.');
        setError(err);
      }
    }
  };

  if (loading) return <div>게시글 상세 정보를 불러오는 중입니다...</div>;
  if (error) return <div>오류 발생: {error.message}</div>;
  if (!board) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className={styles.boardDetailContainer}>
      <h1 className={styles.boardTitle}>{board.title}</h1>
      <p className={styles.boardMeta}><strong>작성자:</strong> {board.authorNickname}</p> 
      <p className={styles.boardMeta}><strong>작성일:</strong> {new Date(board.createdAt).toLocaleString()}</p>
      <hr className={styles.divider} />
      <div className={styles.boardContent}>
        <p>{board.content}</p>
      </div>
      <hr className={styles.divider} />
      <div className={styles.boardDetailActions}>
        <Link to={`/boards/${board.id}/edit`}>
          <button className={styles.editButton}>수정</button>
        </Link>
        <button onClick={handleDeleteBoard} className={styles.deleteButton}>삭제</button>
        <button onClick={() => navigate('/boards')} className={styles.listButton}>목록으로</button>
      </div>

      <CommentSection boardId={board.id} />
    </div>
  );
}

export default BoardDetail;
