package com.group8.subscription_service.client;

import com.group8.subscription_service.dto.HousingDetailResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "housing-service", url = "http://localhost:8083") // 실제 URL 맞게 설정
public interface HousingClient {

    @GetMapping("/housing/{id}")
    HousingDetailResponseDto getHousingDetail(@PathVariable("id") Long id);
}
