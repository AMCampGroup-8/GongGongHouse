package com.GGH.housing_service.service;

import com.GGH.housing_service.entity.Notice;
import com.GGH.housing_service.repository.NoticeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {

  private final NoticeRepository noticeRepository;

  public NoticeService(NoticeRepository noticeRepository) {
    this.noticeRepository = noticeRepository;
  }

  // 1. 전체 목록 조회
  public List<Notice> getAllNotices() {
    return noticeRepository.findAll();
  }

  // 2. 상세 조회
  public Optional<Notice> getNoticeById(Long id) {
    return noticeRepository.findById(id);
  }

  // 3. 제목으로 검색
  public List<Notice> searchNotices(String keyword) {
    return noticeRepository.findByTitleContaining(keyword);
  }
}
