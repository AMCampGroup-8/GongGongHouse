import React from 'react';

const DetailTable = ({ detail, supply }) => {
    return (
        <div className="p-4 border rounded">
            <h2 className="text-xl font-bold mb-4">{detail.title}</h2>
            <p>지역: {detail.location}</p>
            <p>기관: {detail.agency}</p>
            <p>유형: {detail.type}</p>
            <p>면적: {detail.supplyArea}㎡</p>
            <p>기간: {detail.startDate} ~ {detail.endDate}</p>

            <hr className="my-4" />
            <h3 className="font-semibold">공급 세부정보</h3>
            {supply?.length > 0 ? (
                <ul className="list-disc list-inside">
                    {supply.map((item, i) => (
                        <li key={i}>
                            {item.houseName} - {item.houseCount}세대
                        </li>
                    ))}
                </ul>
            ) : (
                <p>공급 정보 없음</p>
            )}
        </div>
    );
};

export default DetailTable;
