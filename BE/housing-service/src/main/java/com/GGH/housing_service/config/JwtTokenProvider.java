package com.GGH.housing_service.config;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

  private final String secretKey = "secretKeyForDemo"; // ⚠ 실제로는 환경변수 등으로 관리하세요

  // JWT 유효성 검증
  public boolean validateToken(String token) {
    try {
      Jwts.parser()
          .setSigningKey(secretKey.getBytes())
          .parseClaimsJws(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }
}
