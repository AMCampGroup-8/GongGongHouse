# Encoding setup
$OutputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $true
chcp 65001 | Out-Null

# Simple API Gateway restart script
Write-Host "API Gateway restarting..." -ForegroundColor Cyan

# Terminate all Java processes on port 8000
Write-Host "Finding processes on port 8000..." -ForegroundColor Yellow
$netstatOutput = netstat -ano | findstr ":8000"
if ($netstatOutput) {
    $pidMatches = [regex]::Matches($netstatOutput, "\s+(\d+)$")
    foreach ($match in $pidMatches) {
    $processId = $match.Groups[1].Value
    try {
        Stop-Process -Id $processId -Force
        Write-Host "Process ${processId} terminated" -ForegroundColor Green
    } catch {
        $errorMsg = $_.Exception.Message
        Write-Host "Failed to terminate process ${processId}: ${errorMsg}" -ForegroundColor Red
    }
}
} else {
    Write-Host "No process found on port 8000" -ForegroundColor Yellow
}

# Wait a moment
Start-Sleep -Seconds 2

# Start API Gateway
Write-Host "Starting API Gateway..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd BE\api-gateway && gradlew.bat bootRun" -WindowStyle Normal

Write-Host "API Gateway start command executed." -ForegroundColor Green
Write-Host "API Gateway: http://localhost:8000" -ForegroundColor Magenta

# Check after 15 seconds
Write-Host "Waiting 15 seconds for API Gateway to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

# Check if service is registered with Eureka
Write-Host "Checking services registered with Eureka..." -ForegroundColor Cyan
try {
    $eurekaApps = Invoke-RestMethod -Uri "http://localhost:8761/eureka/apps" -Headers @{"Accept"="application/json"} -ErrorAction Stop

    # Check API Gateway instances
    $apiGatewayService = $eurekaApps.applications.application | Where-Object { $_.name -eq "API-GATEWAY" }
    if ($apiGatewayService) {
        $instances = @()
        if ($apiGatewayService.instance -is [System.Array]) {
            $instances = $apiGatewayService.instance
        } else {
            $instances = @($apiGatewayService.instance)
        }

        $instanceCount = $instances.Count
        Write-Host "Found ${instanceCount} API Gateway instance(s)" -ForegroundColor Green

        if ($instanceCount -gt 1) {
            Write-Host "WARNING: Multiple API Gateway instances detected!" -ForegroundColor Red
        }

        # Show API Gateway instances
        foreach ($inst in $instances) {
            Write-Host "  Instance ID: $($inst.instanceId)" -ForegroundColor Cyan
            Write-Host "  Status: $($inst.status)" -ForegroundColor Cyan
            Write-Host "  Host: $($inst.hostName)" -ForegroundColor Cyan
            Write-Host "  Port: $($inst.port.'$')" -ForegroundColor Cyan
            Write-Host "  URL: $($inst.homePageUrl)" -ForegroundColor Cyan
            Write-Host ""
        }
    } else {
        Write-Host "API Gateway not found in Eureka registry!" -ForegroundColor Red
    }
} catch {
    $errorMsg = $_.Exception.Message
    Write-Host "Failed to get Eureka service information: ${errorMsg}" -ForegroundColor Red
}
