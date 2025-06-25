# Encoding setup
$OutputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $true
chcp 65001 | Out-Null

Write-Host "Starting API Gateway debugging..." -ForegroundColor Cyan

# API Gateway Configuration Debug Script
Write-Host "Retrieving API Gateway configuration information..." -ForegroundColor Cyan

$apiGatewayUrl = "http://localhost:8000"

# 1. Get route information
try {
    Write-Host "`n[1] Retrieving API Gateway route information" -ForegroundColor Yellow
    $routesResponse = Invoke-RestMethod -Uri "$apiGatewayUrl/actuator/gateway/routes" -Method Get -ErrorAction Stop
    Write-Host "Route information:" -ForegroundColor Green
    $routesResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Failed to retrieve route information: $_" -ForegroundColor Red
}

# 2. Get service mapping information
try {
    Write-Host "`n[2] Retrieving API Gateway service mapping information" -ForegroundColor Yellow
    $routeResponse = Invoke-RestMethod -Uri "$apiGatewayUrl/actuator/mappings" -Method Get -ErrorAction Stop
    Write-Host "Mapping information:" -ForegroundColor Green
    $routeResponse | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Failed to retrieve mapping information: $_" -ForegroundColor Red
}

# 3. Get services registered in Eureka
try {
    Write-Host "`n[3] Retrieving Eureka service information" -ForegroundColor Yellow
    $eurekaResponse = Invoke-RestMethod -Uri "http://localhost:8761/eureka/apps" -Headers @{"Accept"="application/json"} -ErrorAction Stop
    
    # Output each service information
    Write-Host "Registered services list:" -ForegroundColor Green
    
    $services = $eurekaResponse.applications.application
    foreach ($service in $services) {
        $serviceName = $service.name
        $instances = $service.instance
        
        # Handle single instance or array
        if ($instances -is [System.Array]) {
            foreach ($instance in $instances) {
                Write-Host "`nService: $serviceName" -ForegroundColor Cyan
                Write-Host "  Instance ID: $($instance.instanceId)" -ForegroundColor White
                Write-Host "  Host: $($instance.hostName)" -ForegroundColor White
                Write-Host "  IP: $($instance.ipAddr)" -ForegroundColor White
                Write-Host "  Port: $($instance.port.'$')" -ForegroundColor White
                Write-Host "  Status: $($instance.status)" -ForegroundColor White
                Write-Host "  Registration Time: $($instance.leaseInfo.registrationTimestamp)" -ForegroundColor White
            }
        } else {
            Write-Host "`nService: $serviceName" -ForegroundColor Cyan
            Write-Host "  Instance ID: $($instances.instanceId)" -ForegroundColor White
            Write-Host "  Host: $($instances.hostName)" -ForegroundColor White
            Write-Host "  IP: $($instances.ipAddr)" -ForegroundColor White
            Write-Host "  Port: $($instances.port.'$')" -ForegroundColor White
            Write-Host "  Status: $($instances.status)" -ForegroundColor White
            Write-Host "  Registration Time: $($instances.leaseInfo.registrationTimestamp)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "Failed to retrieve Eureka service information: $_" -ForegroundColor Red
}

# 4. Get API Gateway environment information
try {
    Write-Host "`n[4] Retrieving API Gateway environment information" -ForegroundColor Yellow
    $envResponse = Invoke-RestMethod -Uri "$apiGatewayUrl/actuator/env" -Method Get -ErrorAction Stop
    Write-Host "Environment information:" -ForegroundColor Green
    $envResponse | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Failed to retrieve environment information: $_" -ForegroundColor Red
}

# 5. API Gateway health check
try {
    Write-Host "`n[5] API Gateway health check" -ForegroundColor Yellow
    $healthResponse = Invoke-RestMethod -Uri "$apiGatewayUrl/actuator/health" -Method Get -ErrorAction Stop
    Write-Host "Health information:" -ForegroundColor Green
    $healthResponse | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Health check failed: $_" -ForegroundColor Red
}

Write-Host "`nAPI Gateway configuration information retrieval complete" -ForegroundColor Cyan 