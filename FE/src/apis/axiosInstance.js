import axios from "axios";

// 공통 설정된 Axios 인스턴스
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 시 토큰 자동 주입 (회원가입 및 ID 중복 확인 요청 제외)
axiosInstance.interceptors.request.use((config) => {
  // 회원가입 및 ID 중복 확인 요청은 토큰 주입 제외
  const isAuthExempt = 
    config.url.includes('/api/users') && 
    (config.method === 'post' || config.url.includes('check-userId'));
  
  if (!isAuthExempt) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
});

// ✅ 응답에서 403 (만료) 자동 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 요청 URL 확인
    const requestUrl = error.config?.url || '';
    
    // 회원가입 관련 요청인 경우 다른 처리
    if (error.response?.status === 403 && (requestUrl.includes('/api/users') && !requestUrl.includes('check-userId'))) {
      console.error("회원가입 권한 오류:", error);
      return Promise.reject(error);
    }
    
    // 일반적인 403 오류 (토큰 만료 등)
    if (error.response?.status === 403) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("accessToken");
      window.location.href = "/usermain"; // 강제 이동
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
