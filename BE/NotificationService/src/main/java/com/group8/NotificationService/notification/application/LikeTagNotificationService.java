package com.group8.NotificationService.notification.application;

import com.group8.NotificationService.event.consumer.message.likedtag.LikeTagEvent;
import com.group8.NotificationService.notification.domain.Notification;
import com.group8.NotificationService.notification.domain.NotificationSender;
import com.group8.NotificationService.notification.domain.enums.NotificationType;
import com.group8.NotificationService.notification.infrastructure.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class LikeTagNotificationService {

    private final NotificationSender notificationSender;
    private final NotificationRepository notificationRepository;

    public void handle(LikeTagEvent event) {
        String userId = event.getUserId();
        String tagId = event.getTagId();
        String action = event.getAction();

        switch (action) {
            case "LOCATION_NEW":
                // 위치 기반 새 공고 알림 발송 - FCM
                notificationSender.send(userId, "새로운 관심 지역 공고가 등록됐어요! [" + tagId + "]");

                // 알림 정보 DB 저장
                Notification newLocationNoti = Notification.builder()
                        .userId(userId)
                        .title("새로운 관심 지역 공고")
                        .message("새로운 관심 지역 공고가 등록됐어요! [" + tagId + "]") //TODO 유저의 관심 정보를 받아서 어떤 지역인지 알림에 넣기
                        .notificationType(NotificationType.NEW)
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .build();

                notificationRepository.save(newLocationNoti);

                break;

            case "TYPE_NEW":
                // 유형 기반 새 공고 알림 발송
                notificationSender.send(userId, "관심 유형의 공고가 올라왔어요! [" + tagId + "]");

                // 알림 정보 DB 저장
                Notification newTypeNoti = Notification.builder()
                        .userId(userId)
                        .title("새로운 관심 유형 공고")
                        .message("새로운 관심 유형 공고가 등록됐어요! [" + tagId + "]") //TODO 유저의 관심 정보를 받아서 어떤 지역인지 알림에 넣기
                        .notificationType(NotificationType.TYPE)
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .build();

                notificationRepository.save(newTypeNoti);

                break;

            default:
                log.warn("처리되지 않은 action: {}", action);
        }
    }

}
