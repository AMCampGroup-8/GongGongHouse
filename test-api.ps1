# 인코딩 설정
$OutputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $true
chcp 65001 | Out-Null

# API Test Script

$apiGatewayUrl = "http://localhost:8000"
$authServiceDirectUrl = "http://localhost:" # Port will be determined dynamically

# Function: Test API Endpoint
function Test-ApiEndpoint {
    param (
        [string]$url,
        [string]$method = "GET",
        [string]$description,
        [hashtable]$headers = @{},
        [string]$body = ""
    )
    
    Write-Host "`nTest: $description" -ForegroundColor Cyan
    Write-Host "URL: $url" -ForegroundColor Gray
    Write-Host "Method: $method" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $url
            Method = $method
            Headers = $headers
            UseBasicParsing = $true
            ErrorAction = "Stop"
        }
        
        if ($body -and $method -ne "GET") {
            $params.Add("Body", $body)
            $params.Add("ContentType", "application/json")
            Write-Host "Body: $body" -ForegroundColor Gray
        }
        
        $response = Invoke-WebRequest @params
        
        Write-Host "Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
        Write-Host "Response: $($response.Content)" -ForegroundColor White
        return $response
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $statusDescription = $_.Exception.Response
        
        Write-Host "Status: $statusCode" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $responseBody = $reader.ReadToEnd()
                Write-Host "Response: $responseBody" -ForegroundColor Red
            }
            catch {
                Write-Host "Response body could not be read: $_" -ForegroundColor Red
            }
        }
        else {
            Write-Host "Error: $_" -ForegroundColor Red
        }
        
        return $null
    }
}

# Get service port from Eureka
function Get-ServicePort {
    param (
        [string]$serviceName
    )
    
    Write-Host "Looking up $serviceName port from Eureka..." -ForegroundColor Yellow
    
    try {
        $eurekaResponse = Invoke-RestMethod -Uri "http://localhost:8761/eureka/apps" -Headers @{"Accept" = "application/json"}
        $applications = $eurekaResponse.applications.application
        
        foreach ($app in $applications) {
            if ($app.name -eq $serviceName) {
                $port = $app.instance.port.'$'
                Write-Host "$serviceName port: $port" -ForegroundColor Green
                return $port
            }
        }
        
        Write-Host "Could not find $serviceName in Eureka." -ForegroundColor Red
        return $null
    }
    catch {
        Write-Host "Error retrieving service information from Eureka: $_" -ForegroundColor Red
        return $null
    }
}

# Start Testing
Write-Host "Starting API Tests" -ForegroundColor Magenta

# 1. Check API Gateway status
Test-ApiEndpoint -url "$apiGatewayUrl/actuator/health" -description "API Gateway Health Check"

# 2. Test Auth Service (via Gateway)
Test-ApiEndpoint -url "$apiGatewayUrl/auth-service/api/auth/test" -description "Auth Service Test (via Gateway)"

# 3. Check Auth Service port and test direct connection
$authPort = Get-ServicePort -serviceName "AUTH-SERVICE"
if ($authPort) {
    $authDirectUrl = "http://localhost:$authPort"
    Test-ApiEndpoint -url "$authDirectUrl/api/auth/test" -description "Auth Service Test (direct connection)"
}

# 4. Test User Service (via Gateway)
Test-ApiEndpoint -url "$apiGatewayUrl/user-service/api/users/health" -description "User Service Test (via Gateway)"

# 5. Check User Service port and test direct connection
$userPort = Get-ServicePort -serviceName "USER-SERVICE"
if ($userPort) {
    $userDirectUrl = "http://localhost:$userPort"
    Test-ApiEndpoint -url "$userDirectUrl/api/users/health" -description "User Service Test (direct connection)"
}

Write-Host "`nAPI Tests Completed" -ForegroundColor Magenta 