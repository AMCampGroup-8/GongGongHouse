/*
package com.group8.communityservice.auth.service;

import com.group8.communityservice.auth.dto.LoginRequest;
import com.group8.communityservice.auth.dto.RegisterRequest;
import com.group8.communityservice.auth.dto.TokenResponse;
import com.group8.communityservice.jwt.JwtTokenProvider;
import com.group8.communityservice.entity.Member;
import com.group8.communityservice.entity.Role;
import com.group8.communityservice.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public Member register(RegisterRequest request) {
        if (memberRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        if (memberRepository.findByNickname(request.getNickname()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }

        Member newMember = Member.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // 비밀번호 암호화
                .nickname(request.getNickname())
                .roles(Collections.singletonList(Role.USER)) // 기본 역할은 USER
                .build();
        return memberRepository.save(newMember);
    }

    @Transactional
    public TokenResponse login(LoginRequest request) {
        // 1. Username + Password 기반으로 Authentication 객체 생성
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());

        // 2. 실제 인증 과정 (MemberDetailsService에서 loadUserByUsername 호출)
        // authenticate 메서드가 실행될 때 MemberDetailsService에서 유저 정보를 가져와 검증
        Authentication authentication = authenticationManager.authenticate(authenticationToken);

        // 3. 인증 정보를 기반으로 JWT 토큰 생성
        String accessToken = jwtTokenProvider.generateToken(authentication);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .build();
    }
}
*/
