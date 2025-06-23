package com.group8.communityservice.service;

import com.group8.communityservice.common.dto.board.BoardCreatedEventKafka;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private static final String TOPIC_BOARD_CREATED = "board-created-events"; // 토픽 이름

    private final KafkaTemplate<String, Object> kafkaTemplate;

    //게시글 생성 이벤트를 kafka로 전송
    //@param event 전송할 BoardCreatedEvent 객체
    public void sendBoardCreatedEvent(BoardCreatedEventKafka event) {
        log.info("Sending BoardCreatedEvent to Kafka topic {}: {}", TOPIC_BOARD_CREATED, event);
        kafkaTemplate.send(TOPIC_BOARD_CREATED, String.valueOf(event.getBoardId()), event)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("Sent message successfully: offset={}, partition={}",
                                result.getRecordMetadata().offset(),
                                result.getRecordMetadata().partition());
                    } else {
                        log.error("Failed to send message: {}", ex.getMessage());
                    }
                });
    }
}
