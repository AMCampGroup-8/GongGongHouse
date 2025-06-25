# Encoding setup
$OutputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $true
chcp 65001 | Out-Null

# Auth Service restart script
Write-Host "Auth Service restarting..." -ForegroundColor Cyan

# Find and terminate all Auth Service instances
Write-Host "Finding Auth Service instances in Eureka..." -ForegroundColor Yellow
try {
    $eurekaApps = Invoke-RestMethod -Uri "http://localhost:8761/eureka/apps/AUTH-SERVICE" -Headers @{"Accept"="application/json"} -ErrorAction Stop
    
    $instances = @()
    if ($eurekaApps.application.instance -is [System.Array]) {
        $instances = $eurekaApps.application.instance
    } else {
        $instances = @($eurekaApps.application.instance)
    }
    
    foreach ($instance in $instances) {
        $port = $instance.port.'$'
        Write-Host "Found Auth Service instance on port ${port}" -ForegroundColor Yellow
        
        # Find and terminate process on this port
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
} catch {
    Write-Host "No Auth Service instances found in Eureka or Eureka is not running" -ForegroundColor Yellow
    
    # Try to find any Java process that might be Auth Service
    Write-Host "Searching for potential Auth Service processes..." -ForegroundColor Yellow
    $javaProcesses = Get-Process -Name java -ErrorAction SilentlyContinue
    if ($javaProcesses) {
        Write-Host "Found Java processes. Please check manually if any of these are Auth Service instances." -ForegroundColor Yellow
    }
}

# Wait a moment
Start-Sleep -Seconds 2

# Start Auth Service
Write-Host "Starting Auth Service..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd BE\auth-service && gradlew.bat bootRun" -WindowStyle Normal

Write-Host "Auth Service start command executed." -ForegroundColor Green

# Check after 15 seconds
Write-Host "Waiting 15 seconds for Auth Service to register with Eureka..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

# Check if service is registered with Eureka
Write-Host "Checking if Auth Service is registered with Eureka..." -ForegroundColor Cyan
try {
    $eurekaApps = Invoke-RestMethod -Uri "http://localhost:8761/eureka/apps/AUTH-SERVICE" -Headers @{"Accept"="application/json"} -ErrorAction Stop
    
    $instances = @()
    if ($eurekaApps.application.instance -is [System.Array]) {
        $instances = $eurekaApps.application.instance
    } else {
        $instances = @($eurekaApps.application.instance)
    }
    
    $instanceCount = $instances.Count
    Write-Host "Found ${instanceCount} Auth Service instance(s)" -ForegroundColor Green
    
    # Show Auth Service instances
    foreach ($inst in $instances) {
        Write-Host "  Instance ID: $($inst.instanceId)" -ForegroundColor Cyan
        Write-Host "  Status: $($inst.status)" -ForegroundColor Cyan
        Write-Host "  Host: $($inst.hostName)" -ForegroundColor Cyan
        Write-Host "  Port: $($inst.port.'$')" -ForegroundColor Cyan
        Write-Host "  URL: $($inst.homePageUrl)" -ForegroundColor Cyan
        Write-Host ""
    }
} catch {
    $errorMsg = $_.Exception.Message
    Write-Host "Failed to find Auth Service in Eureka registry: ${errorMsg}" -ForegroundColor Red
} 