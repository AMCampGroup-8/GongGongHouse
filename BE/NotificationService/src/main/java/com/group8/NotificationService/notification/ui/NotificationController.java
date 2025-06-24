package com.group8.NotificationService.notification.ui;

import com.group8.NotificationService.global.dto.ApiResponseDto;
import com.group8.NotificationService.notification.domain.Notification;
import com.group8.NotificationService.notification.domain.enums.NotificationType;
import com.group8.NotificationService.notification.infrastructure.repository.NotificationRepository;
import com.group8.NotificationService.notification.ui.dto.NotificationResponseDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping(value = "/notifications", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationRepository notificationRepository;

    // 전체 알림 조회
    @GetMapping
    public ApiResponseDto<List<NotificationResponseDto>> notiList(@RequestHeader("X-Auth-UserId") String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        log.info("알림 개수: {}", notifications.size());

        for (Notification notification : notifications) {
            log.info("알림 ID: {}, title: {}, message: {}, type: {}, isRead: {}, createdAt: {}",
                    notification.getId(),
                    notification.getTitle(),
                    notification.getMessage(),
                    notification.getNotificationType(),  // 요게 null이면 문제!
                    notification.isRead(),
                    notification.getCreatedAt()
            );
        }

        List<NotificationResponseDto> response = notifications.stream()
                .map(NotificationResponseDto::from)
                .collect(Collectors.toList());
        return ApiResponseDto.createOk(response);
    }

    // 새로운 관심 지역 공고 알림 모아보기
    @GetMapping(value = "/newLoc")
    public ApiResponseDto<List<NotificationResponseDto>> newLocNoti(@RequestHeader("X-Auth-UserId") String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndNotificationTypeOrderByCreatedAtDesc(userId,NotificationType.NEW);
        List<NotificationResponseDto> response = notifications.stream()
                .map(NotificationResponseDto::from)
                .collect(Collectors.toList());
        return ApiResponseDto.createOk(response);
    }

    // 새로운 관심 유형 공고 알림 모아보기
    @GetMapping(value = "/newType")
    public ApiResponseDto<List<NotificationResponseDto>> newTypeNoti(@RequestHeader("X-Auth-UserId") String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndNotificationTypeOrderByCreatedAtDesc(userId,NotificationType.TYPE);
        List<NotificationResponseDto> response = notifications.stream()
                .map(NotificationResponseDto::from)
                .collect(Collectors.toList());
        return ApiResponseDto.createOk(response);
    }


    // 수정된 공고 알림 모아보기
    @GetMapping(value = "/update")
    public ApiResponseDto<List<NotificationResponseDto>> updateNoti(@RequestHeader("X-Auth-UserId") String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndNotificationTypeOrderByCreatedAtDesc(userId,NotificationType.UPDATE);
        List<NotificationResponseDto> response = notifications.stream()
                .map(NotificationResponseDto::from)
                .collect(Collectors.toList());
        return ApiResponseDto.createOk(response);
    }

    // 마감 임박 공고 알림 모아보기
    @GetMapping(value = "/deadline")
    public ApiResponseDto<List<NotificationResponseDto>> deadlineNoti(@RequestHeader("X-Auth-UserId") String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndNotificationTypeOrderByCreatedAtDesc(userId,NotificationType.DEADLINE);
        List<NotificationResponseDto> response = notifications.stream()
                .map(NotificationResponseDto::from)
                .collect(Collectors.toList());
        return ApiResponseDto.createOk(response);
    }

    // 새 댓글 알림 모아보기
    @GetMapping(value = "/comment")
    public ApiResponseDto<List<NotificationResponseDto>> commentNoti(@RequestHeader("X-Auth-UserId") String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndNotificationTypeOrderByCreatedAtDesc(userId,NotificationType.COMMENT);
        List<NotificationResponseDto> response = notifications.stream()
                .map(NotificationResponseDto::from)
                .collect(Collectors.toList());
        return ApiResponseDto.createOk(response);
    }

    // 특정 알림 상세 보기
    @GetMapping(value = "/detail")
    public ApiResponseDto<NotificationResponseDto> getNoti(@RequestHeader("X-Auth-UserId") String userId, @RequestParam Long notiId) {
        Optional<Notification> notification = notificationRepository.findByUserIdAndId(userId, notiId);
        return notification
                .map(NotificationResponseDto::from)
                .map(ApiResponseDto::createOk)
                .orElse(ApiResponseDto.createError("NOT_FOUND", "알림이 없습니다.", null));
    }

    // 알림 읽음 처리 하기
    @Transactional
    @PatchMapping(value = "/{id}/read")
    public ApiResponseDto<String> markAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(notification -> {
            notification.markAsReadOrUnread();
            notificationRepository.save(notification);
        });
        return ApiResponseDto.defaultOk();
    }


}
