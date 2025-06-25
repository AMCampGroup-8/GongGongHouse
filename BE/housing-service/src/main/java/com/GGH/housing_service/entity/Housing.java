package com.GGH.housing_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "housing")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Housing {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;
  private String agency;
  private String location;
  private String type;
  private int supplyArea;
  private String startDate;
  private String endDate;

  @Column(length = 1000)
  private String details;
}