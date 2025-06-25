package com.group8.NotificationService.notification.infrastructure.repository;

import com.group8.NotificationService.notification.domain.Notification;
import com.group8.NotificationService.notification.domain.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // 특정 유저의 노티피케이션 정렬
    List<Notification> findByUserIdOrderByCreatedAtDesc (String userId);

    // 안 읽은 알림 갯수 조회
    int countByUserIdAndIsReadFalse(String userId);

    // 특정 타입 알림 조회
    List<Notification> findByUserIdAndNotificationTypeOrderByCreatedAtDesc (String userId, NotificationType notiType);

    // 알림 하나 내용 조회
    Optional<Notification> findByUserIdAndId(String userId, Long notiId);

}
