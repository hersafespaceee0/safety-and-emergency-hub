
-----------------------------------------------------

CREATE TABLE regions (
    region_id INT NOT NULL AUTO_INCREMENT,
    region_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (region_id)
);


-- Table: users
CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20),
    PRIMARY KEY (user_id)
);

-- Table: emergency_contacts
CREATE TABLE emergency_contacts (
    contact_id INT NOT NULL AUTO_INCREMENT,
    service_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    region_id INT,
    PRIMARY KEY (contact_id),
    FOREIGN KEY (region_id) REFERENCES regions(region_id)
);

-- Table: safety_tips
CREATE TABLE safety_tips (
    tip_id INT NOT NULL AUTO_INCREMENT,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    user_id INT,
    PRIMARY KEY (tip_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Table: alerts
CREATE TABLE alerts (
    alert_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    region_id INT,
    severity VARCHAR(20),
    status VARCHAR(20),
    user_id INT,
    PRIMARY KEY (alert_id),
    FOREIGN KEY (region_id) REFERENCES regions(region_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Table: volunteers (new)
CREATE TABLE volunteers (
    volunteer_id INT NOT NULL AUTO_INCREMENT,
    request_title VARCHAR(200) NOT NULL, -- Title of the volunteer request
    request_description TEXT NOT NULL,   -- Details of what’s needed
    user_id INT,                         -- Who posted the request
    volunteer_status VARCHAR(20),        -- 'open', 'applied', 'assigned', 'closed'
    applicant_user_id INT,               -- Who applied to volunteer (if any)
    region_id INT,                       -- Where the volunteering is needed
    PRIMARY KEY (volunteer_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (applicant_user_id) REFERENCES users(user_id),
    FOREIGN KEY (region_id) REFERENCES regions(region_id)
);








