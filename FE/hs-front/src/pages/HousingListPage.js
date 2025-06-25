// src/pages/HousingListPage.js
import React, { useEffect, useState } from 'react';

const HousingListPage = () => {
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8083/housing')
            .then(response => response.json())
            .then(data => setNotices(data))
            .catch(error => console.error('Error fetching notices:', error));
    }, []);

    return (
        <div>
            <h1>주택 공고 목록</h1>
            <ul>
                {notices.map((notice) => (
                    <li key={notice.id}>
                        <h3>{notice.title}</h3>
                        <p>{notice.location} - {notice.agency}</p>
                        <p>공급 유형: {notice.type}</p>
                        <p>공급 면적: {notice.supplyArea}㎡</p>
                        <p>기간: {notice.startDate} ~ {notice.endDate}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HousingListPage;
