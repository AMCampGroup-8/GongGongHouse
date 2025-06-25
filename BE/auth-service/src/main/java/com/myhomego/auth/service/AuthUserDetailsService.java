package com.myhomego.auth.service;

import com.myhomego.auth.client.UserServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthUserDetailsService implements UserDetailsService {

    private final UserServiceClient userServiceClient;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            log.debug("사용자 정보 조회 요청: {}", username);
            Map<String, Object> userMap = userServiceClient.getUserByUserId(username).getBody();
            
            if (userMap == null) {
                log.error("사용자를 찾을 수 없음: {}", username);
                throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username);
            }
            
            log.debug("사용자 정보 조회 결과: {}", userMap);
            
            String userId = (String) userMap.get("userId");
            String password = (String) userMap.get("userPwd");
            
            // 기본적으로 ROLE_USER 권한 부여
            return new User(
                userId,
                password,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
            );
        } catch (Exception e) {
            log.error("사용자 정보 조회 중 오류 발생: ", e);
            throw new UsernameNotFoundException("사용자 정보 조회 중 오류 발생: " + e.getMessage(), e);
        }
    }
} 