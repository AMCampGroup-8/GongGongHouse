package com.myhomego.auth.service;

import com.myhomego.auth.dto.AuthDto;
import java.util.Map;

public interface AuthService {
    AuthDto.LoginResponse login(AuthDto.LoginRequest request);
    boolean validateToken(String token);
    AuthDto.TokenResponse kakaoLogin(AuthDto.KakaoLoginRequest request);

    /**
     * 카카오 로그인 처리
     * @param code 카카오 인증 코드
     * @return 토큰과 사용자 정보
     */
    Map<String, Object> processKakaoLogin(String code);
} 