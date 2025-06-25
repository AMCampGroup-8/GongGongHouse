package com.myhomego.auth.service;

import com.myhomego.auth.client.UserServiceClient;
import com.myhomego.auth.dto.AuthDto;
import com.myhomego.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
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
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserServiceClient userServiceClient;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate; // 내부 서비스 통신용 (LoadBalanced)
    private final RestTemplate externalRestTemplate; // 외부 API 통신용
    private final AuthenticationManager authenticationManager;
    
    @Value("${kakao.client.id}")
    private String kakaoClientId;
    
    @Value("${kakao.client.redirect-uri}")
    private String kakaoRedirectUri;
    
    public AuthServiceImpl(
            UserServiceClient userServiceClient,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            @Qualifier("restTemplate") RestTemplate restTemplate,
            @Qualifier("externalRestTemplate") RestTemplate externalRestTemplate,
            AuthenticationManager authenticationManager) {
        this.userServiceClient = userServiceClient;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.restTemplate = restTemplate;
        this.externalRestTemplate = externalRestTemplate;
        this.authenticationManager = authenticationManager;
    }

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

    @Override
    public Map<String, Object> processKakaoLogin(String code) {
        // 1. 카카오 토큰 받기
        String kakaoToken = getKakaoToken(code);
        
        // 2. 카카오 사용자 정보 받기
        Map<String, Object> userInfo = getKakaoUserInfo(kakaoToken);
        
        // 3. 사용자 정보로 회원가입 또는 로그인 처리
        String userId = "kakao_" + userInfo.get("id");
        
        // 4. 유저 서비스에서 사용자 조회
        boolean userExists = checkIfUserExists(userId);
        
        if (!userExists) {
            // 사용자가 없으면 등록
            createKakaoUser(userId, userInfo);
        }
        
        // 5. JWT 토큰 생성
        String userName = (String) userInfo.getOrDefault("nickname", "카카오 사용자");
        String userEmail = (String) userInfo.getOrDefault("email", userId + "@kakao.com");
        String token = jwtUtil.createToken(userId, userEmail, userName);
        
        return Map.of("token", token, "userInfo", userInfo);
    }

    /**
     * 카카오 액세스 토큰 받기
     */
    private String getKakaoToken(String code) {
        try {
            log.info("카카오 토큰 요청: code={}", code);
            
            String kakaoTokenUrl = "https://kauth.kakao.com/oauth/token";
            
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", kakaoClientId);
            params.add("redirect_uri", kakaoRedirectUri);
            params.add("code", code);
            
            log.debug("카카오 토큰 요청 설정: clientId={}, redirectUri={}", kakaoClientId, kakaoRedirectUri);
            
            // 외부 API 통신에는 LoadBalanced가 아닌 externalRestTemplate 사용
            ResponseEntity<Map> response = externalRestTemplate.postForEntity(
                kakaoTokenUrl, 
                params, 
                Map.class
            );
            
            log.info("카카오 토큰 응답: {}", response.getBody());
            return (String) response.getBody().get("access_token");
        } catch (Exception e) {
            log.error("카카오 토큰 요청 오류: ", e);
            throw new RuntimeException("카카오 토큰 요청 실패", e);
        }
    }

    /**
     * 카카오 사용자 정보 받기
     */
    private Map<String, Object> getKakaoUserInfo(String accessToken) {
        try {
            log.info("카카오 사용자 정보 요청: token={}", accessToken);
            
            String kakaoUserInfoUrl = "https://kapi.kakao.com/v2/user/me";
            
            // 헤더 설정
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
            
            // 외부 API 통신에는 LoadBalanced가 아닌 externalRestTemplate 사용
            ResponseEntity<Map> response = externalRestTemplate.exchange(
                kakaoUserInfoUrl,
                org.springframework.http.HttpMethod.GET,
                entity,
                Map.class
            );
            
            log.info("카카오 사용자 정보 응답: {}", response.getBody());
            
            Map<String, Object> userInfo = new HashMap<>();
            Map<String, Object> body = response.getBody();
            
            userInfo.put("id", body.get("id"));
            
            // properties에서 닉네임과 프로필 이미지 추출
            if (body.containsKey("properties")) {
                Map<String, Object> properties = (Map<String, Object>) body.get("properties");
                userInfo.put("nickname", properties.get("nickname"));
                
                if (properties.containsKey("profile_image")) {
                    userInfo.put("profileImage", properties.get("profile_image"));
                }
            }
            
            // kakao_account에서 이메일 추출
            if (body.containsKey("kakao_account")) {
                Map<String, Object> kakaoAccount = (Map<String, Object>) body.get("kakao_account");
                
                if (kakaoAccount.containsKey("email")) {
                    userInfo.put("email", kakaoAccount.get("email"));
                }
            }
            
            return userInfo;
        } catch (Exception e) {
            log.error("카카오 사용자 정보 요청 오류: ", e);
            throw new RuntimeException("카카오 사용자 정보 요청 실패", e);
        }
    }

    /**
     * 유저 서비스에서 사용자 존재 여부 확인
     */
    private boolean checkIfUserExists(String userId) {
        try {
            log.info("사용자 존재 여부 확인: userId={}", userId);
            
            // 유저 서비스 API 호출
            ResponseEntity<Map<String, Object>> response = userServiceClient.checkUserExistsById(userId);
            
            if (response.getBody() != null && response.getBody().containsKey("exists")) {
                boolean exists = (boolean) response.getBody().get("exists");
                log.info("사용자 존재 여부 결과: {}", exists);
                return exists;
            }
            
            return false;
        } catch (Exception e) {
            log.error("사용자 존재 여부 확인 오류: ", e);
            return false;
        }
    }

    /**
     * 카카오 사용자 정보로 회원가입
     */
    private void createKakaoUser(String userId, Map<String, Object> userInfo) {
        try {
            log.info("카카오 사용자 등록: userId={}, userInfo={}", userId, userInfo);
            
            // 임의 비밀번호 생성 (사용자는 비밀번호 알 필요 없음)
            String randomPassword = java.util.UUID.randomUUID().toString();
            String encryptedPassword = passwordEncoder.encode(randomPassword);
            
            // 사용자 정보 객체 생성
            Map<String, Object> user = new HashMap<>();
            user.put("userId", userId);
            user.put("userEmail", userInfo.getOrDefault("email", userId + "@kakao.com"));
            user.put("userName", userInfo.getOrDefault("nickname", "카카오 사용자"));
            user.put("userPwd", encryptedPassword);
            user.put("phone", "010-0000-0000"); // 임시 전화번호
            
            // 유저 서비스 API 호출하여 사용자 생성
            ResponseEntity<Map<String, Object>> response = userServiceClient.createUser(user);
            log.info("카카오 사용자 등록 결과: {}", response.getBody());
        } catch (Exception e) {
            log.error("카카오 사용자 등록 오류: ", e);
            throw new RuntimeException("카카오 사용자 등록 실패", e);
        }
    }
} 