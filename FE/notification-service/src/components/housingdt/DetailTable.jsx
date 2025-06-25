import React from 'react';
import './DetailTable.css';

const DetailTable = ({ detail, supply }) => {
    return (
        <div className="detail-container">
            <h2 className="detail-title">{detail.title}</h2>

            <div className="detail-item">
                <span className="detail-label">지역:</span>
                {detail.location}
            </div>
            <div className="detail-item">
                <span className="detail-label">기관:</span>
                {detail.agency}
            </div>
            <div className="detail-item">
                <span className="detail-label">유형:</span>
                {detail.type}
            </div>
            <div className="detail-item">
                <span className="detail-label">면적:</span>
                {detail.supplyArea}㎡
            </div>
            <div className="detail-item">
                <span className="detail-label">기간:</span>
                {detail.startDate} ~ {detail.endDate}
            </div>

            <div className="supply-section">
                <h3 className="supply-title">공급 세부 정보</h3>
                {supply && supply.length > 0 ? (
                    <ul className="supply-list">
                        {supply.map((item, index) => (
                            <li key={index}>
                                {item.houseName} - {item.houseCount}세대
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="supply-empty">공급 정보 없음</div>
                )}
            </div>
        </div>
    );
};

export default DetailTable;
