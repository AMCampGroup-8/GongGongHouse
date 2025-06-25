package com.myhomego.auth.controller;

import com.myhomego.auth.dto.AuthDto;
import com.myhomego.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    private final AuthService authService;

    // 테스트 엔드포인트 추가
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        log.info("Auth Service Test API called");
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Auth Service API is working!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDto.LoginRequest request) {
        log.info("Login request received for user: {}", request.getUserId());
        try {
            AuthDto.LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            log.error("Login failed: Invalid credentials for user {}", request.getUserId());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", "InvalidCredentials");
            errorResponse.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (Exception e) {
            log.error("Login failed: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", "ServerError");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(isValid);
    }

    @PostMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody AuthDto.KakaoLoginRequest request) {
        try {
            AuthDto.TokenResponse response = authService.kakaoLogin(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Kakao login failed: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", "ServerError");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
} 