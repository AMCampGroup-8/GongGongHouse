# Encoding setup
$OutputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $true
chcp 65001 | Out-Null

# 모든 프로젝트에 대해 gradle clean build 실행
Write-Host "모든 프로젝트에 대해 gradle clean build를 실행합니다..." -ForegroundColor Cyan

# 프로젝트 디렉토리 목록
$projects = @(
    "BE\api-gateway",
    "BE\auth-service",
    "BE\eureka-server",
    "BE\user-service"
)

foreach ($project in $projects) {
    Write-Host "`n[$project] gradle clean build 실행 중..." -ForegroundColor Green
    
    # 현재 디렉토리 저장
    $currentDir = Get-Location
    
    # 프로젝트 디렉토리로 이동
    Set-Location -Path "$currentDir\$project"
    
    # gradle clean build 실행
    & .\gradlew.bat clean build
    
    # 결과 확인
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[$project] gradle clean build 성공!" -ForegroundColor Green
    } else {
        Write-Host "[$project] gradle clean build 실패!" -ForegroundColor Red
    }
    
    # 원래 디렉토리로 복귀
    Set-Location -Path $currentDir
}

Write-Host "`n모든 프로젝트의 gradle clean build가 완료되었습니다." -ForegroundColor Cyan 