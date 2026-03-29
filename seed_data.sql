-- Seed Data for Food Waste Tracker
-- CS3200 Database Project

USE food_waste_tracker;

-- =====================
-- Users
-- =====================
INSERT INTO Users (first_name, last_name, email, phone) VALUES
    ('Alice',    'Chen',      'alice.chen@example.com',    '617-555-0101'),
    ('Bob',      'Martinez',  'bob.martinez@example.com',  '617-555-0102'),
    ('Carol',    'Nguyen',    'carol.nguyen@example.com',  '617-555-0103'),
    ('David',    'Okafor',    'david.okafor@example.com',  NULL),
    ('Emily',    'Smith',     'emily.smith@example.com',   '617-555-0105');

-- =====================
-- Categories
-- =====================
INSERT INTO Categories (category_name) VALUES
    ('Fruit'),
    ('Vegetable'),
    ('Dairy'),
    ('Grain'),
    ('Meat'),
    ('Seafood'),
    ('Beverage'),
    ('Prepared Food');

-- =====================
-- FoodItems
-- =====================
INSERT INTO FoodItems (food_name, category_id) VALUES
    -- Fruit (category 1)
    ('Banana',       1),
    ('Apple',        1),
    ('Strawberries', 1),
    ('Avocado',      1),
    -- Vegetable (category 2)
    ('Lettuce',      2),
    ('Tomato',       2),
    ('Spinach',      2),
    ('Carrots',      2),
    -- Dairy (category 3)
    ('Milk',         3),
    ('Yogurt',       3),
    ('Cheese',       3),
    -- Grain (category 4)
    ('Bread',        4),
    ('Rice',         4),
    ('Pasta',        4),
    -- Meat (category 5)
    ('Chicken',      5),
    ('Ground Beef',  5),
    -- Seafood (category 6)
    ('Salmon',       6),
    ('Shrimp',       6),
    -- Beverage (category 7)
    ('Orange Juice', 7),
    ('Milk Tea',     7),
    -- Prepared Food (category 8)
    ('Leftover Pizza',  8),
    ('Leftover Soup',   8);

-- =====================
-- WasteReasons
-- =====================
INSERT INTO WasteReasons (reason_description) VALUES
    ('Expired'),
    ('Spoiled'),
    ('Overcooked'),
    ('Leftover - not eaten'),
    ('Damaged packaging'),
    ('Forgot in fridge'),
    ('Made too much'),
    ('Did not like taste');

-- =====================
-- FoodWasteRecords
-- =====================
-- Spread across Jan-Mar 2026 for trend analysis
INSERT INTO FoodWasteRecords (user_id, reason_id, food_id, weight, waste_date) VALUES
    -- Alice (user 1) - 6 records
    (1, 1, 9,  0.50, '2026-01-05'),   -- Expired milk
    (1, 2, 5,  0.30, '2026-01-12'),   -- Spoiled lettuce
    (1, 6, 3,  0.25, '2026-01-28'),   -- Forgot strawberries in fridge
    (1, 1, 10, 0.20, '2026-02-10'),   -- Expired yogurt
    (1, 4, 21, 1.50, '2026-02-22'),   -- Leftover pizza not eaten
    (1, 7, 13, 0.80, '2026-03-15'),   -- Made too much rice

    -- Bob (user 2) - 5 records
    (2, 2, 1,  0.40, '2026-01-08'),   -- Spoiled banana
    (2, 7, 14, 0.60, '2026-01-20'),   -- Made too much pasta
    (2, 1, 11, 0.35, '2026-02-05'),   -- Expired cheese
    (2, 3, 15, 0.50, '2026-02-18'),   -- Overcooked chicken
    (2, 6, 4,  0.30, '2026-03-10'),   -- Forgot avocado in fridge

    -- Carol (user 3) - 5 records
    (3, 4, 22, 0.90, '2026-01-15'),   -- Leftover soup not eaten
    (3, 2, 7,  0.20, '2026-01-30'),   -- Spoiled spinach
    (3, 1, 12, 0.40, '2026-02-12'),   -- Expired bread
    (3, 5, 16, 0.55, '2026-02-28'),   -- Damaged ground beef packaging
    (3, 7, 13, 0.70, '2026-03-20'),   -- Made too much rice

    -- David (user 4) - 4 records
    (4, 6, 17, 0.45, '2026-01-22'),   -- Forgot salmon in fridge
    (4, 8, 20, 0.30, '2026-02-08'),   -- Did not like milk tea taste
    (4, 1, 9,  0.50, '2026-02-25'),   -- Expired milk
    (4, 2, 6,  0.35, '2026-03-18'),   -- Spoiled tomato

    -- Emily (user 5) - 5 records
    (5, 7, 12, 0.60, '2026-01-10'),   -- Made too much bread
    (5, 4, 21, 1.20, '2026-01-25'),   -- Leftover pizza not eaten
    (5, 1, 18, 0.40, '2026-02-14'),   -- Expired shrimp
    (5, 2, 2,  0.30, '2026-03-01'),   -- Spoiled apple
    (5, 6, 8,  0.25, '2026-03-22');   -- Forgot carrots in fridge
