// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/apis/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 카카오 로그인 설정 - 상수로 분리
const KAKAO_REDIRECT_URI = "http://localhost/kakao-callback";
// scope 파라미터 제거 - 기본 정보(닉네임, 카카오 ID)만 사용

export default function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sdkReady, setSdkReady] = useState(false);
  const navigate = useNavigate();

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

  const handleLogin = async () => {
    if (!loginId || !password) {
      setError("아이디와 비밀번호를 입력하세요.");
      return;
    }

    try {
      console.log("로그인 시도:", { userId: loginId, userPwd: password });
      
      const response = await axiosInstance.post("/auth-service/api/auth/login", {
        userId: loginId,
        userPwd: password,
      });

      console.log("로그인 응답:", response.data);
      const token = response.data.token;
      console.log("받은 토큰:", token);
      
      // 토큰 형식 확인
      if (token && typeof token === 'string' && token.split('.').length === 3) {
        console.log("올바른 JWT 토큰 형식입니다.");
      } else {
        console.warn("JWT 토큰 형식이 올바르지 않습니다:", token);
      }
      
      localStorage.setItem("accessToken", token);

      setError("");
      navigate("/");
    } catch (err) {
      console.error("로그인 실패:", err);
      if (err.response) {
        console.error("에러 응답:", err.response.data);
        console.error("상태 코드:", err.response.status);
      }
      setError("로그인에 실패했습니다. 아이디 또는 비밀번호를 확인하세요.");
    }
  };

  // 카카오 로그인 핸들러 - 단순화됨
  const handleKakaoLogin = () => {
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
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url("/images/backgroundImg3.png")` }}
    >
      {/* 전체 중앙 정렬 구조 */}
      <div className="flex flex-col items-center justify-start min-h-screen pt-10 gap-4">
        {/* MainPage와 같은 위치의 로고 */}
        <img
          src="/images/mainLogo.png"
          alt="내집GO 로고"
          className="w-1/5"
        />

        {/* 로그인 박스 */}
        <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl px-10 py-8 w-[400px] lg:w-[450px]">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            로그인
          </h2>

          <Input
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />

          {error && (
            <div className="text-center text-red-500 text-sm mb-4">
              <p>{error}</p>
            </div>
          )}

          <Button
            className="w-full bg-[#3097db] hover:bg-[#5cbfb7] text-white font-semibold cursor-pointer mb-3"
            onClick={handleLogin}
          >
            로그인
          </Button>

          <Button
            className="w-full bg-[#FAE100] text-black font-bold hover:bg-[#f5d700] cursor-pointer flex items-center justify-center"
            onClick={handleKakaoLogin}
            disabled={!sdkReady}
          >
            <img 
              src="/images/kakao_icon.png" 
              alt="카카오 아이콘" 
              className="w-5 h-5 mr-2" 
            />
            {!sdkReady ? "카카오 로그인 준비 중..." : "카카오로 시작하기"}
          </Button>
          {!sdkReady && (
            <div className="flex justify-center mt-2">
              <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
