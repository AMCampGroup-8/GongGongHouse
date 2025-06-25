import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "@/apis/axiosInstance";

export default function KakaoCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState({});
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const processKakaoLogin = async () => {
      // URL에서 코드 추출
      const code = new URLSearchParams(location.search).get("code");
      const error = new URLSearchParams(location.search).get("error");
      const errorDescription = new URLSearchParams(location.search).get("error_description");
      
      // 디버깅 정보 저장
      setDebugInfo({
        currentUrl: window.location.href,
        code: code,
        error: error,
        errorDescription: errorDescription,
        retryCount: retryCount,
        axiosBaseUrl: axiosInstance.defaults.baseURL || "설정되지 않음"
      });
      
      if (error) {
        setError(`카카오 인증 오류: ${error} - ${errorDescription || '알 수 없는 오류'}`);
        setLoading(false);
        return;
      }
      
      if (!code) {
        setError("인증 코드가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        console.log("카카오 인증 코드:", code);
        console.log("시도 횟수:", retryCount + 1);
        
        // API 엔드포인트 로깅
        const apiEndpoint = `/auth-service/api/auth/kakao/callback?code=${code}`;
        console.log("요청할 API 엔드포인트:", apiEndpoint);
        
        // 백엔드에 코드 전송
        const response = await axiosInstance.get(apiEndpoint);

        console.log("카카오 로그인 응답:", response.data);

        if (response.data && response.data.token) {
          // 토큰 저장
          localStorage.setItem("accessToken", response.data.token);
          
          // 메인 페이지로 리다이렉트
          navigate("/");
        } else {
          setError("로그인 처리 중 오류가 발생했습니다. (토큰 없음)");
          setDebugInfo(prev => ({ 
            ...prev, 
            responseData: response.data,
            errorType: "토큰 없음"
          }));
          setLoading(false);
        }
      } catch (err) {
        console.error("카카오 로그인 처리 실패:", err);
        
        // 더 자세한 오류 정보 기록
        const errorDetails = {
          message: err.message,
          stack: err.stack,
          response: err.response ? {
            data: err.response.data,
            status: err.response.status,
            headers: err.response.headers,
          } : 'No response',
          config: err.config ? {
            url: err.config.url,
            method: err.config.method,
            headers: err.config.headers,
            baseURL: err.config.baseURL
          } : 'No config'
        };
        
        console.log("상세 오류 정보:", errorDetails);
        
        // 네트워크 오류이고 최대 재시도 횟수에 도달하지 않았다면 재시도
        if (err.message?.includes('Network') && retryCount < MAX_RETRIES) {
          console.log(`네트워크 오류 발생, ${retryCount + 1}번째 재시도 중...`);
          setRetryCount(prev => prev + 1);
          // 1초 후 재시도
          setTimeout(() => processKakaoLogin(), 1000);
          return;
        }
        
        setError(`카카오 로그인 처리 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류'}`);
        setDebugInfo(prev => ({ 
          ...prev, 
          errorMessage: err.message,
          errorResponse: err.response?.data,
          errorStatus: err.response?.status,
          errorConfig: {
            url: err.config?.url,
            method: err.config?.method,
            baseURL: err.config?.baseURL
          }
        }));
        setLoading(false);
      }
    };

    processKakaoLogin();
  }, [location, navigate, retryCount]);

  // API 서비스 확인 버튼 추가
  const checkApiService = () => {
    axiosInstance.get('/auth-service/api/auth/test')
      .then(response => {
        console.log("API 서비스 상태 확인:", response.data);
        setDebugInfo(prev => ({ ...prev, serviceStatus: response.data }));
      })
      .catch(err => {
        console.error("API 서비스 확인 실패:", err);
        setDebugInfo(prev => ({ 
          ...prev, 
          serviceStatusError: err.message,
          serviceStatusResponse: err.response?.data
        }));
      });
  };

  // 로그인 페이지로 돌아가기
  const goToLogin = () => {
    navigate("/login");
  };

  // 다시 시도하기
  const retry = () => {
    setLoading(true);
    setError("");
    setRetryCount(0);
    
    // 현재 URL에서 code 파라미터를 유지하고 다시 시도
    const code = new URLSearchParams(location.search).get("code");
    if (code) {
      window.location.reload();
    } else {
      // 코드가 없으면 로그인 페이지로 이동
      goToLogin();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">
            {retryCount > 0 
              ? `카카오 로그인 처리 중... (재시도: ${retryCount}/${MAX_RETRIES})` 
              : "카카오 로그인 처리 중..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">로그인 오류</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          {Object.keys(debugInfo).length > 0 && (
            <div className="mt-4 p-4 bg-gray-100 rounded text-left text-xs overflow-auto max-h-40">
              <p className="font-bold mb-2">디버그 정보:</p>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
          
          <div className="flex flex-col gap-2 mt-4">
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={goToLogin}
            >
              로그인 페이지로 돌아가기
            </button>
            <button
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              onClick={retry}
            >
              다시 시도하기
            </button>
            <button
              className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors mt-2"
              onClick={checkApiService}
            >
              API 서비스 상태 확인
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 