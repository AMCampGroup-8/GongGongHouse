package com.group8.NotificationService.service.notification;

public interface NotificationSender {
    void send(String userId, String message);
}