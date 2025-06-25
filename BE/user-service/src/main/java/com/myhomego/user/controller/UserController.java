package com.myhomego.user.controller;

import com.myhomego.user.dto.UserDto;
import com.myhomego.user.entity.User;
import com.myhomego.user.repository.UserRepository;
import com.myhomego.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        log.info("User Service Test API called");
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "User Service API is working!");
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<UserDto.Response> createUser(@RequestBody UserDto.SignUpRequest request) {
        UserDto.Response response = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto.Response> getUserById(@PathVariable Long userId) {
        UserDto.Response response = userService.getUserById(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/email/{userEmail}")
    public ResponseEntity<UserDto.Response> getUserByUserEmail(@PathVariable String userEmail) {
        UserDto.Response response = userService.getUserByUserEmail(userEmail);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/userId/{userId}")
    public ResponseEntity<UserDto.Response> getUserByUserId(@PathVariable String userId) {
        try {
            UserDto.Response response = userService.getUserByUserId(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateUser(@RequestBody Map<String, String> credentials) {
        String userId = credentials.get("userId");
        String password = credentials.get("password");
        
        log.info("사용자 검증 요청: userId={}", userId);
        
        try {
            Optional<User> userOptional = userRepository.findByUserId(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                log.debug("사용자 비밀번호 검증: 입력={}, DB={}", password, user.getUserPwd());
                boolean isValid = passwordEncoder.matches(password, user.getUserPwd());
                log.info("사용자 검증 결과: {}", isValid);
                return ResponseEntity.ok(isValid);
            }
            log.info("사용자를 찾을 수 없음: {}", userId);
            return ResponseEntity.ok(false);
        } catch (Exception e) {
            log.error("사용자 검증 중 오류 발생: ", e);
            return ResponseEntity.ok(false);
        }
    }

    @GetMapping
    public ResponseEntity<List<UserDto.Response>> getAllUsers() {
        List<UserDto.Response> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<UserDto.Response>> getUsersPage(Pageable pageable) {
        Page<UserDto.Response> users = userService.getUsersPage(pageable);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDto.Response> updateUser(
            @PathVariable Long userId,
            @RequestBody UserDto.UpdateRequest request) {
        UserDto.Response response = userService.updateUser(userId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkUserEmail(@RequestParam String userEmail) {
        boolean exists = userService.existsByUserEmail(userEmail);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/check-userId")
    public ResponseEntity<Map<String, Boolean>> checkUserId(@RequestParam String userId) {
        log.info("Checking if userId exists: {}", userId);
        boolean exists = userService.existsByUserId(userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
} 