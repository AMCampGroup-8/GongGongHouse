# Encoding setup
$OutputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $true
chcp 65001 | Out-Null

# Restart All Services Script
Write-Host "Restarting all microservices..." -ForegroundColor Cyan

# Function to check if a port is in use
function Test-PortInUse {
    param (
        [int]$Port
    )
    
    $netstatOutput = netstat -ano | findstr ":$Port"
    return $null -ne $netstatOutput
}

# 1. Stop all services first
Write-Host "Stopping all services..." -ForegroundColor Yellow

# Find and stop all Java processes (careful approach)
$servicePorts = @(8761, 8000, 3000) # Eureka, API Gateway, Frontend
foreach ($port in $servicePorts) {
    if (Test-PortInUse -Port $port) {
        Write-Host "Stopping service on port $port..." -ForegroundColor Yellow
        $netstatOutput = netstat -ano | findstr ":$port"
        $pidMatches = [regex]::Matches($netstatOutput, "\s+(\d+)$")
        foreach ($match in $pidMatches) {
            $processId = $match.Groups[1].Value
            try {
                Stop-Process -Id $processId -Force
                Write-Host "Process ${processId} on port ${port} terminated" -ForegroundColor Green
            } catch {
                $errorMsg = $_.Exception.Message
                Write-Host "Failed to terminate process ${processId}: ${errorMsg}" -ForegroundColor Red
            }
        }
    }
}

# Also try to find services registered in Eureka (if it's running)
try {
    $eurekaApps = Invoke-RestMethod -Uri "http://localhost:8761/eureka/apps" -Headers @{"Accept"="application/json"} -ErrorAction Stop
    
    $services = $eurekaApps.applications.application
    foreach ($service in $services) {
        $serviceName = $service.name
        Write-Host "Stopping $serviceName instances..." -ForegroundColor Yellow
        
        $instances = @()
        if ($service.instance -is [System.Array]) {
            $instances = $service.instance
        } else {
            $instances = @($service.instance)
        }
        
        foreach ($instance in $instances) {
            $port = $instance.port.'$'
            $netstatOutput = netstat -ano | findstr ":${port}"
            if ($netstatOutput) {
                $pidMatches = [regex]::Matches($netstatOutput, "\s+(\d+)$")
                foreach ($match in $pidMatches) {
                    $processId = $match.Groups[1].Value
                    try {
                        Stop-Process -Id $processId -Force
                        Write-Host "Process ${processId} on port ${port} terminated" -ForegroundColor Green
                    } catch {
                        $errorMsg = $_.Exception.Message
                        Write-Host "Failed to terminate process ${processId}: ${errorMsg}" -ForegroundColor Red
                    }
                }
            }
        }
    }
} catch {
    Write-Host "Could not connect to Eureka to find running services" -ForegroundColor Yellow
}

# Wait a moment
Start-Sleep -Seconds 3

# 2. Start services in order
Write-Host "`nStarting services in order..." -ForegroundColor Cyan

# Start Eureka Server first
Write-Host "`n[1/5] Starting Eureka Server..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd BE\eureka-server && gradlew.bat bootRun" -WindowStyle Normal
Write-Host "Eureka Server start command executed." -ForegroundColor Green
Write-Host "Waiting 20 seconds for Eureka Server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# Start Auth Service
Write-Host "`n[2/5] Starting Auth Service..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd BE\auth-service && gradlew.bat bootRun" -WindowStyle Normal
Write-Host "Auth Service start command executed." -ForegroundColor Green
Write-Host "Waiting 15 seconds for Auth Service to register..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Start User Service
Write-Host "`n[3/5] Starting User Service..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd BE\user-service && gradlew.bat bootRun" -WindowStyle Normal
Write-Host "User Service start command executed." -ForegroundColor Green
Write-Host "Waiting 15 seconds for User Service to register..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Start API Gateway last
Write-Host "`n[4/5] Starting API Gateway..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd BE\api-gateway && gradlew.bat bootRun" -WindowStyle Normal
Write-Host "API Gateway start command executed." -ForegroundColor Green
Write-Host "Waiting 15 seconds for API Gateway to register..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Start Frontend
Write-Host "`n[5/5] Starting Frontend..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd FE && npm start" -WindowStyle Normal
Write-Host "Frontend start command executed." -ForegroundColor Green
Write-Host "Waiting 10 seconds for Frontend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service status
Write-Host "`nChecking service status..." -ForegroundColor Cyan
try {
    $eurekaApps = Invoke-RestMethod -Uri "http://localhost:8761/eureka/apps" -Headers @{"Accept"="application/json"} -ErrorAction Stop
    
    $services = $eurekaApps.applications.application
    Write-Host "Services registered with Eureka:" -ForegroundColor Green
    
    foreach ($service in $services) {
        $serviceName = $service.name
        
        $instances = @()
        if ($service.instance -is [System.Array]) {
            $instances = $service.instance
        } else {
            $instances = @($service.instance)
        }
        
        $instanceCount = $instances.Count
        Write-Host "`n${serviceName}: ${instanceCount} instance(s)" -ForegroundColor Cyan
        
        foreach ($inst in $instances) {
            Write-Host "  Instance ID: $($inst.instanceId)" -ForegroundColor White
            Write-Host "  Status: $($inst.status)" -ForegroundColor White
            Write-Host "  Host: $($inst.hostName)" -ForegroundColor White
            Write-Host "  Port: $($inst.port.'$')" -ForegroundColor White
        }
    }
    
    Write-Host "`nAll services started successfully!" -ForegroundColor Green
    Write-Host "Eureka Dashboard: http://localhost:8761" -ForegroundColor Magenta
    Write-Host "API Gateway: http://localhost:8000" -ForegroundColor Magenta
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor Magenta
    
} catch {
    $errorMsg = $_.Exception.Message
    Write-Host "Failed to get service status: ${errorMsg}" -ForegroundColor Red
    Write-Host "Please check each service manually." -ForegroundColor Yellow
} 