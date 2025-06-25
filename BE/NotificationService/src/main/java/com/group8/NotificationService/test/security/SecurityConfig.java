// package com.group8.NotificationService.test.security;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.Customizer;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//         http
//             .csrf(csrf -> csrf.disable())
//             .authorizeHttpRequests(auth -> auth
//                 .requestMatchers("/notifications/**").permitAll()  // 이 경로는 인증 없이 허용
//                 .anyRequest().authenticated()
//             )
//             .httpBasic(Customizer.withDefaults());  // or .formLogin(); 필요 시

//         return http.build();
//     }
// }