import React, { useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { getUserIdFromToken } from "../utils/jwt";

type Notification = {
  notificationId: number;
  userId: string;
  title: string;
  message: string;
  notificationType: string;
  isRead: boolean;
  createdAt: string;
};

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotification] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const userId = token ? getUserIdFromToken(token) : null;
        if (!userId) {
          console.error("유저 토큰이 없습니다.");
          return;
        }
        const res = await fetch(
          `http://localhost:8080/notifications?userId=${userId}`
        );
        const json = await res.json();
        console.log("백엔드에서 받은 데이터:", json);

        const now = new Date();
        const expired = new Date(now.setMonth(now.getMonth() - 3));

        const normalized: Notification[] = json.data.map((n: any) => ({
          ...n,
          isRead: n.read, // Normalize 'read' field from backend to 'isRead'
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
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-gray-800">공공하우스</div>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative focus:outline-none"
        >
          <BellIcon className="w-6 h-6 text-gray-600" />
          {notifications.filter((n) => !n.isRead).length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-500 rounded-full">
              {notifications.filter((n) => !n.isRead).length}
            </span>
          )}
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
            <ul className="divide-y divide-gray-200">
              {notifications.filter((n) => !n.isRead).length > 0 ? (
                notifications
                  .filter((n) => !n.isRead)
                  .slice(0, 3)
                  .map((n) => (
                    <li
                      key={n.notificationId}
                      onClick={async () => {
                        const updated = !n.isRead;
                        setNotification((prev) =>
                          prev.map((item) =>
                            item.notificationId === n.notificationId
                              ? { ...item, isRead: updated }
                              : item
                          )
                        );
                        try {
                          await fetch(
                            `http://localhost:8080/notifications/${n.notificationId}/read`,
                            {
                              method: "PATCH",
                            }
                          );
                        } catch (err) {
                          console.error("읽음/읽지 않음 처리 실패", err);
                        }
                      }}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-600">{n.message}</p>
                    </li>
                  ))
              ) : (
                <li className="p-3 text-sm text-gray-500 text-center">
                  새로운 알림이 없습니다
                </li>
              )}
            </ul>
            <div className="text-center border-t p-2">
              <a
                href="/notifications"
                className="text-blue-600 text-sm hover:underline"
              >
                전체 알림 보기
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
