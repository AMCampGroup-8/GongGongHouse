# 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

# 모든 서비스 실행 스크립트
Write-Host "모든 마이크로서비스 시작 중..." -ForegroundColor Cyan

# 현재 실행 중인 Java 프로세스 종료
Write-Host "기존 Java 프로세스 종료 중..." -ForegroundColor Yellow
Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 1. Eureka Server 시작
Write-Host "1. Eureka Server 시작 중..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\eureka-server && gradlew.bat bootRun" -WindowStyle Normal
Write-Host "Eureka Server 시작 명령이 실행되었습니다." -ForegroundColor Green
Write-Host "Eureka Server: http://localhost:8761" -ForegroundColor Magenta

# Eureka Server가 시작될 때까지 대기
Write-Host "Eureka Server가 시작될 때까지 15초 대기 중..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# 2. Auth Service 시작
Write-Host "2. Auth Service 시작 중..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\auth-service && gradlew.bat bootRun" -WindowStyle Normal
Write-Host "Auth Service 시작 명령이 실행되었습니다." -ForegroundColor Green

# Auth Service가 시작될 때까지 대기
Write-Host "Auth Service가 시작될 때까지 10초 대기 중..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 3. User Service 시작
Write-Host "3. User Service 시작 중..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\user-service && gradlew.bat bootRun" -WindowStyle Normal
Write-Host "User Service 시작 명령이 실행되었습니다." -ForegroundColor Green

# User Service가 시작될 때까지 대기
Write-Host "User Service가 시작될 때까지 10초 대기 중..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 4. API Gateway 시작
Write-Host "4. API Gateway 시작 중..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\api-gateway && gradlew.bat bootRun" -WindowStyle Normal
Write-Host "API Gateway 시작 명령이 실행되었습니다." -ForegroundColor Green
Write-Host "API Gateway: http://localhost:8000" -ForegroundColor Magenta

# 모든 서비스 시작 완료
Write-Host "`n모든 서비스가 시작되었습니다!" -ForegroundColor Cyan
Write-Host "Eureka Server: http://localhost:8761" -ForegroundColor Magenta
Write-Host "API Gateway: http://localhost:8000" -ForegroundColor Magenta

# 실행 중인 Java 프로세스 확인
Start-Sleep -Seconds 5
Write-Host "`n실행 중인 Java 프로세스:" -ForegroundColor Cyan
Get-Process -Name java -ErrorAction SilentlyContinue | Format-Table Id, ProcessName, Path 