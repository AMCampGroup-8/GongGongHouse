package com.group8.communityservice.common.dto.comment;

import com.group8.communityservice.entity.Comment;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class CommentResponse {
    private Long id;
    private String content;
    private String authorNickname; // 작성자 닉네임
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.authorNickname = comment.getMember().getNickname(); // Member 엔티티에서 닉네임 가져오기
        this.createdAt = comment.getCreatedAt();
        this.updatedAt = comment.getUpdatedAt();
    }
}
