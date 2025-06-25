# Encoding setup
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

# Restart all microservices script
Write-Host "Restarting all microservices..." -ForegroundColor Cyan

# Stop currently running Java processes
Write-Host "Terminating existing Java processes..." -ForegroundColor Yellow
Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 1. Start Eureka Server
Write-Host "1. Starting Eureka Server..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\eureka-server && gradlew.bat bootRun" -WindowStyle Normal
Write-Host "Eureka Server start command executed." -ForegroundColor Green
Write-Host "Eureka Server: http://localhost:8761" -ForegroundColor Magenta

# Wait for Eureka Server to start
Write-Host "Waiting 15 seconds for Eureka Server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# 2. Start Auth Service
Write-Host "2. Starting Auth Service..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\auth-service && gradlew.bat bootRun" -WindowStyle Normal
Write-Host "Auth Service start command executed." -ForegroundColor Green

# Wait for Auth Service to start
Write-Host "Waiting 10 seconds for Auth Service to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 3. Start User Service
Write-Host "3. Starting User Service..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\user-service && gradlew.bat bootRun" -WindowStyle Normal
Write-Host "User Service start command executed." -ForegroundColor Green

# Wait for User Service to start
Write-Host "Waiting 10 seconds for User Service to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 4. Start API Gateway
Write-Host "4. Starting API Gateway..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\api-gateway && gradlew.bat bootRun" -WindowStyle Normal
Write-Host "API Gateway start command executed." -ForegroundColor Green
Write-Host "API Gateway: http://localhost:8000" -ForegroundColor Magenta

# All services started
Write-Host "`nAll services have been started!" -ForegroundColor Cyan
Write-Host "Eureka Server: http://localhost:8761" -ForegroundColor Magenta
Write-Host "API Gateway: http://localhost:8000" -ForegroundColor Magenta

# Test endpoint guide
Write-Host "`nTest endpoints:" -ForegroundColor Cyan
Write-Host "API Gateway test: http://localhost:8000/api/gateway/v1/test" -ForegroundColor Magenta
Write-Host "Auth Service test: http://localhost:8000/auth-service/api/auth/test" -ForegroundColor Magenta
Write-Host "User Service test: http://localhost:8000/user-service/api/users/test" -ForegroundColor Magenta

# Check running Java processes
Start-Sleep -Seconds 5
Write-Host "`nRunning Java processes:" -ForegroundColor Cyan
Get-Process -Name java -ErrorAction SilentlyContinue | Format-Table Id, ProcessName, Path

# 함수: 프로세스 중지
function Stop-JavaService {
    param (
        [string]$serviceName
    )
    
    Write-Host "[$serviceName] 서비스 중지 중..." -ForegroundColor Yellow
    
    $process = Get-Process -Name java -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "$serviceName" }
    
    if ($process) {
        Write-Host "[$serviceName] 서비스 프로세스 발견: PID $($process.Id)" -ForegroundColor Cyan
        Stop-Process -Id $process.Id -Force
        Write-Host "[$serviceName] 서비스 중지됨" -ForegroundColor Green
        Start-Sleep -Seconds 2
        return $true
    } else {
        Write-Host "[$serviceName] 실행 중인 서비스를 찾을 수 없습니다." -ForegroundColor Gray
        return $false
    }
}

# 현재 경로 저장
$rootPath = Get-Location

# 1. 모든 서비스 중지
Write-Host "1. 실행 중인 모든 서비스 중지" -ForegroundColor Cyan

# API Gateway 중지
Stop-JavaService -serviceName "api-gateway"

# Auth Service 중지
Stop-JavaService -serviceName "auth-service"

# User Service 중지
Stop-JavaService -serviceName "user-service"

# Eureka 중지
Stop-JavaService -serviceName "eureka"

# 2. 모든 서비스 시작
Write-Host "`n2. 모든 서비스 재시작" -ForegroundColor Cyan

# Eureka Server 시작
Write-Host "Eureka Server 시작 중..." -ForegroundColor Cyan
Set-Location "$rootPath\BE\eureka-server"
Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\gradlew bootRun"
Write-Host "Eureka Server 시작됨" -ForegroundColor Green
Start-Sleep -Seconds 15  # Eureka가 완전히 시작될 때까지 대기

# Auth Service 시작
Write-Host "Auth Service 시작 중..." -ForegroundColor Cyan
Set-Location "$rootPath\BE\auth-service"
Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\gradlew bootRun"
Write-Host "Auth Service 시작됨" -ForegroundColor Green
Start-Sleep -Seconds 10  # Auth Service가 시작될 때까지 대기

# User Service 시작
Write-Host "User Service 시작 중..." -ForegroundColor Cyan
Set-Location "$rootPath\BE\user-service"
Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\gradlew bootRun"
Write-Host "User Service 시작됨" -ForegroundColor Green
Start-Sleep -Seconds 10  # User Service가 시작될 때까지 대기

# API Gateway 시작
Write-Host "API Gateway 시작 중..." -ForegroundColor Cyan
Set-Location "$rootPath\BE\api-gateway"
Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\gradlew bootRun"
Write-Host "API Gateway 시작됨" -ForegroundColor Green

# 원래 경로로 복귀
Set-Location $rootPath

Write-Host "`n모든 서비스가 재시작되었습니다." -ForegroundColor Green
Write-Host "Eureka: http://localhost:8761" -ForegroundColor Cyan
Write-Host "API Gateway: http://localhost:8000" -ForegroundColor Cyan

# 테스트 엔드포인트 안내
Write-Host "`n테스트 엔드포인트:" -ForegroundColor Cyan
Write-Host "Auth Service 테스트: http://localhost:8000/auth-service/api/auth/test" -ForegroundColor Magenta
Write-Host "User Service 테스트: http://localhost:8000/user-service/api/users/health" -ForegroundColor Magenta

# 실행 중인 Java 프로세스 확인
Start-Sleep -Seconds 5
Write-Host "`n실행 중인 Java 프로세스:" -ForegroundColor Cyan
Get-Process -Name java -ErrorAction SilentlyContinue | Format-Table Id, ProcessName 