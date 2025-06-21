import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/apis/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [idCheckMessage, setIdCheckMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "id") {
      setIdCheckMessage(""); // 아이디 변경 시 중복 확인 초기화
    }
  };

  // 아이디 중복 확인
  const checkDuplicateId = async () => {
    if (!form.id) {
      setIdCheckMessage("아이디를 입력하세요.");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/api/user/check-id?userId=${form.id}`
      );

      if (res.data.exists) {
        setIdCheckMessage("이미 사용 중인 아이디입니다.");
      } else {
        setIdCheckMessage("사용 가능한 아이디입니다.");
      }
    } catch (err) {
      console.error("아이디 중복 확인 실패:", err);
      setIdCheckMessage("서버 오류로 확인할 수 없습니다.");
    }
  };

  // 정규식 검증 함수들
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone) =>
    /^(010)-?\d{4}-?\d{4}$/.test(phone);

  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password);

  const handleRegister = async () => {
    const { id, email, password, confirmPassword, name, phone } = form;

    if (!id || !email || !password || !confirmPassword || !name || !phone) {
      setError("모든 항목을 입력하세요.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    if (!isValidPhone(phone)) {
      setError("전화번호 형식이 올바르지 않습니다.");
      return;
    }

    if (!isValidPassword(password)) {
      setError("비밀번호는 최소 8자 이상이며, 대/소문자, 숫자, 특수문자를 포함해야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/user/register", {
        userId: id,
        userEmail: email,
        userPwd: password,
        userName: name,
        phone: phone,
      });

      setError("");
      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (err) {
      console.error("회원가입 실패:", err);
      setError("회원가입 실패: 이미 존재하는 아이디 또는 이메일일 수 있습니다.");
    }
  };

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url("/images/backgroundImg3.png")` }}
    >
      <div className="flex flex-col items-center justify-start min-h-screen pt-6">
        <img src="/images/mainLogo.png" alt="내집GO 로고" className="w-1/6" />

        <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl px-10 py-8 w-[400px] lg:w-[450px]">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            회원가입
          </h2>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              {/* 아이디 입력창 */}
              <Input
                name="id"
                placeholder="아이디"
                value={form.id}
                onChange={handleChange}
              />

              {/* 메시지 + 버튼 (항상 두 개 유지) */}
              <div className="flex items-center justify-between mt-1">
                <span
                  className={`text-sm h-5 ${idCheckMessage
                      ? idCheckMessage.includes("가능")
                        ? "text-green-600"
                        : "text-red-500"
                      : "text-transparent"
                    }`}
                >
                  {idCheckMessage || "메시지 자리"}
                </span>

                <Button
                  type="button"
                  className="text-sm px-3 py-1 bg-[#3097db] hover:bg-[#5cbfb7] text-white font-semibold rounded cursor-pointer"
                  onClick={checkDuplicateId}
                >
                  중복 확인
                </Button>
              </div>
            </div>


            <Input
              name="email"
              placeholder="이메일"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <Input
              name="name"
              placeholder="이름"
              value={form.name}
              onChange={handleChange}
            />
            <Input
              name="phone"
              placeholder="전화번호"
              value={form.phone}
              onChange={handleChange}
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              onClick={handleRegister}
              className="bg-[#3097db] hover:bg-[#5cbfb7] text-white font-semibold cursor-pointer"
            >
              회원가입
            </Button>

            {/* <Button
              disabled
              className="bg-[#FAE100] text-black font-bold hover:bg-[#f5d700] w-full cursor-not-allowed"
            >
              카카오톡으로 가입
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
