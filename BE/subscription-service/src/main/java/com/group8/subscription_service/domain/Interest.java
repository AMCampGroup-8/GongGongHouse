package com.group8.subscription_service.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@Builder @NoArgsConstructor @AllArgsConstructor
public class Interest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long memberId;

    private Long announcementId;

    private String region;

    private int alarmBeforeDays;

    private String status;
}
