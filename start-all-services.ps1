# Encoding setup
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

# Start all services script
Write-Host "Starting all microservices..." -ForegroundColor Cyan

# Stop currently running Java processes
Write-Host "Terminating existing Java processes..." -ForegroundColor Yellow
Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Service status check function
function Check-Service {
    param (
        [string]$name,
        [string]$path
    )
    
    Write-Host "Checking service: $name" -ForegroundColor Cyan
    
    $process = Get-Process -Name java -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "$name" }
    
    if ($process) {
        Write-Host "$name service is already running. (PID: $($process.Id))" -ForegroundColor Green
        return $true
    } else {
        Write-Host "$name service is not running." -ForegroundColor Yellow
        return $false
    }
}

# Frontend check function
function Check-Frontend {
    $process = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "vite" }
    
    if ($process) {
        Write-Host "Frontend is already running. (PID: $($process.Id))" -ForegroundColor Green
        return $true
    } else {
        Write-Host "Frontend is not running." -ForegroundColor Yellow
        return $false
    }
}

# Save current path
$rootPath = Get-Location

# Start Eureka Server
Write-Host "Starting Eureka Server..." -ForegroundColor Cyan
$eurekaRunning = Check-Service -name "eureka"
if (-not $eurekaRunning) {
    Set-Location "$rootPath\BE\eureka-server"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\gradlew bootRun"
    Write-Host "Eureka Server started" -ForegroundColor Green
    Start-Sleep -Seconds 10  # Wait for Eureka to fully start
} else {
    Write-Host "Eureka Server is already running." -ForegroundColor Green
}

# Start Auth Service
Write-Host "Starting Auth Service..." -ForegroundColor Cyan
$authRunning = Check-Service -name "auth-service"
if (-not $authRunning) {
    Set-Location "$rootPath\BE\auth-service"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\gradlew bootRun"
    Write-Host "Auth Service started" -ForegroundColor Green
    Start-Sleep -Seconds 5  # Wait for Auth Service to start
} else {
    Write-Host "Auth Service is already running." -ForegroundColor Green
}

# Start User Service
Write-Host "Starting User Service..." -ForegroundColor Cyan
$userRunning = Check-Service -name "user-service"
if (-not $userRunning) {
    Set-Location "$rootPath\BE\user-service"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\gradlew bootRun"
    Write-Host "User Service started" -ForegroundColor Green
    Start-Sleep -Seconds 5  # Wait for User Service to start
} else {
    Write-Host "User Service is already running." -ForegroundColor Green
}

# Start API Gateway
Write-Host "Starting API Gateway..." -ForegroundColor Cyan
$gatewayRunning = Check-Service -name "api-gateway"
if (-not $gatewayRunning) {
    Set-Location "$rootPath\BE\api-gateway"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\gradlew bootRun"
    Write-Host "API Gateway started" -ForegroundColor Green
    Start-Sleep -Seconds 5  # Wait for API Gateway to start
} else {
    Write-Host "API Gateway is already running." -ForegroundColor Green
}

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Cyan
$frontendRunning = Check-Frontend
if (-not $frontendRunning) {
    Set-Location "$rootPath\FE"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
    Write-Host "Frontend started" -ForegroundColor Green
} else {
    Write-Host "Frontend is already running." -ForegroundColor Green
}

# Return to original path
Set-Location $rootPath

Write-Host "All services have been started." -ForegroundColor Green
Write-Host "Eureka: http://localhost:8761" -ForegroundColor Cyan
Write-Host "API Gateway: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan

# Check running Java processes
Start-Sleep -Seconds 5
Write-Host "`nRunning Java processes:" -ForegroundColor Cyan
Get-Process -Name java -ErrorAction SilentlyContinue | Format-Table Id, ProcessName, Path 

# Check service status
Start-Sleep -Seconds 10
Write-Host "`nChecking service status..." -ForegroundColor Green
Write-Host "Eureka Server port (8761) check:" -ForegroundColor Cyan
netstat -ano | findstr "8761"
Write-Host "API Gateway port (8000) check:" -ForegroundColor Cyan
netstat -ano | findstr "8000"
Write-Host "Frontend port (5173) check:" -ForegroundColor Cyan
netstat -ano | findstr "5173" 