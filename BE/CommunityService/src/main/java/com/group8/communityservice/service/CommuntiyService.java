// src/main/java/com/group8/communityservice/service/CommuntiyService.java
package com.group8.communityservice.service;


import com.group8.communityservice.common.dto.board.BoardCreateRequest;
import com.group8.communityservice.common.dto.board.BoardCreatedEventKafka;
import com.group8.communityservice.common.dto.board.BoardResponse;
import com.group8.communityservice.common.dto.board.BoardUpdateRequest;
import com.group8.communityservice.common.dto.comment.CommentCreateRequest;
import com.group8.communityservice.common.dto.comment.CommentResponse;
import com.group8.communityservice.common.dto.comment.CommentUpdateRequest;
import com.group8.communityservice.common.exception.NotFound;
import com.group8.communityservice.entity.Board;
import com.group8.communityservice.entity.Comment;
import com.group8.communityservice.entity.Member;
import com.group8.communityservice.repository.BoardRepository;
import com.group8.communityservice.repository.CommentRepository;
import com.group8.communityservice.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 읽기 전용 트랜잭션 기본 설정
public class CommuntiyService {

    private final BoardRepository boardRepository;
    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
    private final KafkaProducerService kafkaProducerService;

    //게시글 작성
    @Transactional
    public BoardResponse createBoard(BoardCreateRequest request) {
        //실제 사용자 인증 로직이 구현되면 memberId는 SecurityContext 등에서 가져오도록 변경하기
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new NotFound("해당 사용자를 찾을 수 없습니다."));

        Board board = Board.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .member(member)
                .build();
        Board savedBoard = boardRepository.save(board);

        BoardCreatedEventKafka event = new BoardCreatedEventKafka(
                savedBoard.getId(),
                savedBoard.getTitle(),
                savedBoard.getContent(),
                savedBoard.getMember().getId(),
                savedBoard.getMember().getNickname(),
                savedBoard.getCreatedAt()
        );
        kafkaProducerService.sendBoardCreatedEvent(event);

        return new BoardResponse(savedBoard);
    }

    //게시글 상세 조회
    public BoardResponse getBoard(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new NotFound("해당 게시글을 찾을 수 없습니다."));
        return new BoardResponse(board);
    }

    //게시글 목록 조회
    public Page<BoardResponse> getBoardList(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return boardRepository.findAll(pageable)
                .map(BoardResponse::new);
    }

    //게시글 검색
    public Page<BoardResponse> searchBoards(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        // 지금은 임시로 모든 게시글에서 필터링하는 방식으로 구현했는데 시간이 남으면 Repository에서 검색 쿼리 작성하기
        return boardRepository.findByTitleContainingOrContentContaining(query, query, pageable)
                .map(BoardResponse::new);
    }

    //게시글 수정
    @Transactional
    public BoardResponse updateBoard(Long boardId, BoardUpdateRequest request) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new NotFound("해당 게시글을 찾을 수 없습니다."));

        //나중에 memberid가 추가 되면 게시글 작성자만 수정할 수 있게 수정 예정
        board.update(request.getTitle(), request.getContent());
        return new BoardResponse(board);
    }

    //게시글 삭제
    @Transactional
    public void deleteBoard(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new NotFound("해당 게시글을 찾을 수 없습니다."));

        //얘도 나중에 적은 사람만 삭제할 수 있게 수정
        boardRepository.delete(board);
    }

    //댓글 작성
    @Transactional
    public CommentResponse createComment(Long boardId, CommentCreateRequest request) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new NotFound("해당 게시글을 찾을 수 없습니다."));
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new NotFound("해당 사용자를 찾을 수 없습니다."));

        Comment comment = Comment.builder()
                .board(board)
                .member(member)
                .content(request.getContent())
                .build();
        Comment savedComment = commentRepository.save(comment);
        return new CommentResponse(savedComment);
    }

    //댓글 수정
    @Transactional
    public CommentResponse updateComment(Long commentId, CommentUpdateRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NotFound("해당 댓글을 찾을 수 없습니다."));

        // 얘도 댓글 작성자만 수정할 수 있게 수정
        comment.update(request.getContent());
        return new CommentResponse(comment);
    }

    //댓글 삭제
    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NotFound("해당 댓글을 찾을 수 없습니다."));

        // 댓글 작성자만 삭제하도록 수정 예정
        commentRepository.delete(comment);
    }

    //특정 게시글 내 댓글 목록 조회하기
    public List<CommentResponse> getCommentsByBoardId(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new NotFound("해당 게시글을 찾을 수 없습니다."));
        return commentRepository.findByBoard(board).stream()
                .map(CommentResponse::new)
                .collect(Collectors.toList());
    }
}
