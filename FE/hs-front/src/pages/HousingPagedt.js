// src/pages/HousingPagedt.js
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import useDetail from '../components/housingdt/useDetail';
import useSupply from '../components/housingdt/useSupply';
import DetailTable from '../components/housingdt/DetailTable';

const HousingPagedt = () => {
    const { panId } = useParams();
    const location = useLocation();
    const passedParams = location.state || {};

    const { detail, loading: loadingDetail } = useDetail(panId);
    const { supply, loading: loadingSupply } = useSupply(panId);

    const combinedDetail = {
        ...passedParams,
        ...detail,
    };

    if (loadingDetail || loadingSupply) return <p>로딩 중...</p>;
    if (!detail && !supply) return <p>상세 정보를 불러올 수 없습니다.</p>;

    return <DetailTable detail={combinedDetail} supply={supply} />;
};

export default HousingPagedt;
