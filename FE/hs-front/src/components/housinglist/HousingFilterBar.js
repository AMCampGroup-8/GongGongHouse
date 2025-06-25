import React from "react";

const HousingFilterBar = ({ filters, setFilters }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="mb-6 flex flex-wrap gap-4 items-center">
            <input
                type="text"
                name="title"
                value={filters.title}
                onChange={handleChange}
                placeholder="공고명 검색"
                className="border px-3 py-1 rounded"
            />
            <input
                type="text"
                name="region"
                value={filters.region}
                onChange={handleChange}
                placeholder="지역"
                className="border px-3 py-1 rounded"
            />
            <input
                type="text"
                name="agency"
                value={filters.agency}
                onChange={handleChange}
                placeholder="기관"
                className="border px-3 py-1 rounded"
            />
            <input
                type="text"
                name="type"
                value={filters.type}
                onChange={handleChange}
                placeholder="공급 유형"
                className="border px-3 py-1 rounded"
            />
            <div>
                <label className="mr-2">시작일</label>
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded"
                />
            </div>
            <div>
                <label className="mr-2">종료일</label>
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded"
                />
            </div>
        </div>
    );
};

export default HousingFilterBar;
