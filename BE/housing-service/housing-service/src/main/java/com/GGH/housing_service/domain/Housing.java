package com.GGH.housing_service.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Housing {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;
  private String region;
  private String type; // 임대, 분양 등
  private String description;

  private LocalDate startDate;
  private LocalDate endDate;
}