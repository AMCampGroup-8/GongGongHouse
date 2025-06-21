import InfoCard from "@/components/main_page/infoCard";
import React, { useEffect, useState } from "react";
import axios from "@/apis/axiosInstance";
import { useNavigate } from "react-router-dom";

const cardList = [
  { image: "/images/Youth.png", link: "/announcementList?search=청년" },
  { image: "/images/subscription.png", link: "/announcementList" },
  { image: "/images/newlyweds.png", link: "/announcementList?search=신혼" },
];

export default function MainPage() {
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    // console.log("accessToken:", token);

    if (!token) {
      console.warn("accessToken이 없음. API 요청 안 함.");
      return;
    }

    axios
      .get("http://localhost:8080/api/user/get-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log("✅ 사용자 응답:", res.data);
        setUserName(res.data.userName);
      })
      .catch((err) => {
        console.error("사용자 정보 불러오기 실패:", err);
      });
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
