//package com.group8.NotificationService.notification.infrastructure.fcm;
//
//import com.group8.NotificationService.notification.domain.FcmToken;
//import com.group8.NotificationService.notification.infrastructure.repository.FcmTokenRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//
//@Slf4j
//@Service
//@RequiredArgsConstructor
//public class FcmTokenService {
//    private final FcmTokenRepository fcmTokenRepository;
//
//    public void registerOrUpdateFcmToken (String userId, String token) {
//        FcmToken fcmToken = fcmTokenRepository.findByUserId(userId)
//                .map(existing -> {
//                    existing.setToken(token);
//                    return existing;
//                })
//                .orElse(new FcmToken(userId, token));
//
//        fcmTokenRepository.save(fcmToken);
//    }
//}
