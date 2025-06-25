# Encoding setup
$OutputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $true
chcp 65001 | Out-Null

# MariaDB 경로 찾기
$mariaDBPaths = @(
    "C:\Program Files\MariaDB 10.11\bin",
    "C:\Program Files\MariaDB 10.10\bin",
    "C:\Program Files\MariaDB 10.9\bin",
    "C:\Program Files\MariaDB 10.8\bin",
    "C:\Program Files\MariaDB 10.7\bin",
    "C:\Program Files\MariaDB 10.6\bin",
    "C:\Program Files\MariaDB 10.5\bin",
    "C:\Program Files\MariaDB\bin"
)

$mysqlPath = $null
foreach ($path in $mariaDBPaths) {
    if (Test-Path "$path\mysql.exe") {
        $mysqlPath = "$path\mysql.exe"
        Write-Host "MariaDB 클라이언트를 찾았습니다: $mysqlPath" -ForegroundColor Green
        break
    }
}

if (-not $mysqlPath) {
    Write-Host "MariaDB 클라이언트를 찾을 수 없습니다." -ForegroundColor Red
    exit
}

# SQL 명령 작성
$sqlCommands = @"
USE myhomego_user;
SHOW TABLES;
DESCRIBE users;
"@

# SQL 명령을 파일에 저장
$sqlCommands | Out-File -FilePath "check-table.sql" -Encoding utf8

# MariaDB 명령 실행
Write-Host "테이블 구조 확인 중..." -ForegroundColor Cyan
& $mysqlPath -u root -p1234 < check-table.sql

# 임시 파일 삭제
Remove-Item -Path "check-table.sql" 