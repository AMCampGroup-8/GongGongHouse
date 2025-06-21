# 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Eureka Server만 실행하는 스크립트
Write-Host "Eureka Server 시작 중..." -ForegroundColor Cyan

# 현재 실행 중인 Java 프로세스 종료
Write-Host "기존 Java 프로세스 종료 중..." -ForegroundColor Yellow
Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Eureka Server 시작
Start-Process -FilePath "cmd" -ArgumentList "/c cd BE\eureka-server && gradlew.bat bootRun" -WindowStyle Normal

Write-Host "Eureka Server 시작 명령이 실행되었습니다." -ForegroundColor Green
Write-Host "Eureka Server: http://localhost:8761" -ForegroundColor Magenta

# 10초 후 포트 확인
Start-Sleep -Seconds 10
Write-Host "`nEureka Server 포트(8761) 확인:" -ForegroundColor Cyan
netstat -ano | findstr "8761"