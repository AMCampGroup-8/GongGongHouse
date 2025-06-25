import { useEffect, useState } from 'react';
import axios from 'axios';

const useSupply = (panId) => {
    const [supply, setSupply] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!panId) return;

        const fetchSupply = async () => {
            try {
                const res = await axios.get('http://localhost:8083/housing/supply', {
                    params: { panId }
                });
                setSupply(res.data);
            } catch (err) {
                console.error('공급정보 불러오기 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSupply();
    }, [panId]);

    return { supply, loading };
};

export default useSupply;
