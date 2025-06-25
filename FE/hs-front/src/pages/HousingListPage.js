import React, { useEffect, useState } from "react";
import HousingFilterBar from "../components/housinglist/HousingFilterBar";
import HousingTable from "../components/housinglist/HousingTable";
import { fetchHousingNotices } from "../components/housinglist/api";

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
        const getData = async () => {
            const data = await fetchHousingNotices(); // 전체 불러오고 클라이언트 필터링
            const filtered = data.filter((item) => {
                const matchesRegion = filters.region === "" || item.location.includes(filters.region);
                const matchesType = filters.type === "" || item.type.includes(filters.type);
                const matchesAgency = filters.agency === "" || item.agency.includes(filters.agency);
                const matchesTitle = filters.title === "" || item.title.includes(filters.title);

                const dateInRange = () => {
                    if (!filters.startDate || !filters.endDate) return true;
                    const start = new Date(filters.startDate);
                    const end = new Date(filters.endDate);
                    const itemStart = new Date(item.startDate);
                    return itemStart >= start && itemStart <= end;
                };

                return matchesRegion && matchesType && matchesAgency && matchesTitle && dateInRange();
            });

            setNotices(filtered);
        };

        getData();
    }, [filters]);

    const indexOfLast = currentPage * itemsPerPage;
    const currentItems = notices.slice(indexOfLast - itemsPerPage, indexOfLast);
    const totalPages = Math.ceil(notices.length / itemsPerPage);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">주택 공고 목록</h1>
            <HousingFilterBar filters={filters} setFilters={setFilters} />
            <HousingTable notices={currentItems} />

            <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded ${
                            currentPage === i + 1 ? "bg-[#5DC1B7]" : "bg-gray-100"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HousingListPage;
