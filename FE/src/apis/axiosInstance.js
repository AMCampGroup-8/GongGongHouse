import axios from "axios";

// 환경에 따른 baseURL 설정
const getBaseUrl = () => {
  // 도커 환경에서도 baseURL을 그대로 사용 (nginx에서 프록시)
  return "";
};

// 공통 설정된 Axios 인스턴스
const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 시 토큰 자동 주입 (회원가입 및 ID 중복 확인 요청 제외)
axiosInstance.interceptors.request.use((config) => {
  // 회원가입 및 ID 중복 확인 요청은 토큰 주입 제외
  const isAuthExempt = 
    (config.url.includes('/user-service/api/users') && 
    (config.method === 'post' || config.url.includes('check-userId'))) ||
    (config.url.includes('/auth-service/api/auth/login'));
  
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
    console.log("오류 발생 URL:", requestUrl);
    console.log("오류 HTTP 메소드:", error.config?.method);
    
    // 회원가입, 로그인, 아이디 중복 확인 요청은 세션 만료 메시지 표시하지 않음
    const isUserServiceRequest = requestUrl.includes('/user-service/api/users');
    const isCheckUserIdRequest = requestUrl.includes('check-userId');
    const isPostRequest = error.config?.method === 'post';
    const isAuthLoginRequest = requestUrl.includes('/auth-service/api/auth/login');
    
    const isAuthRelated = 
      (isUserServiceRequest && (isPostRequest || isCheckUserIdRequest)) || 
      isAuthLoginRequest;
    
    console.log("인증 관련 요청인가?", isAuthRelated);
    
    if (isAuthRelated) {
      console.error("인증 관련 요청 오류:", error);
      return Promise.reject(error);
    }
    
    // 일반적인 403 오류 (토큰 만료 등)
    if (error.response?.status === 403) {
      console.log("403 오류 발생:", requestUrl);
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("accessToken");
      window.location.href = "/usermain"; // 강제 이동
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
