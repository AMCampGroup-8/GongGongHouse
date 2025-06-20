package com.myhomego.user.controller;

import com.myhomego.user.dto.UserDto;
import com.myhomego.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

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

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto.Response> getUserByEmail(@PathVariable String email) {
        UserDto.Response response = userService.getUserByEmail(email);
        return ResponseEntity.ok(response);
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
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = userService.existsByEmail(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/check-userId")
    public ResponseEntity<Map<String, Boolean>> checkUserId(@RequestParam String userId) {
        boolean exists = userService.existsByUserId(userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
} 