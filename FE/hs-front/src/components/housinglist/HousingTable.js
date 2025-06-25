import React from "react";

const HousingTable = ({ notices }) => {
    return (
        <table className="w-full table-auto border">
            <thead className="bg-gray-100">
            <tr>
                <th className="border px-4 py-2">제목</th>
                <th className="border px-4 py-2">기관</th>
                <th className="border px-4 py-2">지역</th>
                <th className="border px-4 py-2">공급유형</th>
                <th className="border px-4 py-2">면적(㎡)</th>
                <th className="border px-4 py-2">공고일</th>
                <th className="border px-4 py-2">마감일</th>
            </tr>
            </thead>
            <tbody>
            {notices.length === 0 ? (
                <tr>
                    <td colSpan="7" className="text-center py-4">
                        공고가 없습니다.
                    </td>
                </tr>
            ) : (
                notices.map((notice) => (
                    <tr key={notice.id}>
                        <td className="border px-4 py-2">{notice.title}</td>
                        <td className="border px-4 py-2">{notice.agency}</td>
                        <td className="border px-4 py-2">{notice.location}</td>
                        <td className="border px-4 py-2">{notice.type}</td>
                        <td className="border px-4 py-2">{notice.supplyArea}</td>
                        <td className="border px-4 py-2">{notice.startDate}</td>
                        <td className="border px-4 py-2">{notice.endDate}</td>
                    </tr>
                ))
            )}
            </tbody>
        </table>
    );
};

export default HousingTable;
