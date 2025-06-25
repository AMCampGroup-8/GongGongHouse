# 인코딩 설정
$OutputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $true
chcp 65001 | Out-Null

Write-Host "직접 API 호출 테스트 시작..." -ForegroundColor Cyan

# Eureka에서 Auth Service 정보 확인
try {
    Write-Host "Eureka에서 Auth Service 정보 가져오는 중..." -ForegroundColor Yellow
    $eurekaApps = Invoke-RestMethod -Uri "http://localhost:8761/eureka/apps/AUTH-SERVICE" -Headers @{"Accept"="application/json"} -ErrorAction Stop
    $authInstance = $eurekaApps.application.instance
    
    if ($authInstance) {
        $authPort = $authInstance.port.'$'
        $authHost = $authInstance.hostName
        Write-Host "Auth Service 정보:" -ForegroundColor Green
        Write-Host "호스트: $authHost, 포트: $authPort" -ForegroundColor Green
        
        # 직접 Auth Service 호출 - 원래 경로
        Write-Host "`n1. 원래 경로로 직접 호출 중..." -ForegroundColor Yellow
        $url1 = "http://${authHost}:${authPort}/api/auth/test"
        Write-Host "URL: $url1" -ForegroundColor Cyan
        try {
            $response1 = Invoke-RestMethod -Uri $url1 -Method Get -ErrorAction Stop
            Write-Host "성공: 응답" -ForegroundColor Green
            $response1 | ConvertTo-Json
        } catch {
            Write-Host "실패: $_" -ForegroundColor Red
        }
        
        # 직접 Auth Service 호출 - 다른 경로 테스트
        Write-Host "`n2. 다른 경로로 직접 호출 중..." -ForegroundColor Yellow
        $url2 = "http://${authHost}:${authPort}/test"
        Write-Host "URL: $url2" -ForegroundColor Cyan
        try {
            $response2 = Invoke-RestMethod -Uri $url2 -Method Get -ErrorAction Stop
            Write-Host "성공: 응답" -ForegroundColor Green
            $response2 | ConvertTo-Json
        } catch {
            Write-Host "실패: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "Auth Service 인스턴스를 찾을 수 없습니다." -ForegroundColor Red
    }
} catch {
    Write-Host "Eureka에서 Auth Service 정보를 가져오는데 실패했습니다: $_" -ForegroundColor Red
}

Write-Host "`n테스트 완료" -ForegroundColor Cyan 