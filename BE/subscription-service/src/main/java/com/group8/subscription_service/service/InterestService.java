package com.group8.subscription_service.service;

import com.group8.subscription_service.domain.Interest;
import com.group8.subscription_service.dto.InterestCreateRequestDto;
import com.group8.subscription_service.dto.InterestDto;
import com.group8.subscription_service.repository.InterestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterestService {

    private final InterestRepository interestRepository;
    //private final HousingClient housingClient; 이것도 연동할때 활성화

    public List<InterestDto> getInterestList(Long memberId) {
        return interestRepository.findByMemberId(memberId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public InterestDto getInterestDetail(Long memberId, Long interestId) {
        Interest interest = interestRepository.findById(interestId)
                .filter(i -> i.getMemberId().equals(memberId))
                .orElseThrow(() -> new RuntimeException("조회 권한 없음"));
        return toDto(interest);
    }

    public InterestDto createInterest(Long memberId, InterestCreateRequestDto request) {
        Interest interest = Interest.builder()
                .memberId(memberId)
                .announcementId(request.getAnnouncementId())
                .alarmBeforeDays(request.getAlarmBeforeDays())
                .region("서울")  // 추후 외부 공고 서비스와 연동
                .status("모집중")
                .build();
        return toDto(interestRepository.save(interest));
    }
// 지역이랑 상태 받아오는 코드 -> 연동할때 활성화
//    public InterestDto createInterest(Long memberId, InterestCreateRequestDto request) {
//        HousingDetailResponseDto housingDetail = housingClient.getHousingDetail(request.getAnnouncementId());
//
//        Interest interest = Interest.builder()
//                .memberId(memberId)
//                .announcementId(request.getAnnouncementId())
//                .alarmBeforeDays(request.getAlarmBeforeDays())
//                .region(housingDetail.getLocation())
//                .status(determineStatus(housingDetail.getStartDate(), housingDetail.getEndDate()))
//                .build();
//
//        return toDto(interestRepository.save(interest));
//    }
//
//    // 👉 여기에다가!!
//    private String determineStatus(LocalDate startDate, LocalDate endDate) {
//        LocalDate now = LocalDate.now();
//        if (now.isBefore(startDate)) return "예정";
//        else if (now.isAfter(endDate)) return "마감";
//        else return "모집중";
//    }

    public void deleteInterest(Long memberId, Long interestId) {
        Interest interest = interestRepository.findById(interestId)
                .filter(i -> i.getMemberId().equals(memberId))
                .orElseThrow(() -> new RuntimeException("삭제 권한 없음"));
        interestRepository.delete(interest);
    }

    private InterestDto toDto(Interest interest) {
        return InterestDto.builder()
                .id(interest.getId())
                .announcementId(interest.getAnnouncementId())
                .alarmBeforeDays(interest.getAlarmBeforeDays())
                .region(interest.getRegion())
                .status(interest.getStatus())
                .build();
    }
}

