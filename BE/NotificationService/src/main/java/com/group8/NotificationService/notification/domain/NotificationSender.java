package com.group8.NotificationService.notification.domain;

public interface NotificationSender {
    void send(String userId, String message);
}