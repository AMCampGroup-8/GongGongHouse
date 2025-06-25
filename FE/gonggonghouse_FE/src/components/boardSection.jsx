import React, { useEffect, useState } from 'react';
import axios from 'axios';

import styles from './boardSection.module.css';

function CommentSection({ boardId }) {
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/boards/${boardId}/comments`);
      setComments(response.data.data);
    } catch (err) {
      console.error('댓글 목록 불러오기 실패:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boardId) {
      fetchComments();
    }
  }, [boardId]);

  // 댓글 작성 처리
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newCommentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    const memberId = 1; // 임시 사용자 1번

    try {
      const response = await axios.post(`/boards/${boardId}/comment`, {
        content: newCommentContent,
        memberId
      });
      console.log('댓글 작성 성공:', response.data);
      setNewCommentContent('');
      fetchComments();
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      alert('댓글 작성에 실패했습니다.');
      setError(err);
    }
  };

  const handleCommentEdit = async (commentId, currentContent) => {
    const updatedContent = prompt('댓글을 수정해주세요:', currentContent);
    if (updatedContent !== null && updatedContent.trim() !== '') {
      try {
        await axios.put(`/boards/${boardId}/comment/${commentId}`, {
          content: updatedContent
        });
        alert('댓글이 수정되었습니다.');
        fetchComments();
      } catch (err) {
        console.error('댓글 수정 실패:', err);
        alert('댓글 수정에 실패했습니다.');
      }
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/boards/${boardId}/comment/${commentId}`);
        alert('댓글이 삭제되었습니다.');
        fetchComments();
      } catch (err) {
        console.error('댓글 삭제 실패:', err);
        alert('댓글 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) return <div>댓글을 불러오는 중입니다...</div>;
  if (error) return <div>오류 발생: {error.message}</div>;

  return (
    <div className={styles.commentSection}>
      <h3>댓글</h3>
      {comments.length === 0 ? (
        <p className={styles.noCommentsMessage}>아직 댓글이 없습니다.</p>
      ) : (
        <ul className={styles.commentList}>
          {comments.map(comment => (
            <li key={comment.id} className={styles.commentItem}>
              <p className={styles.commentContent}>
                <strong className={styles.commentAuthor}>{comment.authorNickname}</strong>: {comment.content}
              </p>
              <small className={styles.commentMeta}>{new Date(comment.createdAt).toLocaleString()}</small>
              <div className={styles.commentActions}>
                <button onClick={() => handleCommentEdit(comment.id, comment.content)} className={styles.editButton}>수정</button>
                <button onClick={() => handleCommentDelete(comment.id)} className={styles.deleteButton}>삭제</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
        <textarea
          placeholder="댓글을 입력하세요..."
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          rows={3}
          className={styles.commentTextarea}
        ></textarea>
        <button type="submit" className={styles.submitButton}>댓글 작성</button>
      </form>
    </div>
  );
}

export default CommentSection;
