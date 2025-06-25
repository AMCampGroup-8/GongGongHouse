package com.GGH.housing_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "housing")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notice {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private String agency;

  @Column(nullable = false)
  private String location;

  @Column(nullable = false)
  private String type;

  private Integer supplyArea;

  private String startDate;

  private String endDate;

  @Column(length = 1000)
  private String details;

}