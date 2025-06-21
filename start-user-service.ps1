# 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# user-service만 실행하는 스크립트
Write-Host "User Service 시작 중..." -ForegroundColor Cyan

# 현재 실행 중인 Java 프로세스 확인 (선택적으로 종료)
Write-Host "기존 Java 프로세스 확인 중..." -ForegroundColor Yellow
$javaProcesses = Get-Process -Name java -ErrorAction SilentlyContinue
if ($javaProcesses) {
    Write-Host "실행 중인 Java 프로세스가 있습니다. 필요시 종료하세요." -ForegroundColor Yellow
}

# User Service 시작
Write-Host "User Service 시작 중..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\user-service && gradlew.bat bootRun" -WindowStyle Normal

Write-Host "User Service 시작 명령이 실행되었습니다." -ForegroundColor Green
Write-Host "User Service는 동적 포트를 사용합니다. Eureka 대시보드에서 확인하세요." -ForegroundColor Magenta
Write-Host "Eureka 대시보드: http://localhost:8761" -ForegroundColor Magenta

# 5초 후 포트 확인
Start-Sleep -Seconds 5
Write-Host "`n실행 중인 Java 프로세스:" -ForegroundColor Cyan
Get-Process -Name java -ErrorAction SilentlyContinue | Format-Table Id, ProcessName, Path 