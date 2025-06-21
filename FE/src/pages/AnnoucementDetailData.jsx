import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import useAnnoucementDetail from '../components/announcementdetailpage/useAnnouncementDetail';
import useAnnoucementSpl from '../components/announcementdetailpage/useAnnoucementSpl';
import AnnouncementDetailTable from '../components/announcementdetailpage/AnnouncementDetailTable';
import '../components/announcementdetailpage/AnnoucementDetail.css';


function AnnouncementDetailData() {
  const { panId } = useParams();
  const location = useLocation();
  const params = location.state || {};

  // ✅ 반드시 use 붙여서 훅 호출!
  const { detail, loading: loadingDetail } = useAnnoucementDetail(panId, params);
  const { spl, loading: loadingSpl } = useAnnoucementSpl(panId, params);

  // 전달된 데이터와 API 데이터를 병합
  const combinedDetail = {
    ...params,
    ...detail
  };

  if (loadingDetail || loadingSpl) return <div>로딩 중...</div>;
  if (!detail && !spl) return <div>상세 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      <AnnouncementDetailTable detail={combinedDetail} spl={spl} />
    </div>
  );
}

export default AnnouncementDetailData;
