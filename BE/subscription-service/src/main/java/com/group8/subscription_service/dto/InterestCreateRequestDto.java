package com.group8.subscription_service.dto;

import lombok.Getter;

@Getter
public class InterestCreateRequestDto {
    private Long announcementId;
    private int alarmBeforeDays;
}
