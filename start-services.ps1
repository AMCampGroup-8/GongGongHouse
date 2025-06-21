# 서비스 시작 스크립트
Write-Host "마이크로서비스 시작 중..." -ForegroundColor Green

# Eureka Server 시작
Write-Host "Eureka Server 시작 중..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\eureka-server && mvn spring-boot:run" -WindowStyle Normal

# 잠시 대기 (Eureka Server가 시작될 때까지)
Write-Host "Eureka Server가 시작될 때까지 10초 대기..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Auth Service 시작
Write-Host "Auth Service 시작 중..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\auth-service && mvn spring-boot:run" -WindowStyle Normal

# User Service 시작
Write-Host "User Service 시작 중..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\user-service && mvn spring-boot:run" -WindowStyle Normal

# FE 시작
Write-Host "Frontend 시작 중..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c cd FE && npm run dev" -WindowStyle Normal

Write-Host "모든 서비스가 시작되었습니다!" -ForegroundColor Green
Write-Host "Eureka Server: http://localhost:8761" -ForegroundColor Magenta
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Magenta 