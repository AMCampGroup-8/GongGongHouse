package com.GGH.housing_service.service;

import com.GGH.housing_service.dto.HousingDto;
import com.GGH.housing_service.mock.HousingMockData;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

  public List<HousingDto> searchHousingByQuery(String query) {
    return HousingMockData.getMockHousingList().stream()
        .filter(h ->
            h.getTitle().toLowerCase().contains(query.toLowerCase()) ||
                h.getLocation().toLowerCase().contains(query.toLowerCase())
        )
        .map(h -> {
          HousingDto dto = new HousingDto();
          dto.setId(h.getId());
          dto.setTitle(h.getTitle());
          return dto;
        })
        .collect(Collectors.toList());
  }
}
