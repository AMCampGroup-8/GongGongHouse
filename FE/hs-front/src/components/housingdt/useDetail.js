import { useEffect, useState } from 'react';
import axios from 'axios';

const useDetail = (panId) => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!panId) return;

        const fetchDetail = async () => {
            try {
                const res = await axios.get('http://localhost:8083/housing/detail', {
                    params: { panId }
                });
                setDetail(res.data);
            } catch (err) {
                console.error('상세정보 불러오기 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [panId]);

    return { detail, loading };
};

export default useDetail;
