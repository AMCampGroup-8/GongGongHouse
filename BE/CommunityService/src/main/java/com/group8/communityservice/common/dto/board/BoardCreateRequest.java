package com.group8.communityservice.common.dto.board;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BoardCreateRequest {
    @NotBlank(message = "제목은 필수 입력 항목입니다.")
    @Size(max = 100, message = "제목은 100자를 초과할 수 없습니다.")
    private String title;

    @NotBlank(message = "내용은 필수 입력 항목입니다.")
    private String content;

    // 실제 사용자 인증 로직이 구현되면 memberId는 SecurityContext 등에서 가져오도록 변경할거임
    // 현재는 테스트를 위해 임시로 포함
    private Long memberId;
}
