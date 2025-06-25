package com.group8.subscription_service.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class HousingDetailResponseDto {
    private Long id;
    private String title;
    private String agency;
    private String location;
    private String type;
    private Integer supplyArea;
    private LocalDate startDate;
    private LocalDate endDate;
    private String details;
}
