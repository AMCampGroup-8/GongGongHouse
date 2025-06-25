package com.group8.api_gateway.security.filter;

import com.group8.api_gateway.security.jwt.JwtTokenValidator;
import com.group8.api_gateway.security.jwt.authentication.JwtAuthentication;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements WebFilter {
    private final JwtTokenValidator jwtTokenValidator;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        HttpMethod method = request.getMethod();
        
        // 회원가입 및 ID 중복 확인 요청은 인증 검사 건너뛰기
        if (isAuthExemptRequest(path, method)) {
            return chain.filter(exchange);
        }
        
        String jwtToken = jwtTokenValidator.getToken(request);

        if (jwtToken != null) {
            JwtAuthentication authentication = jwtTokenValidator.validateToken(jwtToken);
            if (authentication != null) {
                return chain.filter(exchange)
                        .contextWrite(ReactiveSecurityContextHolder.withAuthentication(authentication));
            }
        }
        
        return chain.filter(exchange);
    }
    
    private boolean isAuthExemptRequest(String path, HttpMethod method) {
        // 회원가입 요청 (POST /user-service/api/users)
        boolean isUserRegistration = path.contains("/user-service/api/users") && 
                                    method == HttpMethod.POST;
        
        // ID 중복 확인 요청 (GET /user-service/api/users/check-userId)
        boolean isUserIdCheck = path.contains("/user-service/api/users/check-userId") && 
                               method == HttpMethod.GET;
        
        // 로그인 요청 (POST /auth-service/api/auth/login)
        boolean isLogin = path.contains("/auth-service/api/auth/login") && 
                         method == HttpMethod.POST;
        
        return isUserRegistration || isUserIdCheck || isLogin;
    }
} 