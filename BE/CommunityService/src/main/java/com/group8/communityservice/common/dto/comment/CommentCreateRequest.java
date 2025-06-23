package com.group8.communityservice.common.dto.comment;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CommentCreateRequest {
    @NotBlank(message = "댓글 내용은 필수 입력 항목입니다.")
    private String content;

    // 실제 사용자 인증 로직이 구현되면 memberId는 SecurityContext 등에서 가져오도록 변경 예ㅒ정
    // 현재는 테스트를 위해 임시로 포함
    private Long memberId;
}
