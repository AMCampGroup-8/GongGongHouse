import axios from "axios";

export const fetchHousingNotices = async () => {
    try {
        const response = await axios.get("http://localhost:8083/housing");
        return response.data;
    } catch (error) {
        console.error("공고 불러오기 실패:", error);
        return [];
    }
};
