package com.GGH.housing_service.service;

import com.GGH.housing_service.dto.HousingDto;
import com.GGH.housing_service.entity.Housing;
import com.GGH.housing_service.repository.HousingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HousingService {

  private final HousingRepository housingRepository;

  public HousingService(HousingRepository housingRepository) {
    this.housingRepository = housingRepository;
  }

  public List<HousingDto> getAllHousingList() {
    return housingRepository.findAll().stream()
        .map(this::toDto)
        .collect(Collectors.toList());
  }

  public HousingDto getHousingById(Long id) {
    return housingRepository.findById(id)
        .map(this::toDto)
        .orElse(null);
  }

  public List<HousingDto> searchHousingByQuery(String query) {
    return housingRepository.findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(query, query)
        .stream()
        .map(h -> {
          HousingDto dto = new HousingDto();
          dto.setId(h.getId());
          dto.setTitle(h.getTitle());
          return dto;
        }).collect(Collectors.toList());
  }

  private HousingDto toDto(Housing h) {
    HousingDto dto = new HousingDto();
    dto.setId(h.getId());
    dto.setTitle(h.getTitle());
    dto.setAgency(h.getAgency());
    dto.setLocation(h.getLocation());
    dto.setType(h.getType());
    dto.setSupplyArea(h.getSupplyArea());
    dto.setStartDate(h.getStartDate());
    dto.setEndDate(h.getEndDate());
    dto.setDetails(h.getDetails());
    return dto;
  }
}