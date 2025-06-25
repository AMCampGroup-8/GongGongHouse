import axios from 'axios';

// src/api/interest.js
const api = axios.create({
  baseURL: "http://localhost:8084", // ✅ 포트 꼭 8084로!!!
  headers: {
    Authorization: 'Bearer test', // memberId = 1L
  },
});

// ✅ API 함수들
export const getInterests = () => api.get('/interests');
export const getInterest = (id) => api.get(`/interests/${id}`);
export const createInterest = (data) => api.post('/interests', data);
export const deleteInterest = (id) => api.delete(`/interests/${id}`);

export default api;
