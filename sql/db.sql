-- Create DB
CREATE DATABASE IF NOT EXISTS eventhub;
USE eventhub;

-- Users (students)
CREATE TABLE IF NOT EXISTS user_account (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  prn VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Faculty
CREATE TABLE IF NOT EXISTS faculty (
  faculty_id INT AUTO_INCREMENT PRIMARY KEY,
  faculty_name VARCHAR(100) NOT NULL,
  faculty_email VARCHAR(255) UNIQUE,
  faculty_prn VARCHAR(100) UNIQUE,
  dept_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Department
CREATE TABLE IF NOT EXISTS department (
  dept_id INT AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(100) NOT NULL
);

-- Venue
CREATE TABLE IF NOT EXISTS venue (
  venue_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  capacity INT
);

-- Event Type
CREATE TABLE IF NOT EXISTS eventtype (
  type_id INT AUTO_INCREMENT PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL
);

-- Events
CREATE TABLE IF NOT EXISTS event (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATETIME,
  end_date DATETIME,
  venue_id INT,
  type_id INT,
  is_paid TINYINT(1) DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venue(venue_id) ON DELETE SET NULL,
  FOREIGN KEY (type_id) REFERENCES eventtype(type_id) ON DELETE SET NULL
);

ALTER TABLE event ADD COLUMN registered_count INT DEFAULT 0;

-- Registration (users registering for events) — M:N resolved
CREATE TABLE IF NOT EXISTS registration (
  registration_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  extra_info TEXT,
  FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE,
  UNIQUE KEY user_event_unique (user_id, event_id)
);

-- Event Coordinator (faculty coordinates event) — M:N
CREATE TABLE IF NOT EXISTS event_coordinator (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  faculty_id INT NOT NULL,
  FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE,
  FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE,
  UNIQUE KEY event_faculty_unique (event_id, faculty_id)
);

-- Sponsor (optional)
CREATE TABLE IF NOT EXISTS sponsor (
  sponsor_id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255),
  contact_email VARCHAR(255),
  event_id INT,
  FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE SET NULL
);

-- Feedback (optional)
CREATE TABLE IF NOT EXISTS feedback (
  feedback_id INT AUTO_INCREMENT PRIMARY KEY,
  rating INT,
  submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  registration_id INT,
  notes TEXT,
  FOREIGN KEY (registration_id) REFERENCES registration(registration_id) ON DELETE SET NULL
);
ALTER TABLE faculty ADD COLUMN faculty_password_hash VARCHAR(255);

CREATE USER IF NOT EXISTS 'eventhub_user'@'localhost' IDENTIFIED BY 'Keosha22@';
GRANT ALL PRIVILEGES ON eventhub.* TO 'eventhub_user'@'localhost';
FLUSH PRIVILEGES;

ALTER TABLE event ADD COLUMN status ENUM('upcoming','ongoing','completed') DEFAULT 'upcoming';

DELIMITER $$

CREATE TRIGGER after_registration_insert
AFTER INSERT ON registration
FOR EACH ROW
BEGIN
    UPDATE event
    SET registered_count = registered_count + 1
    WHERE event_id = NEW.event_id;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER after_registration_delete
AFTER DELETE ON registration
FOR EACH ROW
BEGIN
    UPDATE event
    SET registered_count = registered_count - 1
    WHERE event_id = OLD.event_id;
END$$

DELIMITER ;
select*from user_account;	