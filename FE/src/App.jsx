import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserMainPage from "./pages/UserMainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./App.css";
// import ChatGpt from "./pages/ChatGpt";  // 파일이 존재하지 않아 주석 처리
import MainPage from "./pages/MainPage";
import AnnouncementList from "./pages/AnnouncementList";
import Layout from "./components/announcementlist/Layout";
import AnnouncementDetailData from "./pages/AnnoucementDetailData";
import PrivateRoute from "./components/PrivateRoute";
import KakaoCallback from "@/pages/KakaoCallback";
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // 카카오 SDK 초기화 - 앱 전체에서 한 번만 실행
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("d076a1e351579df59c4f6c6149fe82e7"); // JavaScript 키
      console.log("Kakao SDK 초기화 결과:", window.Kakao.isInitialized());
    }
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/usermain" element={<UserMainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/kakao-callback" element={<KakaoCallback />} />
        <Route element={<Layout />}>
          {/* ChatGpt 컴포넌트가 없어 주석 처리
          <Route
            path="/chatgpt"
            element={
              <PrivateRoute>
                <ChatGpt />
              </PrivateRoute>
            }
          />
          */}
          <Route
            path="/announcementList"
            element={
              <PrivateRoute>
                <AnnouncementList />
              </PrivateRoute>
            }
          />
          <Route
            path="/announcement/:panId"
            element={
              <PrivateRoute>
                <AnnouncementDetailData />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
