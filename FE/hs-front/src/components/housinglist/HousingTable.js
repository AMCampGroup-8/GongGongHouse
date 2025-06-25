import React from 'react';
import { Link } from 'react-router-dom';

const HousingTable = ({ notices }) => {
    return (
        <table className="housing-table">
            <thead>
            <tr>
                <th>제목</th>
                <th>기관</th>
                <th>지역</th>
                <th>유형</th>
                <th>면적(㎡)</th>
                <th>기간</th>
            </tr>
            </thead>
            <tbody>
            {notices.length === 0 ? (
                <tr><td colSpan="6" className="no-data">공고가 없습니다.</td></tr>
            ) : (
                notices.map((item) => (
                    <tr key={item.id}>
                        <td>
                            <Link
                                to={`/housing/${item.id}`}
                                state={item}
                                className="link-title"
                            >
                                {item.title}
                            </Link>
                        </td>
                        <td>{item.agency}</td>
                        <td>{item.location}</td>
                        <td>{item.type}</td>
                        <td>{item.supplyArea}</td>
                        <td>{item.startDate} ~ {item.endDate}</td>
                    </tr>
                ))
            )}
            </tbody>
        </table>
    );
};

export default HousingTable;
