import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import styles from './boardWrite.module.css';

function BoardWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //임시 사용자 1번
    const memberId = 1;

    try {
      const response = await axios.post('/boards', {
        title,
        content,
        memberId
      });
      console.log('게시글 작성 성공:', response.data);
      setSuccess(true); // 게시글 작성 성공 후 목록 페이지로 이동
      navigate('/boards'); // /boards 경로로 이동
    } catch (err) {
      console.error('게시글 작성 실패:', err);
      setError(err);
      setSuccess(false);
    }
  };

  if (success) return <div>게시글이 성공적으로 작성되었습니다!</div>;
  if (error) return <div>게시글 작성 중 오류 발생: {error.message}</div>;

  return (
    <div className={styles.boardWriteContainer}>
      <h1>새 게시글 작성</h1>
      <form onSubmit={handleSubmit} className={styles.boardWriteForm}> 
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
          <button type="submit" className={styles.submitButton}>작성 완료</button>
          <button type="button" onClick={() => navigate('/boards')} className={styles.cancelButton}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default BoardWrite;
