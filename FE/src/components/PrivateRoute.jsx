import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("로그인이 필요한 서비스입니다.");
    return <Navigate to="/usermain" replace />;
  }

  return children;
}
