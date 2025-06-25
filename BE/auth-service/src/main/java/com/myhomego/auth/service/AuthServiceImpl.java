package com.myhomego.auth.service;

import com.myhomego.auth.client.UserServiceClient;
import com.myhomego.auth.dto.AuthDto;
import com.myhomego.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserServiceClient userServiceClient;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthDto.LoginResponse login(AuthDto.LoginRequest request) {
        log.info("로그인 요청: {}", request.getUserId());
        
        try {
            // Spring Security의 인증 매니저를 사용하여 인증 시도
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUserId(), request.getUserPwd())
            );
            
            // 인증 성공 시 사용자 정보 조회
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            log.debug("인증 성공: {}", userDetails.getUsername());
            
            // 사용자 정보 조회
            log.debug("사용자 정보 조회 요청: {}", request.getUserId());
            ResponseEntity<Map<String, Object>> userResponse = userServiceClient.getUserByUserId(request.getUserId());
            log.debug("사용자 정보 조회 응답: {}", userResponse);
            
            Map<String, Object> userData = userResponse.getBody();
            
            if (userData == null) {
                throw new RuntimeException("사용자 정보를 찾을 수 없습니다.");
            }
            
            // JWT 토큰 생성
            String userId = (String) userData.get("userId");
            String userEmail = (String) userData.get("userEmail");
            String userName = (String) userData.get("userName");
            
            log.debug("JWT 토큰 생성 요청: userId={}, userEmail={}, userName={}", userId, userEmail, userName);
            String token = jwtUtil.createToken(userId, userEmail, userName);
            log.debug("JWT 토큰 생성 완료: {}", token);
            
            return AuthDto.LoginResponse.builder()
                    .userId(userId)
                    .userName(userName)
                    .token(token)
                    .build();
        } catch (BadCredentialsException e) {
            log.error("로그인 실패: 잘못된 인증 정보", e);
            throw new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다.");
        } catch (Exception e) {
            log.error("로그인 처리 중 오류 발생:", e);
            throw new RuntimeException("로그인 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateToken(String token) {
        return jwtUtil.isValidToken(token);
    }

    @Override
    @Transactional
    public AuthDto.TokenResponse kakaoLogin(AuthDto.KakaoLoginRequest request) {
        // 카카오 토큰 획득
        String accessToken = request.getAccessToken();
        
        // 카카오 사용자 정보 조회
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", "kakao_" + System.currentTimeMillis());
        
        // 카카오 ID를 기반으로 JWT 토큰 생성
        String kakaoId = userInfo.get("id").toString();
        String token = jwtUtil.createToken(kakaoId);
        
        return AuthDto.TokenResponse.builder()
                .token(token)
                .userId(kakaoId)
                .userName("카카오 사용자")
                .build();
    }
} 