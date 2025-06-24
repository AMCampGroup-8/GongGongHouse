package com.GGH.housing_service.dto;

import lombok.Data;

@Data
public class HousingDto {
  private Long id;
  private String title;
  private String agency;
  private String location;
  private String type;
  private int supplyArea;
  private String startDate;
  private String endDate;
  private String details; // 상세 조회 시만 포함
}
