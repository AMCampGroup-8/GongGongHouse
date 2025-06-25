package com.group8.NotificationService.notification.infrastructure.fcm;

import com.group8.NotificationService.global.dto.ApiResponseDto;
import com.group8.NotificationService.notification.infrastructure.fcm.dto.FcmTokenRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/fcm-token", produces = MediaType.APPLICATION_JSON_VALUE)
@Slf4j
@RequiredArgsConstructor
public class FcmTokenController {
   private final FcmTokenService fcmTokenService;

   @PostMapping
   public ApiResponseDto<String> registerOrUpdateToken (
           @RequestBody FcmTokenRequestDto dto,
           @RequestHeader("X-USER-ID") String userId
   ) {
       fcmTokenService.registerOrUpdateFcmToken(userId, dto.getToken());
       return ApiResponseDto.defaultOk();
   }
}
