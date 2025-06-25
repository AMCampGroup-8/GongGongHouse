import InfoCard from "@/components/main_page/infoCard";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/apis/axiosInstance";
import { useNavigate } from "react-router-dom";

const cardList = [
  { image: "/images/Youth.png", link: "/announcementList?search=청년" },
  { image: "/images/subscription.png", link: "/announcementList" },
  { image: "/images/newlyweds.png", link: "/announcementList?search=신혼" },
];

// JWT 토큰 디코딩 함수
const decodeJwtToken = (token) => {
  try {
    // 토큰이 유효한 형식인지 확인
    if (!token || typeof token !== 'string' || !token.includes('.')) {
      console.error('유효하지 않은 토큰 형식:', token);
      return null;
    }
    
    // 토큰 구조 확인 및 로깅
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('JWT 토큰은 3개 부분(header.payload.signature)으로 구성되어야 합니다.');
      return null;
    }
    
    console.log('토큰 구조:', {
      header: parts[0],
      payload: parts[1],
      signature: parts[2]
    });
    
    // Base64 디코딩 시도
    try {
      // Base64 URL 디코딩을 위한 패딩 추가
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64;
      
      const decodedPayload = JSON.parse(atob(paddedBase64));
      console.log('디코딩된 페이로드:', decodedPayload);
      return decodedPayload;
    } catch (error) {
      console.error('Base64 디코딩 오류:', error);
      return null;
    }
  } catch (error) {
    console.error('토큰 디코딩 중 오류 발생:', error);
    return null;
  }
};

export default function MainPage() {
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("저장된 accessToken:", token);

    if (!token) {
      console.warn("accessToken이 없음. API 요청 안 함.");
      return;
    }

    // JWT 토큰 디코딩하여 userId 추출
    const decodedPayload = decodeJwtToken(token);
    
    if (decodedPayload) {
      // userId는 sub 또는 userId 필드에 있을 수 있음
      const userId = decodedPayload.sub || decodedPayload.userId;
      
      if (userId) {
        console.log("추출된 userId:", userId);
        
        // 사용자 정보 요청
        axiosInstance
          .get(`/user-service/api/users/userId/${userId}`)
          .then((res) => {
            console.log("사용자 응답:", res.data);
            setUserName(res.data.userName);
          })
          .catch((err) => {
            console.error("사용자 정보 불러오기 실패:", err);
          });
      } else {
        console.error("토큰에서 userId를 찾을 수 없습니다.");
      }
    }
  }, []);

  const handleCardClick = (link) => {
    if (!userName) {
      alert("로그인이 필요한 서비스입니다!");
      navigate("/usermain");
      return;
    }

    if (link) {
      navigate(link); // 추후 링크 연결 시
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-b from-white to-blue-50 
                 bg-[url('/images/backgroundImg3.png')] bg-cover bg-center 
                 flex flex-col items-center py-12 px-4"
    >
      <img src="/images/mainLogo.png" alt="내집GO 로고" className="w-1/5" />

      <div className="text-left mb-12 leading-loose -mt-6 text-center">
        {userName ? (
          <>
            <div className="text-2xl md:text-3xl font-bold text-gray-800">
              <span>{userName}</span>님 환영합니다!
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-800">
              청년과 신혼부부를 위한 맞춤형 주거 정보, 한눈에 확인하세요
            </div>
          </>
        ) : (
          <>
            <div className="text-2xl md:text-3xl font-bold text-gray-800">
              청년과 신혼부부를 위한
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-800">
              맞춤형 주거 정보, 한눈에 확인하세요
            </div>
          </>
        )}
      </div>

      <div className="flex flex-row justify-center items-start gap-24 w-full max-w-5x">
        {cardList.map((card, idx) => (
          <div key={idx} className={idx === 1 ? "mt-10" : ""}
            onClick={() => handleCardClick(card.link)}>
            <InfoCard key={idx} image={card.image} link={card.link} />
          </div>
        ))}
      </div>
    </div>
  );
}
