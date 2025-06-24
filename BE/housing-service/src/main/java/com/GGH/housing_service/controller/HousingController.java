package com.GGH.housing_service.controller;

import com.GGH.housing_service.dto.HousingDto;
import com.GGH.housing_service.service.HousingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/housing")
public class HousingController {

  private final HousingService housingService;

  @Autowired
  public HousingController(HousingService housingService) {
    this.housingService = housingService;
  }

  @GetMapping
  public List<HousingDto> getAllHousing() {
    return housingService.getAllHousingList();
  }

  @GetMapping("/{id}")
  public HousingDto getHousingById(@PathVariable("id") Long id) {
    return housingService.getHousingById(id);
  }

  @GetMapping("/search")
  public List<HousingDto> searchHousing(@RequestParam("query") String query) {
    return housingService.searchHousingByQuery(query);
  }
}
