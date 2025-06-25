package com.group8.subscription_service.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InterestDto {
    private Long id;
    private Long announcementId;
    private String title; // 👈 housing 연동 시 삭제
    private String region;
    private int alarmBeforeDays;
    private String status;
}
