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