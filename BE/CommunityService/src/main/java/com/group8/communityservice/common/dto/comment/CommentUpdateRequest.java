package com.group8.communityservice.common.dto.comment;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CommentUpdateRequest {
    @NotBlank(message = "댓글 내용은 필수 입력 항목입니다.")
    private String content;
}
