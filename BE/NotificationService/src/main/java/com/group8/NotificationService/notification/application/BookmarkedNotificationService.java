package com.group8.NotificationService.notification.application;

import com.group8.NotificationService.event.consumer.message.bookmarked.BookmarkedEvent;
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
public class BookmarkedNotificationService {

    private final NotificationSender notificationSender;
    private final NotificationRepository notificationRepository;

    public void handle(BookmarkedEvent event) {
        String userId = event.getUserId();
        String panId = event.getPanId();
        String action = event.getAction();
        String update = event.getUpdate();

        switch (action) {
            case "UPDATE":
                // 관심 처리 해놓은 공고 업데이트 알림 발송 - FCM
                notificationSender.send(userId, "관심 공고가 새롭게 업데이트 됐어요! [" + panId + "]");

                // 알림 정보 DB 저장
                Notification updateNoti = Notification.builder()
                        .userId(userId)
                        .title("관심 공고 새 소식")
                        .message("관심 공고가 새롭게 업데이트 됐어요! [" + panId + "]") //TODO 유저의 관심 정보를 받아서 어떤 지역인지 알림에 넣기
                        .notificationType(NotificationType.UPDATE)
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .build();

                notificationRepository.save(updateNoti);
                break;

            case "DEADLINE":

                // 관심 처리 해놓은 공고 업데이트 알림 발송 - FCM
                notificationSender.send(userId, "관심 표시 한 공고가 곧 마감 되요! [" + panId + "]");

                // 알림 정보 DB 저장
                Notification deadlineNoti = Notification.builder()
                        .userId(userId)
                        .title("관심 공고 마감 예정")
                        .message("관심 표시 한 공고가 곧 마감 되요! [" + panId + "]") //TODO 마감 예정 시간 받아와서 알려주기
                        .notificationType(NotificationType.DEADLINE)
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .build();

                notificationRepository.save(deadlineNoti);
                break;

            default:
                log.warn("처리되지 않은 action: {}", action);
        }
    }

}
