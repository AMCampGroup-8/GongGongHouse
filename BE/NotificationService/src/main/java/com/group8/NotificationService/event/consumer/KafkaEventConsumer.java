package com.group8.NotificationService.event.consumer;


import com.group8.NotificationService.event.consumer.message.bookmarked.BookmarkedEvent;
import com.group8.NotificationService.event.consumer.message.community.CommunityEvent;
import com.group8.NotificationService.event.consumer.message.likedtag.LikeTagEvent;
import com.group8.NotificationService.service.BookmarkedNotificationService;
import com.group8.NotificationService.service.CommunityNotificationService;
import com.group8.NotificationService.service.LikeTagNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaEventConsumer {
    private final LikeTagNotificationService likeTagNotificationService;
    private final BookmarkedNotificationService bookmarkedNotificationService;
    private final CommunityNotificationService communityNotificationService;


    @KafkaListener(topics = LikeTagEvent.Topic, properties = {JsonDeserializer.VALUE_DEFAULT_TYPE + "com.group8.NotificationService.event.consumer.message.likedtag.LikeTagEvent"})
    void handleLiketagEventMessage(LikeTagEvent event, Acknowledgment ack) {
        log.info("LiketagEvent 처리. userId={}",event.getUserId());

        //TODO: event가 트리거 됬을 시 트리거 되는 비즈니스 로직 만들기
        likeTagNotificationService.handle(event);

        ack.acknowledge();
    }

    @KafkaListener(topics = BookmarkedEvent.Topic, properties = {JsonDeserializer.VALUE_DEFAULT_TYPE + "com.group8.NotificationService.event.consumer.message.bookmarked.BookmarkedEvent"})
    void handleBookmarkedMessage(BookmarkedEvent event, Acknowledgment ack) {
        log.info("BookmarkedEvent 처리. userId={}",event.getUserId());

        //TODO: event가 트리거 됬을 시 트리거 되는 비즈니스 로직 만들기
        bookmarkedNotificationService.handle(event);

        ack.acknowledge();
    }

    @KafkaListener(topics = CommunityEvent.Topic, properties = {JsonDeserializer.VALUE_DEFAULT_TYPE + "com.group8.NotificationService.event.consumer.message.community.CommunityEvent"})
    void handleCommunityEventMessage(CommunityEvent event, Acknowledgment ack) {
        log.info("CommunityEvent 처리. userId={}",event.getUserId());

        //TODO: event가 트리거 됬을 시 트리거 되는 비즈니스 로직 만들기
        communityNotificationService.handle(event);

        ack.acknowledge();
    }
}
