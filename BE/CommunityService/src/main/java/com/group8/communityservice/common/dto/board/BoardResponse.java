package com.group8.communityservice.common.dto.board;

import com.group8.communityservice.entity.Board;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class BoardResponse {
    private Long id;
    private String title;
    private String content;
    private String authorNickname; // 작성자 닉네임
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BoardResponse(Board board) {
        this.id = board.getId();
        this.title = board.getTitle();
        this.content = board.getContent();
        this.authorNickname = board.getMember().getNickname(); // Member 엔티티에서 닉네임 가져오기
        this.createdAt = board.getCreatedAt();
        this.updatedAt = board.getUpdatedAt();
    }
}
