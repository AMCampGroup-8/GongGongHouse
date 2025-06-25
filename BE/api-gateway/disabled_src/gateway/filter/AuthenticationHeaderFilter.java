package com.group8.api_gateway.gateway.filter;

import com.group8.api_gateway.security.jwt.authentication.UserPrincipal;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationHeaderFilter extends AbstractGatewayFilterFactory<AuthenticationHeaderFilter.Config> {

    public AuthenticationHeaderFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> ReactiveSecurityContextHolder.getContext()
                .map(securityContext -> securityContext.getAuthentication())
                .filter(authentication -> authentication != null && authentication.getPrincipal() instanceof UserPrincipal)
                .map(authentication -> (UserPrincipal) authentication.getPrincipal())
                .map(userPrincipal -> {
                    exchange.getRequest().mutate()
                            .header("X-Auth-UserId", userPrincipal.getUserId())
                            .build();
                    return exchange;
                })
                .defaultIfEmpty(exchange)
                .flatMap(chain::filter);
    }

    public static class Config {
        // 필요한 설정이 있으면 여기에 추가
    }
}
