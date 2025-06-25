# Encoding setup
$OutputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $true
chcp 65001 | Out-Null

# Eureka Server restart script
Write-Host "Eureka Server restarting..." -ForegroundColor Cyan

# Terminate all Java processes on port 8761
Write-Host "Finding processes on port 8761..." -ForegroundColor Yellow
$netstatOutput = netstat -ano | findstr ":8761"
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
    Write-Host "No process found on port 8761" -ForegroundColor Yellow
}

# Wait a moment
Start-Sleep -Seconds 2

# Start Eureka Server
Write-Host "Starting Eureka Server..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd BE\eureka-server && gradlew.bat bootRun" -WindowStyle Normal

Write-Host "Eureka Server start command executed." -ForegroundColor Green
Write-Host "Eureka Server: http://localhost:8761" -ForegroundColor Magenta

# Check after 15 seconds
Write-Host "Waiting 15 seconds for Eureka Server to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

# Check if Eureka Server is running
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8761/actuator/health" -ErrorAction Stop
    if ($response.status -eq "UP") {
        Write-Host "Eureka Server is running and healthy!" -ForegroundColor Green
    } else {
        Write-Host "Eureka Server is running but may have issues. Status: $($response.status)" -ForegroundColor Yellow
    }
} catch {
    $errorMsg = $_.Exception.Message
    Write-Host "Failed to connect to Eureka Server: ${errorMsg}" -ForegroundColor Red
} 