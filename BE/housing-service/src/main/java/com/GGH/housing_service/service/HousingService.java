package com.GGH.housing_service.service;

import com.GGH.housing_service.dto.HousingDto;
import com.GGH.housing_service.mock.HousingMockData;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HousingService {

  public List<HousingDto> getAllHousingList() {
    return HousingMockData.getMockHousingList();
  }

  public HousingDto getHousingById(Long id) {
    return HousingMockData.getMockHousingList().stream()
        .filter(h -> h.getId().equals(id))
        .findFirst()
        .orElse(null);
  }
}
