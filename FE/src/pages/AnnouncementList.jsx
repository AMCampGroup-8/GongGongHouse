import React, { useEffect, useState } from "react";
import AnnouncementSidebar from "../components/announcementlist/Sidebar";
import AnnouncementFilterBar from "../components/announcementlist/AnnouncementFilterBar";
import AnnouncementTable from "../components/announcementlist/AnnouncementTable";
import axios from "axios";
import { getLhAnnouncements } from "../components/announcementlist/api";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// LH API 키 (실제 사용 시 환경 변수로 관리하는 것을 추천)
const API_KEY = "6NyqkFLFWxC9mkkEU6ntshrtBhh+77ivcPNYzUql7auzUuyQJAX1p8a8avnSHv4ElqjrpsqQkQOuFfmInwyF5A==";

// 필터링 값 타입 정의
const FilterValues = {
  title: String, // 공고명 검색어
  status: String, // 상태 필터
  region: String, // 지역 필터
  type: String, // 유형 필터
  dateType: String, // 날짜 타입 (게시일/마감일)
  startDate: String, // 시작 날짜
  endDate: String, // 종료 날짜
};

const AnnouncementList = () => {
  // URL 파라미터에서 검색어 가져오기
  const searchParams = new URLSearchParams(window.location.search);
  const searchKeyword = searchParams.get("search") || "";
  const isDefaultSearch = searchKeyword === "";

  // 상태 관리
  const [announcements, setAnnouncements] = useState([]); // 공고 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(""); // 에러 메시지
  const [filters, setFilters] = useState({
    // 필터 상태
    region: "",
    status: "",
    dateType: "",
    startDate: "",
    endDate: "",
    title: searchKeyword || "청년,신혼",
  });

  // Update the title filter when search parameter changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      title: searchKeyword || "청년,신혼",
    }));
  }, [searchKeyword]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 10; // 페이지당 아이템 수

  // 페이지네이션 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = announcements.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 번호 생성
  const totalPages = Math.ceil(announcements.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // 공고 데이터 가져오기

  const fetchAnnouncements = async (filters) => {
    try {
      // Use the search parameter directly if provided
      const searchTitle = searchKeyword ? searchKeyword : "청년,신혼";

      // 날짜 필터링 파라미터 설정
      const dateParams =
        filters && filters.dateType
          ? {
              [filters.dateType === "게시일" ? "PAN_DT" : "PAN_END_DT"]: {
                $gte: filters.startDate,
                $lte: filters.endDate,
              },
            }
          : {};

      // 청년/신혼 공고를 별도로 API 호출
      const responses = await Promise.all([
        axios
          .get("http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1", {
            params: {
              serviceKey: API_KEY,
              PG_SZ: 100,
              PAGE: 1,
              PAN_NM: "청년",
            },
          })
          .then((response) => {
            // API 호출 로그
            console.log("청년 공고 API 호출 완료:", {
              url: response.config.url,
              params: response.config.params,
              status: response.status,
            });

            // API 응답 데이터 로그
            console.log("청년 공고 API 응답 데이터:", {
              totalCount: response.data[0]?.total_count || 0,
              itemsCount: response.data[1]?.dsList?.length || 0,
              items:
                response.data[1]?.dsList?.map((item) => ({
                  PAN_NM: item.PAN_NM,
                  AIS_TP_CD_NM: item.AIS_TP_CD_NM,
                  CNP_CD_NM: item.CNP_CD_NM,
                  PAN_SS: item.PAN_SS,
                })) || [],
            });

            return response;
          }),
        axios
          .get("http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1", {
            params: {
              serviceKey: API_KEY,
              PG_SZ: 100,
              PAGE: 1,
              PAN_NM: "신혼",
            },
          })
          .then((response) => {
            // API 호출 로그
            console.log("신혼 공고 API 호출 완료:", {
              url: response.config.url,
              params: response.config.params,
              status: response.status,
            });

            // API 응답 데이터 로그
            console.log("신혼 공고 API 응답 데이터:", {
              totalCount: response.data[0]?.total_count || 0,
              itemsCount: response.data[1]?.dsList?.length || 0,
              items:
                response.data[1]?.dsList?.map((item) => ({
                  PAN_NM: item.PAN_NM,
                  AIS_TP_CD_NM: item.AIS_TP_CD_NM,
                  CNP_CD_NM: item.CNP_CD_NM,
                  PAN_SS: item.PAN_SS,
                })) || [],
            });

            return response;
          }),
      ]);

      // 검색어에 따른 데이터 처리
      let filteredData = [];

      // 기본 검색일 때는 모든 데이터 합치기
      if (isDefaultSearch) {
        filteredData = [...(responses[0].data[1].dsList || []), ...(responses[1].data[1].dsList || [])];
      } else if (searchTitle.includes("청년")) {
        filteredData = responses[0].data[1].dsList || [];
      } else if (searchTitle.includes("신혼")) {
        filteredData = responses[1].data[1].dsList || [];
      }

      // 클라이언트 측 필터링
      filteredData = filteredData.filter((item) => {
        // 각 필터 조건 체크
        const matchesType = !filters?.type || item.AIS_TP_CD_NM.includes(filters.type);
        const matchesRegion = !filters || !filters.region || item.CNP_CD_NM.includes(filters.region);
        const matchesStatus = !filters || !filters.status || item.PAN_SS.includes(filters.status);
        const matchesTitle =
          !filters || !filters.title || item.PAN_NM.toLowerCase().includes(filters.title.toLowerCase());

        // 기본 상태에서는 모든 데이터 표시
        if (!filters || (!filters.dateType && !filters.region && !filters.status && !filters.title && !filters.type)) {
          return true;
        }

        // 날짜 필터링
        if (filters && filters.dateType) {
          const targetDate = filters.dateType === "게시일" ? item.PAN_NT_ST_DT : item.CLSG_DT;

          // 날짜가 없을 경우 필터링 통과
          if (!targetDate) {
            console.log("날짜 필터링 - 날짜 없음:", item.PAN_NM);
            return true;
          }

          // 날짜 형식 변환 함수
          const formatDate = (date) => {
            if (!date) return new Date("1970-01-01");

            // YYYY-MM-DD 형식을 그대로 사용
            if (date.includes("-")) return new Date(date);

            // YYYY.MM.DD 형식을 YYYY-MM-DD로 변환
            const parts = date.split(".");
            if (parts.length === 3) {
              const [year, month, day] = parts;
              return new Date(`${year}-${month}-${day}`);
            }

            // YYYYMMDD 형식을 YYYY-MM-DD로 변환
            const year = date.slice(0, 4);
            const month = date.slice(4, 6);
            const day = date.slice(6, 8);
            return new Date(`${year}-${month}-${day}`);
          };

          const target = formatDate(targetDate);
          const startDate = formatDate(filters.startDate || "");
          const endDate = formatDate(filters.endDate || "");

          return (
            matchesType && matchesRegion && matchesStatus && matchesTitle && target >= startDate && target <= endDate
          );
        }

        return matchesType && matchesRegion && matchesStatus && matchesTitle;
      });

      // 필터링된 데이터 변환하여 저장
      // 전체 공고 수 계산
      const totalAnnouncements = filteredData.length;

      // 페이지당 아이템 수 계산
      const itemsPerPage = 10;

      // 현재 페이지의 시작 인덱스 계산
      const startIndex = (currentPage - 1) * itemsPerPage;

      setAnnouncements(
        filteredData.map((item, index) => ({
          ANNOUNCEMENT_NO: startIndex + index + 1, // 공고 번호 (전체 번호 계산)
          PAN_NM: item.PAN_NM, // 공고명
          PAN_NT_ST_DT: item.PAN_NT_ST_DT, // 공고일
          CLSG_DT: item.CLSG_DT, // 마감일
          CNP_CD_NM: item.CNP_CD_NM, // 지역명
          AIS_TP_CD_NM: item.AIS_TP_CD_NM, // 유형명
          DTL_URL: item.DTL_URL, // 상세링크
          PAN_SS: item.PAN_SS,
          PAN_ID: item.PAN_ID, // 상태
          SPL_INF_TP_CD: item.SPL_INF_TP_CD,
          CCR_CNNT_SYS_DS_CD: item.CCR_CNNT_SYS_DS_CD,
          UPP_AIS_TP_CD: item.UPP_AIS_TP_CD,
          AIS_TP_CD: item.AIS_TP_CD,
        }))
      );
    } catch (err) {
      setError("공고 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 공고 데이터 로드
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 mt-7">{searchKeyword} 청약 공고 모음</h1>
      <div className="mb-6">
        <AnnouncementFilterBar onFilter={fetchAnnouncements} />
      </div>
      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* 현재 페이지의 공고 데이터 표시 */}
          <AnnouncementTable announcements={currentItems} className="mt-6" />

          {/* 페이지네이션 */}
          <Pagination className="my-8">
            <PaginationContent>
              {/* 이전 페이지 버튼 */}
              <PaginationItem
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <PaginationPrevious href="#" />
              </PaginationItem>
              {/* 페이지 번호 버튼 */}
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`px-3 py-1 mx-1 rounded ${
                    currentPage === number
                      ? "bg-[#5DC1B7] text-black"
                      : "bg-[#ECFFF7] hover:bg-[#5DC1B7] cursor-pointer"
                  }`}
                >
                  {number}
                </button>
              ))}
              {/* 다음 페이지 버튼 */}
              <PaginationItem
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
};

export default AnnouncementList;
