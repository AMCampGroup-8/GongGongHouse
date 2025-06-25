// src/pages/HousingPagedt.js
import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import useDetail from '../components/housingdt/useDetail';
import useSupply from '../components/housingdt/useSupply';
import DetailTable from '../components/housingdt/DetailTable';
import './HousingPagedt.css'; // 스타일 파일 포함

const HousingPagedt = () => {
    const { panId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const passedParams = location.state || {};

    const { detail, loading: loadingDetail } = useDetail(panId);
    const { supply, loading: loadingSupply } = useSupply(panId);

    const combinedDetail = {
        ...passedParams,
        ...detail,
    };

    const handleInterestClick = () => {
        alert(`공고 ${panId}에 관심 등록 요청!`);
    };

    const handleBackClick = () => {
        navigate('/housing');
    };

    if (loadingDetail || loadingSupply) return <p>로딩 중...</p>;
    if (!detail && !supply) return <p>상세 정보를 불러올 수 없습니다.</p>;

    return (
        <div className="detail-page-wrapper">
            <div className="button-row">
                <button className="back-button" onClick={handleBackClick}>
                    🔙 목록가기
                </button>
                <button className="interest-button" onClick={handleInterestClick}>
                    ❤️ 관심등록
                </button>
            </div>

            <DetailTable detail={combinedDetail} supply={supply} />
        </div>
    );
};

export default HousingPagedt;
