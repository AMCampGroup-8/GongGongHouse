package com.GGH.housing_service.repository;

import com.GGH.housing_service.domain.Housing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HousingRepository extends JpaRepository<Housing, Long> {
  List<Housing> findByRegion(String region);
  List<Housing> findByType(String type);
}