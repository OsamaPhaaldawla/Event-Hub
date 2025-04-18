CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role ENUM('attendee', 'hoster', 'admin') DEFAULT 'attendee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users MODIFY role ENUM('user', 'hoster', 'admin') NOT NULL;

select * from events;

ALTER TABLE events
MODIFY COLUMN date DATE;


select * from users;
ALTER TABLE events
	DROP COLUMN venue_name;
ALTER TABLE events
  ADD COLUMN venue_id INT,
  ADD COLUMN hoster_id INT,
  ADD FOREIGN KEY (venue_id) REFERENCES venues(id),
  ADD FOREIGN KEY (hoster_id) REFERENCES users(id);
  
  