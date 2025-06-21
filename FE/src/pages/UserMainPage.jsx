import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import KakaoLoginButton from "@/components/KakaoLoginButton";

export default function MemberMainPage() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/images/backgroundImg3.png')` }}
    >
      <div className="flex flex-col items-center justify-start min-h-screen pt-6 gap-10">
        
        <img
          src="/images/mainLogo.png"
          alt="앱 로고"
          className="w-1/5"
        />

        <div className="flex flex-col items-center gap-6">
          <Button
            className="w-80 h-14 text-lg bg-[#3097db] hover:bg-[#5cbfb7] text-white font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            로그인
          </Button>
          <Button
            className="w-80 h-14 text-lg bg-[#3097db] hover:bg-[#5cbfb7] text-white font-semibold cursor-pointer"
            onClick={() => navigate("/register")}
          >
            회원가입
          </Button>

          <KakaoLoginButton />
        </div>
      </div>
    </div>
  );
}
