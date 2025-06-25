-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS myhomego_auth;
CREATE DATABASE IF NOT EXISTS myhomego_user;

-- 권한 설정
GRANT ALL PRIVILEGES ON myhomego_auth.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON myhomego_user.* TO 'root'@'%';
FLUSH PRIVILEGES; 