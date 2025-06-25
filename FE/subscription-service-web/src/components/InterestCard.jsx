import React from 'react';
import { Link } from 'react-router-dom'; // ✅ import 추가
import '../styles/InterestCard.css';

const InterestCard = ({ interest, onToggle }) => {
  const {
    id,
    announcementId,
    region,
    title,
    alarmBeforeDays,
    status,
    isLiked,
  } = interest || {};

  const handleClick = () => {
    onToggle(id, !isLiked);
  };

  return (
    // ✅ 여기 Link로 카드 전체를 감싸기
    <Link to={`/interests/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="interest-card">
        <div className="interest-card-left">
          <div className="status">{status || '모집중'}</div>
          <div className="title">
            [{region || '-'}] {title || `공고 ID ${announcementId || '-'}`}
          </div>
          <div className="dates">
            모집공고 - {alarmBeforeDays ? `${alarmBeforeDays}일 전` : '-'}
            <span className="divider">|</span>
            당첨발표 - 예시날짜
          </div>
        </div>
        <div className="interest-card-right">
          <button
            className={`heart-button ${isLiked ? 'liked' : ''}`}
            onClick={(e) => {
              e.preventDefault(); // ✅ Link 클릭 방지
              handleClick();
            }}
          >
            {isLiked ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default InterestCard;
