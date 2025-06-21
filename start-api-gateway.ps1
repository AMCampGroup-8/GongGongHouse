# 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

# API Gateway 실행 스크립트
Write-Host "API Gateway 시작 중..." -ForegroundColor Cyan

# 현재 실행 중인 Java 프로세스 확인 (선택적으로 종료)
Write-Host "기존 Java 프로세스 확인 중..." -ForegroundColor Yellow
$javaProcesses = Get-Process -Name java -ErrorAction SilentlyContinue
if ($javaProcesses) {
    Write-Host "실행 중인 Java 프로세스가 있습니다. 필요시 종료하세요." -ForegroundColor Yellow
}

# API Gateway 시작
Write-Host "API Gateway 시작 중..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\api-gateway && gradlew.bat bootRun" -WindowStyle Normal

Write-Host "API Gateway 시작 명령이 실행되었습니다." -ForegroundColor Green
Write-Host "API Gateway: http://localhost:8000" -ForegroundColor Magenta

# 5초 후 포트 확인
Start-Sleep -Seconds 5
Write-Host "`n실행 중인 Java 프로세스:" -ForegroundColor Cyan
Get-Process -Name java -ErrorAction SilentlyContinue | Format-Table Id, ProcessName, Path 