package com.myhomego.auth.controller;

import com.myhomego.auth.dto.AuthDto;
import com.myhomego.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthDto.TokenResponse> login(@RequestBody AuthDto.LoginRequest request) {
        AuthDto.TokenResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(isValid);
    }

    @PostMapping("/kakao")
    public ResponseEntity<AuthDto.TokenResponse> kakaoLogin(@RequestBody AuthDto.KakaoLoginRequest request) {
        AuthDto.TokenResponse response = authService.kakaoLogin(request);
        return ResponseEntity.ok(response);
    }
} 