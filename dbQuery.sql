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

select * from venues;
select * from venue_images;
select * from available_slots;

ALTER TABLE venues ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';
ALTER TABLE users ADD COLUMN role ENUM('admin', 'hoster', 'user', 'vendor') DEFAULT 'user';
ALTER TABLE venues ADD COLUMN owner_id INT;


select * from users;
ALTER TABLE events
	DROP COLUMN venue_name;
ALTER TABLE events
  ADD COLUMN venue_id INT,
  ADD COLUMN hoster_id INT,
  ADD FOREIGN KEY (venue_id) REFERENCES venues(id),
  ADD FOREIGN KEY (hoster_id) REFERENCES users(id);
  
ALTER TABLE users MODIFY COLUMN role ENUM('user', 'hoster', 'admin', 'vendor');
  
ALTER TABLE users MODIFY role ENUM('admin', 'hoster', 'attendee', 'vendor', 'user') NOT NULL;
-- we choose the existing users because we are in the safe mode and modifying won't work directly
UPDATE users SET role = 'attendee' WHERE id IN (5, 7, 9);
ALTER TABLE users MODIFY role ENUM('admin', 'hoster', 'attendee', 'vendor') NOT NULL;

