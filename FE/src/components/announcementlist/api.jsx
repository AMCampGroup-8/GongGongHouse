import axios from 'axios';

// API 키는 환경 변수로 관리해야 합니다
const API_KEY = import.meta.env.VITE_API_KEY || 'your_default_api_key';

// 공고 데이터 불러오기 함수
export const getLhAnnouncements = async (search = '') => {
  try {
    // 청년/신혼 공고를 별도로 API 호출
    const requests = [
      axios.get(
        'http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1',
        {
          params: {
            serviceKey: API_KEY,
            PG_SZ: 100,
            PAGE: 1,
            PAN_NM: '청년'
          }
        }
      ),
      axios.get(
        'http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1',
        {
          params: {
            serviceKey: API_KEY,
            PG_SZ: 100,
            PAGE: 1,
            PAN_NM: '신혼'
          }
        }
      )
    ];

    const responses = await Promise.all(requests);

    // Log the number of announcements for each category
    responses.forEach((response, index) => {
      const category = index === 0 ? '청년' : '신혼';
      console.log(`${category} 공고:`, response.data[1].dsList?.length || 0);
    });

    // 모든 응답 데이터 합치기
    const allData = responses.flatMap(response => response.data[1].dsList || []);

    // 데이터 변환
    return allData.map(item => ({
      PAN_NM: item.PAN_NM,
      PAN_NT_ST_DT: item.PAN_NT_ST_DT,
      CLSG_DT: item.CLSG_DT,
      CNP_CD_NM: item.CNP_CD_NM,
      AIS_TP_CD_NM: item.AIS_TP_CD_NM,
      DTL_URL: item.DTL_URL,
      PAN_SS: item.PAN_SS
    }));
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error.response?.data || error.message);
    throw new Error(error.response?.data || error.message || '공고 정보를 불러오는 중 오류가 발생했습니다.');
  }
};

// API 컴포넌트
const AnnouncementAPI = ({ onAnnouncementsLoaded }) => {
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const announcements = await getLhAnnouncements();
        onAnnouncementsLoaded(announcements);
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error.message);
        throw error;
      }
    };

    fetchAnnouncements();
  }, [onAnnouncementsLoaded]);

  return null;
};

export default AnnouncementAPI;
