import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KakaoLoginButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Kakao SDK 동적 로드
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
        console.log("Kakao SDK 로드 및 초기화 완료");
      }
    };
    document.head.appendChild(script);
  }, []);

  const handleLogin = () => {
    if (!window.Kakao) {
      console.error("Kakao SDK가 아직 로드되지 않았습니다.");
      return;
    }

    window.Kakao.Auth.login({
      scope: "profile_nickname, account_email",
      success: function (authObj) {
        fetch("http://localhost:8080/auth/kakao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: authObj.access_token }),
        })
          .then((res) => res.json())
          .then((data) => {
            localStorage.setItem("accessToken", data.token);
            navigate("/");
          });
      },
      fail: function (err) {
        console.error("카카오 로그인 실패", err);
      },
    });
  };

  return (
    <button className="w-full cursor-pointer" onClick={handleLogin}>
      <img className="w-full" src="/images/kakao_login_medium_wide.png" alt="Kakao Logo" />
    </button>
  );
};

export default KakaoLoginButton;
