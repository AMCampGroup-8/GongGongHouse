import React, { useEffect, useState } from 'react';
import HousingFilterBar from '../components/housinglist/HousingFilterBar';
import HousingTable from '../components/housinglist/HousingTable';
import '../components/housinglist/HousingList.css';

const HousingListPage = () => {
    const [filters, setFilters] = useState({
        region: "",
        type: "",
        agency: "",
        startDate: "",
        endDate: "",
        title: "",
    });

    const [notices, setNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetch("http://localhost:8083/housing")
            .then(res => res.json())
            .then(data => setNotices(data))
            .catch(err => console.error(err));
    }, []);

    const filtered = notices.filter((item) => {
        const match = (field, value) =>
            !value || item[field].includes(value);
        const dateInRange = () => {
            if (!filters.startDate || !filters.endDate) return true;
            const target = new Date(item.startDate);
            return target >= new Date(filters.startDate) && target <= new Date(filters.endDate);
        };
        return (
            match("location", filters.region) &&
            match("type", filters.type) &&
            match("agency", filters.agency) &&
            match("title", filters.title) &&
            dateInRange()
        );
    });

    const start = (currentPage - 1) * itemsPerPage;
    const currentItems = filtered.slice(start, start + itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return (
        <div className="page-container">
            <h1 className="page-title">주택 공고 목록</h1>
            <HousingFilterBar filters={filters} setFilters={setFilters} />
            <HousingTable notices={currentItems} />
            <div className="pagination">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? "active" : ""}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HousingListPage;
