package com.group8.communityservice.repository;

import com.group8.communityservice.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    // 제목 또는 내용으로 검색
    Page<Board> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);
}
