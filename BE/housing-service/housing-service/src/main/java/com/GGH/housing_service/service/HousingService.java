package com.GGH.housing_service.service;

import com.GGH.housing_service.domain.Housing;
import com.GGH.housing_service.repository.HousingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HousingService {

  private final HousingRepository housingRepository;

  public List<Housing> getAllHousings() {
    return housingRepository.findAll();
  }

  public Optional<Housing> getHousingById(Long id) {
    return housingRepository.findById(id);
  }

  public List<Housing> searchByRegion(String region) {
    return housingRepository.findByRegion(region);
  }

  public List<Housing> searchByType(String type) {
    return housingRepository.findByType(type);
  }

  public Housing saveHousing(Housing housing) {
    return housingRepository.save(housing);
  }
}