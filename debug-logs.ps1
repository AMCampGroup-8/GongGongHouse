# Encoding setup
$OutputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $true
chcp 65001 | Out-Null

# Debug logs script
Write-Host "Starting log monitoring..." -ForegroundColor Cyan

# Find log files
$apiGatewayLog = "BE/api-gateway/build/logs/spring.log"
$authServiceLog = "BE/auth-service/build/logs/spring.log"

# Create folders if they don't exist
if (-not (Test-Path "BE/api-gateway/build/logs")) {
    New-Item -Path "BE/api-gateway/build/logs" -ItemType Directory -Force | Out-Null
    New-Item -Path $apiGatewayLog -ItemType File -Force | Out-Null
    Write-Host "Created API Gateway log directory and file" -ForegroundColor Yellow
}

if (-not (Test-Path "BE/auth-service/build/logs")) {
    New-Item -Path "BE/auth-service/build/logs" -ItemType Directory -Force | Out-Null
    New-Item -Path $authServiceLog -ItemType File -Force | Out-Null
    Write-Host "Created Auth Service log directory and file" -ForegroundColor Yellow
}

# Function to monitor a log file
function Monitor-LogFile {
    param (
        [string]$logFile,
        [string]$serviceName,
        [System.ConsoleColor]$color
    )
    
    if (Test-Path $logFile) {
        Write-Host "Monitoring $serviceName log: $logFile" -ForegroundColor $color
        Start-Process powershell -ArgumentList "-Command Get-Content -Path '$logFile' -Wait -Tail 10 | ForEach-Object { Write-Host '[$serviceName] ' -NoNewline -ForegroundColor $color; Write-Host `$_ }" -WindowStyle Normal
    } else {
        Write-Host "Log file for $serviceName not found at: $logFile" -ForegroundColor Red
        
        # Try to find log files in the project
        $possibleLogs = Get-ChildItem -Path "BE/$($serviceName.Replace(' ', '-').ToLower())" -Recurse -Filter "*.log" -ErrorAction SilentlyContinue
        if ($possibleLogs) {
            Write-Host "Found possible log files for $serviceName:" -ForegroundColor Yellow
            $possibleLogs | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
        }
    }
}

# Monitor API Gateway logs
Monitor-LogFile -logFile $apiGatewayLog -serviceName "API Gateway" -color "Cyan"

# Monitor Auth Service logs
Monitor-LogFile -logFile $authServiceLog -serviceName "Auth Service" -color "Green"

# Check for Spring boot logs in standard locations
Write-Host "`nChecking for other possible log locations..." -ForegroundColor Yellow

# Check application logs (Spring Boot default)
$apiGatewayAppLog = "BE/api-gateway/logs/application.log"
$authServiceAppLog = "BE/auth-service/logs/application.log"

if (Test-Path $apiGatewayAppLog) {
    Write-Host "Found API Gateway application log: $apiGatewayAppLog" -ForegroundColor Cyan
    Monitor-LogFile -logFile $apiGatewayAppLog -serviceName "API Gateway (App)" -color "Blue"
}

if (Test-Path $authServiceAppLog) {
    Write-Host "Found Auth Service application log: $authServiceAppLog" -ForegroundColor Green
    Monitor-LogFile -logFile $authServiceAppLog -serviceName "Auth Service (App)" -color "Magenta"
}

# Provide additional instructions
Write-Host "`nTo test the API Gateway, run the following command in a new PowerShell window:" -ForegroundColor Yellow
Write-Host "Invoke-RestMethod -Uri 'http://localhost:8000/auth-service/api/auth/test' -Method Get" -ForegroundColor Gray

Write-Host "`nTo test the Auth Service directly, run the following command in a new PowerShell window:" -ForegroundColor Yellow
Write-Host "Invoke-RestMethod -Uri 'http://localhost:8761/eureka/apps/AUTH-SERVICE' -Headers @{\"Accept\"=\"application/json\"} | Select-Object -ExpandProperty application | Select-Object -ExpandProperty instance | ForEach-Object { Invoke-RestMethod -Uri \"http://$($_.hostName):$($_.port.'$')/api/auth/test\" -Method Get }" -ForegroundColor Gray

Write-Host "`nPress Ctrl+C to stop monitoring logs" -ForegroundColor Red 