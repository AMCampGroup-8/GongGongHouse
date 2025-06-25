package com.GGH.housing_service.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NoticeSummaryDTO {
  private Long id;
  private String title;
  private String agency;
  private String location;
  private String type;
  private Integer supplyArea;
  private String startDate;
  private String endDate;
}
