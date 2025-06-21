import axios from 'axios';
import { Announcement, LHResponse } from '../types/announcement';

const API_KEY = '6NyqkFLFWxC9mkkEU6ntshrtBhh+77ivcPNYzUql7auzUuyQJAX1p8a8avnSHv4ElqjrpsqQkQOuFfmInwyF5A=='; // 실제 API 키로 변경해야 함

export const getLhAnnouncements = async (): Promise<Announcement[]> => {
  try {
    // 청년/신혼 공고를 상태별로 검색
    const responses = await Promise.all([
      // 청년 공고
      axios.get(
        'http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1',
        {
          params: {
            serviceKey: API_KEY,
            PG_SZ: 100,
            PAGE: 1,
            // PAN_SS: '공고중',
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
            // PAN_SS: '접수중',
            PAN_NM: '청년'
          }
        }
      ),
      // 신혼 공고
      axios.get(
        'http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1',
        {
          params: {
            serviceKey: API_KEY,
            PG_SZ: 100,
            PAGE: 1,
            // PAN_SS: '공고중',
            PAN_NM: '신혼'
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
            // PAN_SS: '접수중',
            PAN_NM: '신혼'
          }
        }
      )
    ]);

    // 로그 출력
    console.log('청년 공고(공고중):', responses[0].data[1].dsList.length);
    console.log('청년 공고(접수중):', responses[1].data[1].dsList.length);
    console.log('신혼 공고(공고중):', responses[2].data[1].dsList.length);
    console.log('신혼 공고(접수중):', responses[3].data[1].dsList.length);

    // 모든 응답의 데이터를 합치고 변환
    return [
      ...responses[0].data[1].dsList,
      ...responses[1].data[1].dsList,
      ...responses[2].data[1].dsList,
      ...responses[3].data[1].dsList
    ].map((item: any): Announcement => ({
      PAN_NM: item.PAN_NM,
      PAN_NT_ST_DT: item.PAN_NT_ST_DT,
      CLSG_DT: item.CLSG_DT,
      CNP_CD_NM: item.CNP_CD_NM,
      AIS_TP_CD_NM: item.AIS_TP_CD_NM,
      DTL_URL: item.DTL_URL,
      PAN_SS: item.PAN_SS
    }));
  } catch (error: any) {
    console.error('API 호출 중 오류 발생:', error.response?.data || error.message);
    throw new Error(error.response?.data || error.message || '공고 정보를 불러오는 중 오류가 발생했습니다.');
  }
};
