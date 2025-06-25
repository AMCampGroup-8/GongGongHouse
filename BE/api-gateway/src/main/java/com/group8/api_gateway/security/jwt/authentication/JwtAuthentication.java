package com.group8.api_gateway.security.jwt.authentication;

import lombok.Getter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Getter
public class JwtAuthentication extends AbstractAuthenticationToken {
    private final String token;
    private final UserPrincipal userPrincipal;

    public JwtAuthentication(UserPrincipal userPrincipal, String token, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.userPrincipal = userPrincipal;
        this.token = token;
        this.setDetails(userPrincipal);
        setAuthenticated(true);
    }

    @Override
    public boolean isAuthenticated() {
        return true;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return null;
    }
} 