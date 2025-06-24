package com.group8.NotificationService.notification.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import com.group8.NotificationService.notification.domain.enums.NotificationType;

import java.time.LocalDateTime;

@Slf4j
@Entity
@Table(name = "notification")
@Getter
@Setter
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "message", nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "noti_type", nullable = false)
    private NotificationType notificationType;

    @Column(name = "is_read")
    private boolean isRead;


    @Column(name = "created_at")
    private LocalDateTime createdAt;

    protected Notification() {}

    @Builder
    public Notification(String userId, String title, String message, NotificationType notificationType, boolean isRead, LocalDateTime createdAt) {
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.notificationType = notificationType;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void onCreate() {
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }

    public void markAsReadOrUnread() {
        this.isRead = !this.isRead;
    }
}
