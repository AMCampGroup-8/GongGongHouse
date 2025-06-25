package com.group8.subscription_service.service;

import com.group8.subscription_service.client.HousingClient;
import com.group8.subscription_service.domain.Interest;
import com.group8.subscription_service.dto.HousingDetailResponseDto;
import com.group8.subscription_service.dto.InterestCreateRequestDto;
import com.group8.subscription_service.dto.InterestDto;
import com.group8.subscription_service.repository.InterestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterestService {

    private final InterestRepository interestRepository;
    private final HousingClient housingClient;

    public List<InterestDto> getInterestList(Long memberId) {
        return interestRepository.findByMemberId(memberId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public InterestDto getInterestDetail(Long memberId, Long interestId) {
        Interest interest = interestRepository.findById(interestId)
                //.filter(i -> i.getMemberId().equals(memberId)) // ⛔ 주석처리해보세요!
                .orElseThrow(() -> new RuntimeException("해당 관심 공고 없음"));
        return toDto(interest);
    }


    public InterestDto createInterest(Long memberId, InterestCreateRequestDto request) {
        HousingDetailResponseDto housingDetail = housingClient.getHousingDetail(request.getAnnouncementId());

        Interest interest = Interest.builder()
                .memberId(memberId)
                .announcementId(request.getAnnouncementId())
                .alarmBeforeDays(request.getAlarmBeforeDays())
                .region(housingDetail.getLocation())
                .status(determineStatus(housingDetail.getStartDate(), housingDetail.getEndDate()))
                .build();

        return toDto(interestRepository.save(interest));
    }

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
                .region(interest.getRegion() != null ? interest.getRegion() : "-")
                .status(interest.getStatus() != null ? interest.getStatus() : "모집중")
                .title("임시 제목 " + interest.getAnnouncementId()) // 타이틀 임시처리
                .build();
    }

//    private InterestDto toDto(Interest interest) {
//        return InterestDto.builder()
//                .id(interest.getId())
//                .announcementId(interest.getAnnouncementId())
//                .title("더미 공고 제목 " + interest.getAnnouncementId()) // 👈 여기에 더미 title
//                //.title(housing.getTitle()) // 🎯 진짜 title
//                .alarmBeforeDays(interest.getAlarmBeforeDays())
//                .region(interest.getRegion())
//                .status(interest.getStatus())
//                .build();
//    }

    private String determineStatus(LocalDate startDate, LocalDate endDate) {
        LocalDate now = LocalDate.now();
        if (now.isBefore(startDate)) return "예정";
        else if (now.isAfter(endDate)) return "마감";
        else return "모집중";
    }
}
