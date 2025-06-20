# MyHomeGo 마이크로서비스 프로젝트

## 프로젝트 개요
MyHomeGo는 마이크로서비스 아키텍처를 사용하여 구현된 부동산 서비스 애플리케이션입니다.

## 서비스 구성
- **user-service**: 사용자 관리 서비스
- **auth-service**: 인증 및 인가 서비스

## 기술 스택
- Java 17
- Spring Boot 3.x
- Spring Cloud
- Spring Security
- MariaDB
- Eureka
- Feign Client
- JWT

## 실행 방법
1. MariaDB 설정
```sql
CREATE DATABASE myhomego_user;
CREATE DATABASE myhomego_auth;
```

2. Eureka Server 실행 (별도 프로젝트 필요)

3. 각 서비스 실행
```bash
# user-service 실행
cd user-service
mvn spring-boot:run

# auth-service 실행
cd auth-service
mvn spring-boot:run
```

## API 문서
- User Service: http://localhost:{random-port}/swagger-ui.html
- Auth Service: http://localhost:{random-port}/swagger-ui.html