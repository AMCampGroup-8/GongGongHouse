package com.myhomego.user.service;

import com.myhomego.user.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    UserDto.Response createUser(UserDto.SignUpRequest userDto);
    UserDto.Response getUserById(Long userId);
    UserDto.Response getUserByUserEmail(String userEmail);
    UserDto.Response getUserByUserId(String userId);
    List<UserDto.Response> getAllUsers();
    Page<UserDto.Response> getUsersPage(Pageable pageable);
    UserDto.Response updateUser(Long userId, UserDto.UpdateRequest userDto);
    void deleteUser(Long userId);
    boolean existsByUserEmail(String userEmail);
    boolean existsByUserId(String userId);
} 