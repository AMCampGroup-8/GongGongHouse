# Docker 배포 스크립트
Write-Host "Docker 배포를 시작합니다..." -ForegroundColor Cyan

# 필요한 디렉토리 생성
if (-not (Test-Path "DB")) {
    New-Item -Path "DB" -ItemType Directory -Force | Out-Null
    Write-Host "DB 디렉토리를 생성했습니다." -ForegroundColor Yellow
}

# Docker가 설치되어 있는지 확인
try {
    docker --version
    Write-Host "Docker가 설치되어 있습니다." -ForegroundColor Green
}
catch {
    Write-Host "Docker가 설치되어 있지 않습니다. Docker Desktop을 설치해주세요." -ForegroundColor Red
    exit 1
}

# Docker Compose가 설치되어 있는지 확인
try {
    docker-compose --version
    Write-Host "Docker Compose가 설치되어 있습니다." -ForegroundColor Green
}
catch {
    Write-Host "Docker Compose가 설치되어 있지 않습니다. Docker Compose를 설치해주세요." -ForegroundColor Red
    exit 1
}

# 기존 컨테이너 종료 및 삭제
Write-Host "기존 컨테이너를 종료하고 삭제합니다..." -ForegroundColor Yellow
docker-compose down

# 이미지 빌드 및 컨테이너 실행
Write-Host "Docker 이미지를 빌드하고 컨테이너를 실행합니다..." -ForegroundColor Yellow
docker-compose up -d --build

# 컨테이너 상태 확인
Write-Host "컨테이너 상태를 확인합니다..." -ForegroundColor Yellow
docker-compose ps

Write-Host "Docker 배포가 완료되었습니다." -ForegroundColor Green
Write-Host "Eureka Server: http://localhost:8761" -ForegroundColor Cyan
Write-Host "API Gateway: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost" -ForegroundColor Cyan 