package com.GGH.housing_service.service;

import com.GGH.housing_service.dto.NoticeDetailDTO;
import com.GGH.housing_service.dto.NoticeSummaryDTO;
import com.GGH.housing_service.entity.Notice;
import com.GGH.housing_service.repository.NoticeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NoticeService {

  private final NoticeRepository noticeRepository;

  public NoticeService(NoticeRepository noticeRepository) {
    this.noticeRepository = noticeRepository;
  }

  // 전체 목록 조회 (details 제외)
  public List<NoticeSummaryDTO> getAllNotices() {
    return noticeRepository.findAll().stream()
        .map(notice -> NoticeSummaryDTO.builder()
            .id(notice.getId())
            .title(notice.getTitle())
            .agency(notice.getAgency())
            .location(notice.getLocation())
            .type(notice.getType())
            .supplyArea(notice.getSupplyArea())
            .startDate(notice.getStartDate())
            .endDate(notice.getEndDate())
            .build())
        .collect(Collectors.toList());
  }

  // 상세 조회 (details 포함)
  public Optional<NoticeDetailDTO> getNoticeById(Long id) {
    return noticeRepository.findById(id)
        .map(notice -> NoticeDetailDTO.builder()
            .id(notice.getId())
            .title(notice.getTitle())
            .agency(notice.getAgency())
            .location(notice.getLocation())
            .type(notice.getType())
            .supplyArea(notice.getSupplyArea())
            .startDate(notice.getStartDate())
            .endDate(notice.getEndDate())
            .details(notice.getDetails())
            .build());
  }

  // 제목 검색 (details 제외)
  public List<NoticeSummaryDTO> searchNotices(String keyword) {
    return noticeRepository.findByTitleContaining(keyword).stream()
        .map(notice -> NoticeSummaryDTO.builder()
            .id(notice.getId())
            .title(notice.getTitle())
            .agency(notice.getAgency())
            .location(notice.getLocation())
            .type(notice.getType())
            .supplyArea(notice.getSupplyArea())
            .startDate(notice.getStartDate())
            .endDate(notice.getEndDate())
            .build())
        .collect(Collectors.toList());
  }
}
