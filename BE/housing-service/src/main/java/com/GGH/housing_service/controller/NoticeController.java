package com.GGH.housing_service.controller;

import com.GGH.housing_service.entity.Notice;
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

  // 1. 전체 목록 조회
  @GetMapping
  public ResponseEntity<List<Notice>> getAllNotices() {
    List<Notice> notices = noticeService.getAllNotices();
    return ResponseEntity.ok(notices);
  }

  // 2. 상세 조회
  @GetMapping("/{id}")
  public ResponseEntity<Notice> getNoticeById(@PathVariable Long id) {
    return noticeService.getNoticeById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  // 3. 제목 검색
  @GetMapping("/search")
  public ResponseEntity<List<Notice>> searchNotices(@RequestParam("query") String query) {
    List<Notice> results = noticeService.searchNotices(query);
    return ResponseEntity.ok(results);
  }
}
