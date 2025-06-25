# 내집GO 프로젝트

## 프로젝트 소개
내집GO는 청년과 신혼부부를 위한 맞춤형 주거 정보 제공 서비스입니다.

## 기술 스택
- **프론트엔드**: React, Vite, TailwindCSS
- **백엔드**: Spring Boot, Spring Cloud
- **데이터베이스**: MariaDB
- **인프라**: Docker, Docker Compose

## 프로젝트 구조
- **FE**: 프론트엔드 (React + Vite)
- **BE**:
  - **api-gateway**: API Gateway 서비스
  - **auth-service**: 인증 서비스
  - **eureka-server**: 서비스 디스커버리
  - **user-service**: 사용자 서비스

## 로컬 개발 환경 설정

### 필요 조건
- JDK 17
- Node.js 18+
- MariaDB
- Docker (선택사항)

### 로컬에서 실행하기
1. MariaDB 설정
```
mysql -u root -p < setup-database.sql
```

2. 백엔드 서비스 실행
```powershell
.\start-all-services.ps1
```

3. 프론트엔드 실행
```bash
cd FE
npm install
npm run dev
```

## Docker로 배포하기

### 필요 조건
- Docker
- Docker Compose

### Docker 배포 방법
1. 배포 스크립트 실행
```powershell
.\docker-deploy.ps1
```

2. 서비스 접속
- Eureka Server: http://localhost:8761
- API Gateway: http://localhost:8000
- 프론트엔드: http://localhost

### 수동 배포 방법
1. Docker 이미지 빌드 및 컨테이너 실행
```bash
docker-compose up -d --build
```

2. 컨테이너 상태 확인
```bash
docker-compose ps
```

3. 컨테이너 중지
```bash
docker-compose down
```

## 트러블슈팅
- **API Gateway 연결 문제**: Eureka Server에 서비스가 제대로 등록되었는지 확인
- **인증 오류**: JWT 토큰 설정 및 사용자 정보 확인
- **Docker 네트워크 문제**: 컨테이너 간 통신 설정 확인