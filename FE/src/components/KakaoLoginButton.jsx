import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 카카오 로그인 설정을 상수로 분리
const KAKAO_REDIRECT_URI = "http://localhost/kakao-callback";
// scope 파라미터 제거 - 기본 정보(닉네임, 카카오 ID)만 사용

const KakaoLoginButton = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [sdkReady, setSdkReady] = useState(false);

  // 카카오 SDK 초기화 확인
  useEffect(() => {
    // SDK가 로드되었고 초기화되었는지 확인
    if (window.Kakao && window.Kakao.isInitialized()) {
      setSdkReady(true);
    } else {
      // SDK 초기화 확인을 위한 간단한 폴링
      const checkInterval = setInterval(() => {
        if (window.Kakao && window.Kakao.isInitialized()) {
          setSdkReady(true);
          clearInterval(checkInterval);
        }
      }, 500);

      // 10초 후에도 초기화되지 않으면 폴링 중지
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!sdkReady) {
          console.warn("카카오 SDK 초기화 타임아웃");
        }
      }, 10000);

      return () => clearInterval(checkInterval);
    }
  }, []);

  const handleLogin = () => {
    if (!sdkReady) {
      setError("카카오 로그인이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      // scope 파라미터 없이 기본 정보만 요청
      window.Kakao.Auth.authorize({
        redirectUri: KAKAO_REDIRECT_URI
      });
    } catch (error) {
      console.error("카카오 로그인 호출 오류:", error);
      setError("카카오 로그인 실행 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
      <button 
        className="w-full cursor-pointer" 
        onClick={handleLogin}
        disabled={!sdkReady}
        style={{ opacity: sdkReady ? 1 : 0.6 }}
      >
        <img className="w-full" src="/images/kakao_login_medium_wide.png" alt="카카오 로그인" />
        {!sdkReady && <div className="text-center text-xs text-gray-500 mt-1">카카오 로그인 준비 중...</div>}
      </button>
      {!sdkReady && (
        <div className="flex justify-center mt-2">
          <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
};

export default KakaoLoginButton;
