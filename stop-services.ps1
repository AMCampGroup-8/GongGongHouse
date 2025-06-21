# 서비스 중지 스크립트
Write-Host "마이크로서비스 중지 중..." -ForegroundColor Red

# Java 프로세스 중지 (Spring Boot 애플리케이션)
Write-Host "Spring Boot 애플리케이션 중지 중..." -ForegroundColor Yellow
Get-Process -Name java -ErrorAction SilentlyContinue | Where-Object {$_.MainWindowTitle -eq ""} | Stop-Process -Force

# Node.js 프로세스 중지 (Frontend)
Write-Host "Frontend 애플리케이션 중지 중..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "모든 서비스가 중지되었습니다!" -ForegroundColor Green 