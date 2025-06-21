package com.myhomego.auth.service;

import com.myhomego.auth.dto.AuthDto;

public interface AuthService {
    AuthDto.TokenResponse login(AuthDto.LoginRequest request);
    boolean validateToken(String token);
    AuthDto.TokenResponse kakaoLogin(AuthDto.KakaoLoginRequest request);
} 