package com.group8.NotificationService.notification.application;

import com.group8.NotificationService.event.consumer.message.community.CommunityEvent;
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
public class CommunityNotificationService {

    private final NotificationSender notificationSender;
    private final NotificationRepository notificationRepository;

    public void handle(CommunityEvent event) {
        String userId = event.getUserId();
        String postId = event.getPostId();
        String postTitle = event.getPostTitle();
        String action = event.getAction();

        // 관심 처리 해놓은 공고 업데이트 알림 발송 - FCM
        notificationSender.send(userId, "게시글 " + postTitle + "에 새로운 댓글 알림");

        // 알림 정보 DB 저장
        Notification newLocationNoti = Notification.builder()
                .userId(userId)
                .title("새로운 댓글 알림")
                .message("작성하신 게시글 [" + postTitle + "] 에 새로운 댓글이 달렸습니다!")
                .notificationType(NotificationType.COMMENT)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(newLocationNoti);
    }

}
