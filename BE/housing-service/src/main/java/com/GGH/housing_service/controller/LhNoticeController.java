//package com.GGH.housing_service.controller;
//
//import com.GGH.housing_service.dto.LhNoticeResponseDto;
//import com.GGH.housing_service.service.LhNoticeService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/lh/notices")
//public class LhNoticeController {
//
//  private final LhNoticeService lhNoticeService;
//
//  @Autowired
//  public LhNoticeController(LhNoticeService lhNoticeService) {
//    this.lhNoticeService = lhNoticeService;
//  }
//
//  @GetMapping
//  public List<LhNoticeResponseDto> getNoticeList() {
//    return lhNoticeService.getNoticeList();
//  }
//}
