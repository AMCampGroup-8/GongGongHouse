CREATE TABLE member (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255),
  password VARCHAR(255),
  nickname VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE housing_announcement (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  agency VARCHAR(255),
  location VARCHAR(255),
  type VARCHAR(50),
  supply_area FLOAT,
  start_date DATE,
  end_date DATE,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE interest (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_id INT NOT NULL,
  announcement_id INT NOT NULL,
  alarm_before_days INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES member(id),
  FOREIGN KEY (announcement_id) REFERENCES housing_announcement(id)
);

CREATE TABLE board (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_id INT NOT NULL,
  title VARCHAR(255),
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES member(id)
);

CREATE TABLE comment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  board_id INT NOT NULL,
  member_id INT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES board(id),
  FOREIGN KEY (member_id) REFERENCES member(id)
);

CREATE TABLE notification (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_id INT NOT NULL,
  type VARCHAR(50),
  content TEXT,
  related_id INT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES member(id)
);

-- 테스트 데이터 예시
INSERT INTO member (email, password, nickname, created_at, updated_at)
VALUES ('test@example.com', '1234', '테스트유저', NOW(), NOW());

-- 데이터 조회 예시
SELECT * FROM member;
SELECT * FROM board;
SELECT * FROM comment;