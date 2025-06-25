//package com.GGH.housing_service.mock;
//
//import com.GGH.housing_service.dto.LhNoticeResponseDto;
//
//import java.util.ArrayList;
//import java.util.List;
//
//public class MockLhNoticeData {
//
//  public static List<LhNoticeResponseDto> getMockNotices() {
//    List<LhNoticeResponseDto> list = new ArrayList<>();
//
//    LhNoticeResponseDto notice1 = new LhNoticeResponseDto();
//    notice1.setBBS_SN("100001");
//    notice1.setBBS_TL("2025년 행복주택 청약 공고");
//    notice1.setAIS_TP_CD_NM("행복주택");
//    notice1.setCREAT_DT("2025-06-01");
//
//    LhNoticeResponseDto notice2 = new LhNoticeResponseDto();
//    notice2.setBBS_SN("100002");
//    notice2.setBBS_TL("2025년 매입임대 공고");
//    notice2.setAIS_TP_CD_NM("매입임대");
//    notice2.setCREAT_DT("2025-06-10");
//
//    list.add(notice1);
//    list.add(notice2);
//
//    return list;
//  }
//}