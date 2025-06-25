package com.myhomego.auth.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @GetMapping("/api/users/email/{userEmail}")
    ResponseEntity<Map<String, Object>> getUserByEmail(@PathVariable String userEmail);
    
    @GetMapping("/api/users/userId/{userId}")
    ResponseEntity<Map<String, Object>> getUserByUserId(@PathVariable String userId);
    
    @PostMapping("/api/users/validate")
    ResponseEntity<Boolean> validateUser(@RequestBody Map<String, String> credentials);

    /**
     * 사용자 ID로 존재 여부 확인
     */
    @GetMapping("/api/users/check-userId")
    ResponseEntity<Map<String, Object>> checkUserExistsById(@RequestParam("userId") String userId);

    /**
     * 카카오 로그인 사용자 생성
     */
    @PostMapping("/api/users")
    ResponseEntity<Map<String, Object>> createUser(@RequestBody Map<String, Object> userInfo);
} 