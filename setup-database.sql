-- ?곗씠?곕쿋?댁뒪 ?앹꽦
CREATE DATABASE IF NOT EXISTS myhomego_auth CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS myhomego_user CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS myhomego CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ?ъ슜???앹꽦 諛?沅뚰븳 遺??
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY '1234';

-- 沅뚰븳 遺??
GRANT ALL PRIVILEGES ON myhomego_auth.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON myhomego_user.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON myhomego.* TO 'root'@'localhost';

GRANT ALL PRIVILEGES ON myhomego_auth.* TO 'root'@'127.0.0.1';
GRANT ALL PRIVILEGES ON myhomego_user.* TO 'root'@'127.0.0.1';
GRANT ALL PRIVILEGES ON myhomego.* TO 'root'@'127.0.0.1';

FLUSH PRIVILEGES;

-- 기존 데이터베이스 삭제 후 재생성
DROP DATABASE IF EXISTS myhomego_user;
CREATE DATABASE myhomego_user CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 권한 다시 부여
GRANT ALL PRIVILEGES ON myhomego_user.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON myhomego_user.* TO 'root'@'127.0.0.1';

FLUSH PRIVILEGES;
