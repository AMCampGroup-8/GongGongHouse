package com.group8.subscription_service.controller;


import com.group8.subscription_service.dto.InterestCreateRequestDto;
import com.group8.subscription_service.dto.InterestDto;
import com.group8.subscription_service.service.InterestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/interests")
@RequiredArgsConstructor
public class InterestController {

    private final InterestService interestService;

    // 🔥 JWT 파싱 전까지는 memberId 하드코딩
    private Long getMemberIdFromToken(String token) {
        return 1L;
    }

    @GetMapping
    public List<InterestDto> getInterestList(@RequestHeader("Authorization") String token) {
        return interestService.getInterestList(getMemberIdFromToken(token));
    }

    @GetMapping("/{id}")
    public InterestDto getInterestDetail(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        return interestService.getInterestDetail(getMemberIdFromToken(token), id);
    }

    @PostMapping
    public InterestDto createInterest(@RequestBody InterestCreateRequestDto request, @RequestHeader("Authorization") String token) {
        return interestService.createInterest(getMemberIdFromToken(token), request);
    }

    @DeleteMapping("/{id}")
    public String deleteInterest(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        interestService.deleteInterest(getMemberIdFromToken(token), id);
        return "{\"message\": \"삭제 완료\"}";
    }
}
