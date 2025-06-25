import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import styles from './boardEdit.module.css';

function BoardEdit() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`/boards/${boardId}`);
        setTitle(response.data.data.title);
        setContent(response.data.data.content);
      } catch (err) {
        console.error('게시글 불러오기 실패:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [boardId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/boards/${boardId}`, {
        title,
        content
      });
      alert('게시글이 성공적으로 수정되었습니다.');
      navigate(`/boards/${boardId}`);
    } catch (err) {
      console.error('게시글 수정 실패:', err);
      alert('게시글 수정에 실패했습니다.');
      setError(err);
    }
  };

  if (loading) return <div>게시글을 불러오는 중입니다...</div>;
  if (error) return <div>오류 발생: {error.message}</div>;

  return (
    <div className={styles.boardEditContainer}>
      <h1>게시글 수정</h1>
      <form onSubmit={handleSubmit} className={styles.boardEditForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.formLabel}>제목:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.formLabel}>내용:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className={styles.formTextarea}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>수정 완료</button>
          <button type="button" onClick={() => navigate(`/boards/${boardId}`)} className={styles.cancelButton}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default BoardEdit;
