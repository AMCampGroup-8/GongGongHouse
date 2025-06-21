import React from "react";
import { useNavigate } from "react-router-dom";

export default function InfoCard({ image, link }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(link)}
      className="w-72 h-72 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl 
                 transition duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      <img
        src={image}
        alt="카드 이미지"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
