# 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

# MariaDB 설치 및 데이터베이스 생성 스크립트
Write-Host "MariaDB 설치 및 데이터베이스 생성을 시작합니다..." -ForegroundColor Green

# 1. MariaDB가 설치되어 있는지 확인
$mariadbService = Get-Service -Name "MariaDB" -ErrorAction SilentlyContinue

if ($mariadbService -eq $null) {
    Write-Host "MariaDB가 설치되어 있지 않습니다. 설치가 필요합니다." -ForegroundColor Red
    Write-Host "다음 URL에서 MariaDB를 다운로드하여 설치해주세요: https://mariadb.org/download/" -ForegroundColor Yellow
    Write-Host "설치 후 이 스크립트를 다시 실행해주세요." -ForegroundColor Yellow
    exit
}

# 2. MariaDB 서비스 실행 확인 및 시작
if ($mariadbService.Status -ne "Running") {
    Write-Host "MariaDB 서비스가 실행 중이 아닙니다. 서비스를 시작합니다..." -ForegroundColor Yellow
    Start-Service -Name "MariaDB"
    Start-Sleep -Seconds 5
}

Write-Host "MariaDB 서비스가 실행 중입니다." -ForegroundColor Green

# 3. 데이터베이스 생성 스크립트 작성
$sqlScript = @"
-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS myhomego_auth CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS myhomego_user CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS myhomego CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 사용자 생성 및 권한 부여
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY '1234';

-- 권한 부여
GRANT ALL PRIVILEGES ON myhomego_auth.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON myhomego_user.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON myhomego.* TO 'root'@'localhost';

GRANT ALL PRIVILEGES ON myhomego_auth.* TO 'root'@'127.0.0.1';
GRANT ALL PRIVILEGES ON myhomego_user.* TO 'root'@'127.0.0.1';
GRANT ALL PRIVILEGES ON myhomego.* TO 'root'@'127.0.0.1';

FLUSH PRIVILEGES;
"@

# 4. SQL 스크립트 파일 생성
$sqlScript | Out-File -FilePath "setup-database.sql" -Encoding utf8

# 5. MariaDB 명령 실행 (경로를 지정하여 실행)
Write-Host "데이터베이스 생성 중..." -ForegroundColor Cyan

# MariaDB 설치 경로 (일반적인 기본 경로)
$mariaDBPath = "C:\Program Files\MariaDB 10.11\bin"

# 경로가 존재하는지 확인
if (Test-Path $mariaDBPath) {
    # 경로가 존재하면 해당 경로의 mysql 클라이언트 사용
    Write-Host "MariaDB 경로를 찾았습니다: $mariaDBPath" -ForegroundColor Green
    
    # cmd를 통해 실행
    Start-Process -FilePath "cmd" -ArgumentList "/c chcp 65001 && `"$mariaDBPath\mysql`" -u root -p1234 -e `"source setup-database.sql`"" -Wait -NoNewWindow
} else {
    # 다른 일반적인 경로들 시도
    $possiblePaths = @(
        "C:\Program Files\MariaDB 10.10\bin",
        "C:\Program Files\MariaDB 10.9\bin",
        "C:\Program Files\MariaDB 10.8\bin",
        "C:\Program Files\MariaDB 10.7\bin",
        "C:\Program Files\MariaDB 10.6\bin",
        "C:\Program Files\MariaDB 10.5\bin",
        "C:\Program Files\MariaDB\bin"
    )
    
    $found = $false
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            Write-Host "MariaDB 경로를 찾았습니다: $path" -ForegroundColor Green
            
            # cmd를 통해 실행
            Start-Process -FilePath "cmd" -ArgumentList "/c chcp 65001 && `"$path\mysql`" -u root -p1234 -e `"source setup-database.sql`"" -Wait -NoNewWindow
            $found = $true
            break
        }
    }
    
    if (-not $found) {
        Write-Host "MariaDB 경로를 찾을 수 없습니다. 수동으로 SQL 스크립트를 실행해주세요." -ForegroundColor Red
        Write-Host "setup-database.sql 파일을 MariaDB 클라이언트에서 실행하세요." -ForegroundColor Yellow
        
        # 사용자에게 직접 명령어 입력 안내
        Write-Host "`n수동으로 실행하려면 다음 명령어를 사용하세요:" -ForegroundColor Yellow
        Write-Host "mysql -u root -p < setup-database.sql" -ForegroundColor Cyan
        Write-Host "또는 MariaDB 클라이언트에서 다음 명령어 실행:" -ForegroundColor Yellow
        Write-Host "source setup-database.sql" -ForegroundColor Cyan
    }
}

Write-Host "데이터베이스 설정이 완료되었습니다!" -ForegroundColor Green 