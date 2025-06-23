package com.group8.communityservice.common.dto.board;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class BoardListResponse {
    private List<BoardResponse> boards;
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private int pageSize;

    public BoardListResponse(Page<BoardResponse> boardPage) {
        this.boards = boardPage.getContent();
        this.currentPage = boardPage.getNumber();
        this.totalPages = boardPage.getTotalPages();
        this.totalElements = boardPage.getTotalElements();
        this.pageSize = boardPage.getSize();
    }
}
