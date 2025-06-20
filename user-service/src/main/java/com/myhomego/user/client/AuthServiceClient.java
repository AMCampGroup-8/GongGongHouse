package com.myhomego.user.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "auth-service")
public interface AuthServiceClient {

    @PostMapping("/api/auth/validate")
    ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String token);
} 