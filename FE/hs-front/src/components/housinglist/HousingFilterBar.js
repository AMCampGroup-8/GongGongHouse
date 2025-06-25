import React from "react";
import './HousingList.css';

const HousingFilterBar = ({ filters, setFilters }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="filter-bar">
            <input
                type="text"
                name="title"
                value={filters.title}
                onChange={handleChange}
                placeholder="공고명"
            />
            <input
                type="text"
                name="region"
                value={filters.region}
                onChange={handleChange}
                placeholder="지역"
            />
            <input
                type="text"
                name="agency"
                value={filters.agency}
                onChange={handleChange}
                placeholder="기관"
            />
            <input
                type="text"
                name="type"
                value={filters.type}
                onChange={handleChange}
                placeholder="유형"
            />

            <div className="date-group">
                <label>시작일</label>
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleChange}
                />
            </div>

            <div className="date-group">
                <label>종료일</label>
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default HousingFilterBar;
