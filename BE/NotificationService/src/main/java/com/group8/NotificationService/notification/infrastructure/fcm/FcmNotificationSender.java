//package com.group8.NotificationService.notification.infrastructure.fcm;
//
//import com.google.firebase.messaging.FirebaseMessaging;
//import com.google.firebase.messaging.Message;
//import com.group8.NotificationService.notification.domain.FcmToken;
//import com.group8.NotificationService.notification.domain.NotificationSender;
//import com.group8.NotificationService.notification.infrastructure.repository.FcmTokenRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Component;
//
//@Slf4j
//@Component
//@RequiredArgsConstructor
//public class FcmNotificationSender implements NotificationSender {
//
//    private final FirebaseMessaging firebaseMessaging;
//    private final FcmTokenRepository fcmTokenRepository;
//
//
//    @Override
//    public void send(String userId, String message) {
//        String token = fcmTokenRepository.findByUserId(userId)
//                .map(FcmToken::getToken)
//                .orElse(null);
//
//        if (token == null || token.isEmpty()) {
//            log.warn("No FCM token found for userId = {}", userId);
//            return;
//        }
//
//        Message fcmMessage = Message.builder()
//                .putData("title", "공공하우스 알림")
//                .putData("body", message)
//                .setToken(token)
//                .build();
//
//        try {
//            firebaseMessaging.send(fcmMessage);
//            log.info("FCM message sent successful: userId = {}, token = {}", userId, token);
//        } catch (Exception e) {
//            log.error("message send failed", e);
//        }
//    }
//}
