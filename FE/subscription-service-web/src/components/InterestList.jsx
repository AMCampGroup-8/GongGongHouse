import React, { useEffect, useState } from 'react';
import { getInterests, deleteInterest } from '../api/interest'; // ⬅️ deleteInterest 추가
import InterestCard from './InterestCard';
import '../styles/InterestList.css';

const InterestList = () => {
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    getInterests()
      .then(res => {
        const enriched = res.data.map(item => ({
          ...item,
          isLiked: true, // 관심 목록이므로 기본 true
        }));
        setInterests(enriched);
      })
      .catch(() => alert('관심 목록 불러오기 실패!'));
  }, []);

  const handleToggle = (id, isNowLiked) => {
    if (!isNowLiked) {
      // 관심 해제 시: 서버에서 삭제 → 프론트에서도 제거
      deleteInterest(id)
        .then(() => {
          setInterests(prev => prev.filter(item => item.id !== id));
        })
        .catch(() => alert('관심 해제 실패!'));
    } else {
      console.log(`공고 ${id}는 관심등록`);
      // 관심 등록은 추후 구현 예정
    }
  };

  return (
    <div>
      <h2>관심 청약 목록</h2>
      {interests.map(interest => (
        <InterestCard
          key={interest.id}
          interest={interest}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
};

export default InterestList;
