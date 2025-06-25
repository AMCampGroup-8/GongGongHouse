package com.GGH.housing_service.controller;

import com.GGH.housing_service.dto.NoticeDetailDTO;
import com.GGH.housing_service.dto.NoticeSummaryDTO;
import com.GGH.housing_service.service.NoticeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/housing")
public class NoticeController {

  private final NoticeService noticeService;

  public NoticeController(NoticeService noticeService) {
    this.noticeService = noticeService;
  }

  // 1. 전체 목록 조회 (details 제외)
  @GetMapping
  public ResponseEntity<List<NoticeSummaryDTO>> getAllNotices() {
    List<NoticeSummaryDTO> notices = noticeService.getAllNotices();
    return ResponseEntity.ok(notices);
  }

  // 2. 상세 조회 (details 포함)
  @GetMapping("/{id}")
  public ResponseEntity<NoticeDetailDTO> getNoticeById(@PathVariable Long id) {
    return noticeService.getNoticeById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  // 3. 제목 검색 (details 제외)
  @GetMapping("/search")
  public ResponseEntity<List<NoticeSummaryDTO>> searchNotices(@RequestParam("query") String query) {
    List<NoticeSummaryDTO> results = noticeService.searchNotices(query);
    return ResponseEntity.ok(results);
  }
}
