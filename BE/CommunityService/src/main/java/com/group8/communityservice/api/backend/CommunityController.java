// src/main/java/com/group8/communityservice/api/backend/CommunityController.java
package com.group8.communityservice.api.backend;

import com.group8.communityservice.common.dto.board.BoardCreateRequest;
import com.group8.communityservice.common.dto.board.BoardListResponse;
import com.group8.communityservice.common.dto.board.BoardResponse;
import com.group8.communityservice.common.dto.board.BoardUpdateRequest;
import com.group8.communityservice.common.dto.comment.CommentCreateRequest;
import com.group8.communityservice.common.dto.comment.CommentResponse;
import com.group8.communityservice.common.dto.comment.CommentUpdateRequest;
import com.group8.communityservice.common.dto.ApiResponseDto;
import com.group8.communityservice.service.CommuntiyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(value = "/boards", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class CommunityController {

    private final CommuntiyService communityService;

    //자세한 api는 api 명세서 참조
    //확인은 postman 활용

    //게시글 작성 - post /boards
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponseDto<BoardResponse> createBoard(@Valid @RequestBody BoardCreateRequest request) {
        log.info("게시글 작성 요청: {}", request.getTitle());
        BoardResponse response = communityService.createBoard(request);
        return ApiResponseDto.createOk(response);
    }

    //게시글 상세 조회 - GET /boards/{boardsNumber}
    @GetMapping("/{boardsNumber}")
    public ApiResponseDto<BoardResponse> getBoard(@PathVariable("boardsNumber") Long boardId) {
        log.info("게시글 상세 조회 요청: boardId={}", boardId);
        BoardResponse response = communityService.getBoard(boardId);
        return ApiResponseDto.createOk(response);
    }

    //게시글 전체 목록 조회 - GET /boards
    @GetMapping
    public ApiResponseDto<BoardListResponse> getBoardList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("게시글 목록 조회 요청: page={}, size={}", page, size);
        Page<BoardResponse> boardPage = communityService.getBoardList(page, size);
        return ApiResponseDto.createOk(new BoardListResponse(boardPage));
    }

    //게시글 검색 - GET /boards/search?query=검색어
    @GetMapping("/search")
    public ApiResponseDto<BoardListResponse> searchBoards(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("게시글 검색 요청: query={}, page={}, size={}", query, page, size);
        Page<BoardResponse> boardPage = communityService.searchBoards(query, page, size);
        return ApiResponseDto.createOk(new BoardListResponse(boardPage));
    }

    //게시글 수정 - PUT /boards/{boardsNumber}
    @PutMapping("/{boardsNumber}")
    public ApiResponseDto<BoardResponse> updateBoard(
            @PathVariable("boardsNumber") Long boardId,
            @Valid @RequestBody BoardUpdateRequest request) {
        log.info("게시글 수정 요청: boardId={}, title={}", boardId, request.getTitle());
        BoardResponse response = communityService.updateBoard(boardId, request);
        return ApiResponseDto.createOk(response);
    }

    //게시글 삭제 - DELETE /boards/{boardsNumber}
    @DeleteMapping("/{boardsNumber}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content
    public ApiResponseDto<String> deleteBoard(@PathVariable("boardsNumber") Long boardId) {
        log.info("게시글 삭제 요청: boardId={}", boardId);
        communityService.deleteBoard(boardId);
        return ApiResponseDto.defaultOk(); // 성공 시 메시지 없이 OK 응답
    }

    //댓글 작성 - POST /boards/{boardsNumber}/comment
    @PostMapping("/{boardsNumber}/comment")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponseDto<CommentResponse> createComment(
            @PathVariable("boardsNumber") Long boardId,
            @Valid @RequestBody CommentCreateRequest request) {
        log.info("댓글 작성 요청: boardId={}, content={}", boardId, request.getContent());
        CommentResponse response = communityService.createComment(boardId, request);
        return ApiResponseDto.createOk(response);
    }

    //댓글 수정 - PUT /boards/{boardsNumber}/comment/{commentNumber}
    @PutMapping("/{boardsNumber}/comment/{commentNumber}")
    public ApiResponseDto<CommentResponse> updateComment(
            @PathVariable("boardsNumber") Long boardId, // boardId는 URL 경로 일관성을 위해 유지, 실제 사용은 commentId
            @PathVariable("commentNumber") Long commentId,
            @Valid @RequestBody CommentUpdateRequest request) {
        log.info("댓글 수정 요청: commentId={}, content={}", commentId, request.getContent());
        CommentResponse response = communityService.updateComment(commentId, request);
        return ApiResponseDto.createOk(response);
    }

    //댓글 삭제 - DELETE /boards/{boardsNumber}/comment/{commentNumber}
    @DeleteMapping("/{boardsNumber}/comment/{commentNumber}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content
    public ApiResponseDto<String> deleteComment(
            @PathVariable("boardsNumber") Long boardId, // boardId는 URL 경로 일관성을 위해 유지, 실제 사용은 commentId
            @PathVariable("commentNumber") Long commentId) {
        log.info("댓글 삭제 요청: commentId={}", commentId);
        communityService.deleteComment(commentId);
        return ApiResponseDto.defaultOk(); // 성공 시 메시지 없이 OK 응답
    }

    //특정 게시물 댓글 목록 조회 - GET /boards/{boardsNumber}/comments
    //잘 작동 안될시에 삭제 예정
    @GetMapping("/{boardsNumber}/comments")
    public ApiResponseDto<List<CommentResponse>> getCommentsByBoardId(
            @PathVariable("boardsNumber") Long boardId) {
        log.info("게시글 댓글 목록 조회 요청: boardId={}", boardId);
        List<CommentResponse> comments = communityService.getCommentsByBoardId(boardId);
        return ApiResponseDto.createOk(comments);
    }
}
