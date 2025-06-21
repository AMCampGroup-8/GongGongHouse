# 서비스 시작 스크립트
Write-Host "마이크로서비스 시작 중..." -ForegroundColor Green

# 현재 실행 중인 서비스 중지
Write-Host "기존 서비스 중지 중..." -ForegroundColor Yellow
Get-Process -Name java -ErrorAction SilentlyContinue | Where-Object {$_.MainWindowTitle -eq ""} | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Eureka Server 시작
Write-Host "Eureka Server 시작 중..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\eureka-server && gradlew.bat bootRun" -WindowStyle Normal

# 잠시 대기 (Eureka Server가 시작될 때까지)
Write-Host "Eureka Server가 시작될 때까지 15초 대기..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# API Gateway 시작
Write-Host "API Gateway 시작 중..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\api-gateway && gradlew.bat bootRun" -WindowStyle Normal

# 잠시 대기 (API Gateway가 시작될 때까지)
Write-Host "API Gateway가 시작될 때까지 10초 대기..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Auth Service 시작
Write-Host "Auth Service 시작 중..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\auth-service && gradlew.bat bootRun" -WindowStyle Normal

# 잠시 대기
Start-Sleep -Seconds 5

# User Service 시작
Write-Host "User Service 시작 중..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\user-service && gradlew.bat bootRun" -WindowStyle Normal

# 잠시 대기
Start-Sleep -Seconds 5

# FE 시작
Write-Host "Frontend 시작 중..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c cd FE && npm run dev" -WindowStyle Normal

Write-Host "모든 서비스가 시작되었습니다!" -ForegroundColor Green
Write-Host "Eureka Server: http://localhost:8761" -ForegroundColor Magenta
Write-Host "API Gateway: http://localhost:8000" -ForegroundColor Magenta
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Magenta

# 서비스 상태 확인
Start-Sleep -Seconds 10
Write-Host "`n서비스 상태 확인 중..." -ForegroundColor Green
Write-Host "Eureka Server 포트(8761) 확인:" -ForegroundColor Cyan
netstat -ano | findstr "8761"
Write-Host "API Gateway 포트(8000) 확인:" -ForegroundColor Cyan
netstat -ano | findstr "8000"
Write-Host "Frontend 포트(5173) 확인:" -ForegroundColor Cyan
netstat -ano | findstr "5173" 