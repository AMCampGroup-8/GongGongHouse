import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInterest } from '../api/interest';
import '../styles/InterestDetail.css';

const InterestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interest, setInterest] = useState(null);

  useEffect(() => {
    getInterest(id)
      .then(res => setInterest(res.data))
      .catch(() => alert('상세 정보를 불러오지 못했습니다.'));
  }, [id]);

  if (!interest) return <div>불러오는 중...</div>;

  return (
    <div className="detail-container">
      <h1>입주자 모집공고</h1>

      <div className="notice-card">
        <div className="badge">{interest.status || '모집중'}</div>
        <h2>{interest.announcementTitle || `공고 ID ${interest.announcementId}`}</h2>
        <p className="region-tag">{interest.region || '-'}</p>
        <button className="go-btn">해당 사이트로 이동</button>
      </div>

      <section>
        <h3>단지 기본정보</h3>
        <table>
          <tbody>
            <tr><th>단지명</th><td>{interest.complexName || '-'}</td></tr>
            <tr><th>주소</th><td>{interest.address || '-'}</td></tr>
            <tr><th>분양형태</th><td>{interest.type || '-'}</td></tr>
            <tr><th>전용면적</th><td>{interest.area || '-'}</td></tr>
            <tr><th>세대수</th><td>{interest.household || '-'}</td></tr>
            <tr><th>자세히보기</th><td><a href={interest.fileUrl} target="_blank" rel="noreferrer">첨부파일</a></td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h3>공급 정보</h3>
        <div className="supply-info">
          <div className="supply-box">
            <h4>{interest.supplyType || '26A'}</h4>
            <ul>
              <li>공급세대수: {interest.supplyAmount || '70'}세대</li>
              <li>분양가: {interest.price || '2억'}원</li>
              <li>전용면적: {interest.area || '59.99㎡'}</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h3>일정 정보</h3>
        <table>
          <tbody>
            <tr><th>모집공고일</th><td>{interest.announcementDate || '-'}</td></tr>
            <tr><th>청약접수기간</th><td>{interest.applyStart || '-'} ~ {interest.applyEnd || '-'}</td></tr>
            <tr><th>당첨자 발표</th><td>{interest.resultDate || '-'}</td></tr>
            <tr><th>계약일정</th><td>{interest.contractDate || '-'}</td></tr>
          </tbody>
        </table>
      </section>

      <div className="btn-box">
        <button onClick={() => navigate(-1)} className="back-btn">목록</button>
      </div>
    </div>
  );
};

export default InterestDetail;
