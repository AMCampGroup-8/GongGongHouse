package com.group8.NotificationService.notification.ui.dto;

import com.group8.NotificationService.notification.domain.Notification;
import com.group8.NotificationService.notification.domain.enums.NotificationType;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

@Slf4j
@Getter
public class NotificationResponseDto {
    private Long notificationId;
    private String title;
    private String message;
    private NotificationType notificationType;
    private boolean isRead;
    private LocalDateTime createdAt;


    public NotificationResponseDto(Long notificationId, String title, String message, NotificationType notificationType, boolean isRead, LocalDateTime createdAt) {
        this.notificationId = notificationId;
        this.title = title;
        this.message = message;
        this.notificationType = notificationType;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public static NotificationResponseDto from(Notification notification) {
        log.info("변환 시작: id={}, type={}", notification.getId(), notification.getNotificationType());
        log.info("변환 시작: id={}, type={}", notification.getId(), notification.getNotificationType());
        return new NotificationResponseDto(notification.getId(), notification.getTitle(), notification.getMessage(), notification.getNotificationType(), notification.isRead(), notification.getCreatedAt());
    }
}
