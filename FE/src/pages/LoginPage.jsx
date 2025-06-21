// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/apis/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!loginId || !password) {
      setError("아이디와 비밀번호를 입력하세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/user/login", {
        userId: loginId,
        userPwd: password,
      });

      const token = response.data;
      localStorage.setItem("accessToken", token);

      setError("");
      // alert("로그인 성공");
      navigate("/");
    } catch (err) {
      console.error("로그인 실패:", err);
      setError("로그인에 실패했습니다. 아이디 또는 비밀번호를 확인하세요.");
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
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <Button
            className="w-full bg-[#3097db] hover:bg-[#5cbfb7] text-white font-semibold cursor-pointer"
            onClick={handleLogin}
          >
            로그인
          </Button>
        </div>
      </div>
    </div>
  );
}
