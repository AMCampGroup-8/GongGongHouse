# Encoding setup
$OutputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $true
chcp 65001 | Out-Null

Write-Host "Starting API Gateway routing test..." -ForegroundColor Cyan

# 1. API Gateway self test (existing successful path)
try {
    Write-Host "1. Testing API Gateway itself..." -ForegroundColor Yellow
    $url = "http://localhost:8000/api/gateway/v1/test"
    Write-Host "URL: $url" -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri $url -Method Get -ErrorAction Stop
    Write-Host "Success: API Gateway response" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "Failed: $_" -ForegroundColor Red
}

# 2. Auth Service test (StripPrefix=1 applied)
try {
    Write-Host "`n2. Testing Auth Service..." -ForegroundColor Yellow
    $url = "http://localhost:8000/auth-service/api/auth/test"
    Write-Host "URL: $url" -ForegroundColor Cyan
    Write-Host "Expected forwarded path: /api/auth/test" -ForegroundColor Magenta
    $response = Invoke-RestMethod -Uri $url -Method Get -ErrorAction Stop
    Write-Host "Success: Auth Service response" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "Failed: $_" -ForegroundColor Red
}

# 3. User Service test (StripPrefix=1 applied)
try {
    Write-Host "`n3. Testing User Service..." -ForegroundColor Yellow
    $url = "http://localhost:8000/user-service/api/users/test"
    Write-Host "URL: $url" -ForegroundColor Cyan
    Write-Host "Expected forwarded path: /api/users/test" -ForegroundColor Magenta
    $response = Invoke-RestMethod -Uri $url -Method Get -ErrorAction Stop
    Write-Host "Success: User Service response" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "Failed: $_" -ForegroundColor Red
}

# 4. Direct Auth Service call test (for comparison)
try {
    Write-Host "`n4. Testing direct call to Auth Service..." -ForegroundColor Yellow
    # Check Auth Service information in Eureka
    $eurekaApps = Invoke-RestMethod -Uri "http://localhost:8761/eureka/apps/AUTH-SERVICE" -Headers @{"Accept"="application/json"} -ErrorAction Stop
    $authInstance = $eurekaApps.application.instance
    
    if ($authInstance) {
        $authPort = $authInstance.port.'$'
        $authHost = $authInstance.hostName
        $url = "http://${authHost}:${authPort}/api/auth/test"
        Write-Host "Direct call URL: $url" -ForegroundColor Cyan
        $response = Invoke-RestMethod -Uri $url -Method Get -ErrorAction Stop
        Write-Host "Success: Direct Auth Service response" -ForegroundColor Green
        $response | ConvertTo-Json
    } else {
        Write-Host "Auth Service instance not found" -ForegroundColor Red
    }
} catch {
    Write-Host "Failed: $_" -ForegroundColor Red
}

Write-Host "`nTest completed" -ForegroundColor Cyan 