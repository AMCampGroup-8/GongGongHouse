/*
//필요시 활성화 - 새로운 글이 작성 됐을 때 알림 받을 수 있는 코드

package com.group8.communityservice.service;

import com.group8.communityservice.common.dto.board.BoardCreatedEventKafka;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NotificationKafkaConsumer {

    private static final String TOPIC_BOARD_CREATED = "board-created-events";
    private static final String GROUP_ID = "notification-service-group";

    @KafkaListener(topics = TOPIC_BOARD_CREATED, groupId = GROUP_ID)
    public void listenBoardCreatedEvent(BoardCreatedEventKafka event) {
        log.info("Kafka 이벤트 수신: 새 게시글 생성 - {}", event);

        System.out.println("새로운 게시글이 작성되었습니다!");
        System.out.println("게시글 ID: " + event.getBoardId());
        System.out.println("제목: " + event.getTitle());
        System.out.println("작성자 닉네임: " + event.getAuthorNickname());
        System.out.println("작성자 ID: " + event.getAuthorMemberId());
    }
}
*/
