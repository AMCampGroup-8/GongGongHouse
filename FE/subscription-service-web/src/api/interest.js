import axios from 'axios';

// ✅ Axios 인스턴스 정의
const api = axios.create({
  baseURL: 'http://localhost:8084',
  headers: {
    Authorization: 'Bearer test', // 👈 여기서 memberId = 1L로 처리됨
  },
});

// ✅ API 함수들
export const getInterests = () => api.get('/interests');

export const getInterest = (id) => api.get(`/interests/${id}`);

export const createInterest = (data) => api.post('/interests', data);

export const deleteInterest = (id) => api.delete(`/interests/${id}`);

export default api;
