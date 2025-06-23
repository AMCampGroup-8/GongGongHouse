package com.GGH.housing_service.controller;

import com.GGH.housing_service.dto.LHNoticeItem;
import com.GGH.housing_service.service.LHService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lh")
public class LHController {

  private final LHService lhService;

  @GetMapping("/notices")
  public List<LHNoticeItem> getNotices(@RequestParam String start, @RequestParam String end) {
    return lhService.fetchNotices(LocalDate.parse(start), LocalDate.parse(end));
  }
}
