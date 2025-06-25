import React, { useEffect, useState } from "react";
import { getUserIdFromToken } from "../utils/jwt";

const NotificationPage = () => {
  const [notifications, setNotification] = useState([]);

  const [readFilter, setReadFilter] = useState("UNREAD");
  const [notificationTypeFilter, setNotificationTypeFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [readFilter, notificationTypeFilter]);

  const filteredNotifications = notifications.filter((n) => {
    const readMatches =
      readFilter === "ALL" || (readFilter === "READ" ? n.isRead : !n.isRead);
    const typeMatches =
      notificationTypeFilter === "ALL" ||
      n.notificationType === notificationTypeFilter;
    return readMatches && typeMatches;
  });

  const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage);
  const startIndex = (currentPage - 1) * notificationsPerPage;
  const currentNotifications = filteredNotifications.slice(startIndex, startIndex + notificationsPerPage);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("JWT 토큰 없음");

        const userId = getUserIdFromToken(token);
        if (!userId) throw new Error("userId 파싱 실패");

        const res = await fetch("http://localhost:8080/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Auth-UserId": userId,
          },
        });
        const json = await res.json();
        console.log("백엔드에서 받은 데이터:", json);

        const now = new Date();
        const expired = new Date(now.setMonth(now.getMonth() - 3));

        const normalized = json.data.map((n) => ({
          ...n,
          isRead: n.read,
        }));

        const filtered = normalized
          .filter((n) => new Date(n.createdAt) > expired)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        setNotification(filtered);
      } catch (err) {
        console.error("알림 조회 실패", err);
      }
    };

    fetchNotification();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6">알림</h2>
        <div className="flex justify-end space-x-4 mb-4 text-sm font-semibold">
          <button
            onClick={() => setReadFilter("READ")}
            className={`hover:text-orange-500 ${readFilter === "READ" ? "text-blue-600 font-bold" : "text-gray-500"}`}
          >
            읽음
          </button>
          <button
            onClick={() => setReadFilter("UNREAD")}
            className={`hover:text-orange-500 ${readFilter === "UNREAD" ? "text-blue-600 font-bold" : "text-gray-500"}`}
          >
            읽지 않음
          </button>
          <button
            onClick={() => setReadFilter("ALL")}
            className={`hover:text-orange-500 ${readFilter === "ALL" ? "text-blue-600 font-bold" : "text-gray-500"}`}
          >
            전체
          </button>
        </div>
        <div className="flex justify-center space-x-6 mb-6 text-lg font-medium">
          <button
            onClick={() => setNotificationTypeFilter("ALL")}
            className={`hover:text-orange-500 ${notificationTypeFilter === "ALL" ? "text-blue-600 font-bold" : "text-gray-500"}`}
          >
            전체 알림
          </button>
          <button
            onClick={() => setNotificationTypeFilter("NEW")}
            className={`hover:text-orange-500 ${notificationTypeFilter === "NEW" ? "text-blue-600 font-bold" : "text-gray-500"}`}
          >
            관심 지역 공고 알림
          </button>
          <button
            onClick={() => setNotificationTypeFilter("TYPE")}
            className={`hover:text-orange-500 ${notificationTypeFilter === "TYPE" ? "text-blue-600 font-bold" : "text-gray-500"}`}
          >
            관심 유형 알림
          </button>
          <button
            onClick={() => setNotificationTypeFilter("DEADLINE")}
            className={`hover:text-orange-500 ${notificationTypeFilter === "DEADLINE" ? "text-blue-600 font-bold" : "text-gray-500"}`}
          >
            마감 임박 알림
          </button>
          <button
            onClick={() => setNotificationTypeFilter("COMMENT")}
            className={`hover:text-orange-500 ${notificationTypeFilter === "COMMENT" ? "text-blue-600 font-bold" : "text-gray-500"}`}
          >
            새 댓글 알림
          </button>
        </div>
        <div className="space-y-5">
          {currentNotifications.map((n) => (
            <div
              key={n.notificationId}
              onClick={async () => {
                const token = localStorage.getItem("token");
                if (!token) {
                  console.error("JWT 토큰 없음");
                  return;
                }
                const userId = getUserIdFromToken(token);
                if (!userId) {
                  console.error("userId 파싱 실패");
                  return;
                }
                const updated = !n.isRead;
                setNotification((prev) =>
                  prev.map((item) =>
                    item.notificationId === n.notificationId
                      ? { ...item, isRead: updated }
                      : item
                  )
                );
                try {
                  await fetch(`http://localhost:8080/notifications/${n.notificationId}/read`, {
                    method: "PATCH",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "X-Auth-UserId": userId,
                    },
                  });
                } catch (err) {
                  console.error("읽음/읽지 않음 처리 실패", err);
                }
              }}
              className={`cursor-pointer ${
                n.isRead ? "bg-gray-100" : "bg-white"
              } shadow-md rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col px-4">
                  <h3 className="text-lg font-bold text-gray-900">{n.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mt-1">
                    {n.message}
                  </p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap pr-4">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
