package com.GGH.housing_service.controller;

import com.GGH.housing_service.domain.Housing;
import com.GGH.housing_service.service.HousingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/houses")
@RequiredArgsConstructor
public class HousingController {

  private final HousingService housingService;

  @GetMapping
  public List<Housing> getAll() {
    return housingService.getAllHousings();
  }

  @GetMapping("/{id}")
  public Housing getById(@PathVariable Long id) {
    return housingService.getHousingById(id).orElseThrow();
  }

  @GetMapping("/search")
  public List<Housing> search(
      @RequestParam(required = false) String region,
      @RequestParam(required = false) String type
  ) {
    if (region != null) return housingService.searchByRegion(region);
    if (type != null) return housingService.searchByType(type);
    return housingService.getAllHousings();
  }

  @PostMapping
  public Housing create(@RequestBody Housing housing) {
    return housingService.saveHousing(housing);
  }
}