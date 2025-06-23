package com.group8.communityservice.service;

import com.group8.NotificationService.event.consumer.message.community.CommunityEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendCommunityEvent(CommunityEvent event) {
        log.info("Kafka 토픽에 CommunityEvent 보내기 {}: {}", CommunityEvent.Topic, event);
        kafkaTemplate.send(CommunityEvent.Topic, event.getPostId(), event)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("메세지 보내기 성공: offset={}, partition={}",
                                result.getRecordMetadata().offset(),
                                result.getRecordMetadata().partition());
                    } else {
                        log.error("메세지 보내기 실패: {}", ex.getMessage());
                    }
                });
    }
}
