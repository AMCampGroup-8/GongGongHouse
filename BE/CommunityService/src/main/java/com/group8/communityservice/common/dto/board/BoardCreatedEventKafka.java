package com.group8.communityservice.common.dto.board;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BoardCreatedEventKafka {

    private Long boardId;
    private String title;
    private String content;
    private Long authorMemberId;
    private String authorNickname;
    private LocalDateTime createdAt;

}
