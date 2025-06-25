package com.GGH.housing_service.repository;

import com.GGH.housing_service.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {

  // 제목으로 검색
  List<Notice> findByTitleContaining(String keyword);
}
