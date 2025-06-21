package com.myhomego.auth.service;

import com.myhomego.auth.dto.AuthDto;
import com.myhomego.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;

    @Override
    @Transactional
    public AuthDto.TokenResponse login(AuthDto.LoginRequest request) {
        // 실제로는 이 부분에서 사용자 서비스를 호출하여 인증 처리
        // 예시 코드만 작성
        
        // 사용자 인증 로직 추가 (Feign Client로 user-service 호출)
        
        // 로그인 성공시 토큰 발급
        String token = jwtUtil.createToken(request.getEmail());
        
        return AuthDto.TokenResponse.builder()
                .token(token)
                .userId("user-id-sample") // 실제로는 사용자 ID를 반환
                .name("사용자 이름") // 실제로는 사용자 이름을 반환
                .build();
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
        String accessToken = getKakaoAccessToken(request.getCode(), request.getRedirectUri());
        
        // 카카오 사용자 정보 조회
        Map<String, Object> userInfo = getKakaoUserInfo(accessToken);
        
        // 카카오 ID를 기반으로 JWT 토큰 생성
        String kakaoId = userInfo.get("id").toString();
        String token = jwtUtil.createToken(kakaoId);
        
        String name = "";
        Map<String, Object> properties = (Map<String, Object>) userInfo.get("properties");
        if (properties != null && properties.get("nickname") != null) {
            name = properties.get("nickname").toString();
        }
        
        return AuthDto.TokenResponse.builder()
                .token(token)
                .userId(kakaoId)
                .name(name)
                .build();
    }
    
    // 카카오 액세스 토큰 획득
    private String getKakaoAccessToken(String code, String redirectUri) {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";
        
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", "your-kakao-client-id"); // 실제 클라이언트 ID로 변경 필요
        params.add("redirect_uri", redirectUri);
        params.add("code", code);
        
        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, params, Map.class);
        Map<String, Object> responseBody = response.getBody();
        
        return responseBody.get("access_token").toString();
    }
    
    // 카카오 사용자 정보 조회
    private Map<String, Object> getKakaoUserInfo(String accessToken) {
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";
        
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        
        org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, org.springframework.http.HttpMethod.GET, entity, Map.class);
        
        return response.getBody();
    }
} 