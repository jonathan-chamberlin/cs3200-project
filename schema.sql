-- Food Waste Tracker Schema
-- CS3200 Database Project
-- All tables in 3rd Normal Form (3NF)

CREATE DATABASE IF NOT EXISTS food_waste_tracker;
USE food_waste_tracker;

-- Users: people who track their food waste
CREATE TABLE Users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    phone           VARCHAR(20),
    created_time    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Categories: high-level groupings for food items (e.g. Fruit, Dairy, Grain)
CREATE TABLE Categories (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    category_name   VARCHAR(100) NOT NULL UNIQUE
);

-- FoodItems: specific foods that can be wasted, each belonging to one category
CREATE TABLE FoodItems (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    food_name       VARCHAR(255) NOT NULL,
    category_id     INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES Categories(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- WasteReasons: predefined reasons why food was wasted
CREATE TABLE WasteReasons (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    reason_description      VARCHAR(255) NOT NULL UNIQUE
);

-- FoodWasteRecords: each row is one waste event logged by a user
CREATE TABLE FoodWasteRecords (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    reason_id       INT NOT NULL,
    food_id         INT NOT NULL,
    weight          DECIMAL(10, 2) NOT NULL,
    created_time    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    waste_date      DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (reason_id) REFERENCES WasteReasons(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (food_id) REFERENCES FoodItems(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
