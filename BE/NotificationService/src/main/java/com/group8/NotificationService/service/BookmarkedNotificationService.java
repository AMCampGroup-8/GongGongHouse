package com.group8.NotificationService.service;

import com.group8.NotificationService.event.consumer.message.bookmarked.BookmarkedEvent;
import com.group8.NotificationService.service.notification.NotificationSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookmarkedNotificationService {

    private final NotificationSender notificationSender;

    public void handle(BookmarkedEvent event) {
        String userId = event.getUserId();
        String tagId = event.getPanId();
        String action = event.getAction();
        String update = event.getUpdate();


        //TODO: 비즈니스 로직 짜기
//        switch (action) {
//            case "LOCATION_NEW":
//                // 위치 기반 새 공고 알림 발송
//                notificationSender.send(userId, "새로운 관심 지역 공고가 등록됐어요! [" + tagId + "]");
//                break;
//            case "TYPE_NEW":
//                // 유형 기반 새 공고 알림 발송
//                notificationSender.send(userId, "관심 유형의 공고가 올라왔어요! [" + tagId + "]");
//                break;
//            default:
//                log.warn("처리되지 않은 action: {}", action);
//
//        }
    }

}
