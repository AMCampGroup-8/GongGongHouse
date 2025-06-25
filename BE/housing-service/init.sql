CREATE DATABASE IF NOT EXISTS housing_db;
CREATE USER IF NOT EXISTS 'housing_user'@'%' IDENTIFIED BY 'housing_pass';
GRANT ALL PRIVILEGES ON housing_db.* TO 'housing_user'@'%';
FLUSH PRIVILEGES;
