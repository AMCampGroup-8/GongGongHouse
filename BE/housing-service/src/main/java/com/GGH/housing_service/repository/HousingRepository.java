package com.GGH.housing_service.repository;

import com.GGH.housing_service.entity.Housing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HousingRepository extends JpaRepository<Housing, Long> {

  // 검색용
  List<Housing> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String title, String location);
}
