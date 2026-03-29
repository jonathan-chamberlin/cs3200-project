-- SQL Queries for Food Waste Tracker
-- CS3200 Database Project
-- Organized by: CRUD, History (user journey), Analytics (user journey)

USE food_waste_tracker;

-- =============================================================================
-- SECTION 1: CRUD OPERATIONS
-- =============================================================================

-- -----------------------------------------------
-- Q1: Register a new user
-- Used when a new person signs up for the app.
-- -----------------------------------------------
INSERT INTO Users (first_name, last_name, email, phone)
VALUES ('Frank', 'Lee', 'frank.lee@example.com', '617-555-0200');

-- -----------------------------------------------
-- Q2: Add a new food item to the catalog
-- Users can add foods that don't exist yet before logging waste.
-- The food must belong to an existing category.
-- -----------------------------------------------
INSERT INTO FoodItems (food_name, category_id)
VALUES ('Blueberries', 1);

-- -----------------------------------------------
-- Q3: Log a food waste record
-- Core action: a user records that they wasted food.
-- They pick from existing food items and waste reasons.
-- -----------------------------------------------
INSERT INTO FoodWasteRecords (user_id, reason_id, food_id, weight, waste_date)
VALUES (1, 2, 5, 0.45, '2026-03-25');

-- -----------------------------------------------
-- Q4: Update the weight of a waste record
-- User realizes they entered the wrong weight.
-- -----------------------------------------------
UPDATE FoodWasteRecords
SET weight = 0.60
WHERE id = 1;

-- -----------------------------------------------
-- Q5: Delete a waste record
-- User logged a record by mistake.
-- -----------------------------------------------
DELETE FROM FoodWasteRecords
WHERE id = 1;

-- -----------------------------------------------
-- Q6: Update a user's email
-- User wants to change their email address.
-- -----------------------------------------------
UPDATE Users
SET email = 'alice.chen.new@example.com'
WHERE id = 1;


-- =============================================================================
-- SECTION 2: HISTORY QUERIES (User Journey: "View History")
-- =============================================================================

-- -----------------------------------------------
-- Q7: View all waste records for a specific user
-- Shows full details including food name, category, reason, and date.
-- Supports the "Open History" screen in the app.
-- -----------------------------------------------
SELECT
    fwr.id           AS record_id,
    fi.food_name,
    c.category_name,
    wr.reason_description,
    fwr.weight,
    fwr.waste_date,
    fwr.created_time
FROM FoodWasteRecords fwr
    JOIN FoodItems fi    ON fwr.food_id   = fi.id
    JOIN Categories c    ON fi.category_id = c.id
    JOIN WasteReasons wr ON fwr.reason_id  = wr.id
WHERE fwr.user_id = 1
ORDER BY fwr.waste_date DESC;

-- -----------------------------------------------
-- Q8: Filter waste records by date range
-- User wants to see what they wasted in February 2026.
-- -----------------------------------------------
SELECT
    fi.food_name,
    c.category_name,
    wr.reason_description,
    fwr.weight,
    fwr.waste_date
FROM FoodWasteRecords fwr
    JOIN FoodItems fi    ON fwr.food_id   = fi.id
    JOIN Categories c    ON fi.category_id = c.id
    JOIN WasteReasons wr ON fwr.reason_id  = wr.id
WHERE fwr.user_id = 1
    AND fwr.waste_date BETWEEN '2026-02-01' AND '2026-02-28'
ORDER BY fwr.waste_date DESC;

-- -----------------------------------------------
-- Q9: Filter waste records by category
-- User wants to see all dairy they wasted.
-- -----------------------------------------------
SELECT
    fi.food_name,
    wr.reason_description,
    fwr.weight,
    fwr.waste_date
FROM FoodWasteRecords fwr
    JOIN FoodItems fi    ON fwr.food_id   = fi.id
    JOIN Categories c    ON fi.category_id = c.id
    JOIN WasteReasons wr ON fwr.reason_id  = wr.id
WHERE fwr.user_id = 1
    AND c.category_name = 'Dairy'
ORDER BY fwr.waste_date DESC;

-- -----------------------------------------------
-- Q10: Browse all available food items with their categories
-- Shown when a user wants to add a new food item or pick one to log.
-- -----------------------------------------------
SELECT
    fi.id AS food_id,
    fi.food_name,
    c.category_name
FROM FoodItems fi
    JOIN Categories c ON fi.category_id = c.id
ORDER BY c.category_name, fi.food_name;


-- =============================================================================
-- SECTION 3: ANALYTICS QUERIES (User Journey: "View Analytics")
-- =============================================================================

-- -----------------------------------------------
-- Q11: Total weight wasted per user
-- Shows each user's total waste to support a personal dashboard.
-- -----------------------------------------------
SELECT
    u.first_name,
    u.last_name,
    SUM(fwr.weight) AS total_weight_wasted
FROM FoodWasteRecords fwr
    JOIN Users u ON fwr.user_id = u.id
GROUP BY u.id, u.first_name, u.last_name
ORDER BY total_weight_wasted DESC;

-- -----------------------------------------------
-- Q12: Most wasted food category overall
-- Identifies which category contributes the most waste.
-- -----------------------------------------------
SELECT
    c.category_name,
    SUM(fwr.weight)  AS total_weight,
    COUNT(*)          AS record_count
FROM FoodWasteRecords fwr
    JOIN FoodItems fi ON fwr.food_id   = fi.id
    JOIN Categories c ON fi.category_id = c.id
GROUP BY c.id, c.category_name
ORDER BY total_weight DESC;

-- -----------------------------------------------
-- Q13: Waste breakdown by reason
-- Shows which reasons cause the most waste — helps users identify habits.
-- -----------------------------------------------
SELECT
    wr.reason_description,
    SUM(fwr.weight)  AS total_weight,
    COUNT(*)          AS record_count
FROM FoodWasteRecords fwr
    JOIN WasteReasons wr ON fwr.reason_id = wr.id
GROUP BY wr.id, wr.reason_description
ORDER BY total_weight DESC;

-- -----------------------------------------------
-- Q14: Monthly waste trend for a specific user
-- Shows how a user's waste changes over time — supports trend charts.
-- -----------------------------------------------
SELECT
    DATE_FORMAT(fwr.waste_date, '%Y-%m') AS month,
    SUM(fwr.weight)                      AS total_weight,
    COUNT(*)                             AS record_count
FROM FoodWasteRecords fwr
WHERE fwr.user_id = 1
GROUP BY DATE_FORMAT(fwr.waste_date, '%Y-%m')
ORDER BY month;

-- -----------------------------------------------
-- Q15: Leaderboard — least wasteful users
-- Ranks users by total waste (ascending). Could motivate users to reduce waste.
-- -----------------------------------------------
SELECT
    u.first_name,
    u.last_name,
    COALESCE(SUM(fwr.weight), 0) AS total_weight_wasted
FROM Users u
    LEFT JOIN FoodWasteRecords fwr ON u.id = fwr.user_id
GROUP BY u.id, u.first_name, u.last_name
ORDER BY total_weight_wasted ASC;

-- -----------------------------------------------
-- Q16: Category breakdown with percentage of total waste
-- Shows each category's share of all waste — useful for pie charts.
-- -----------------------------------------------
SELECT
    c.category_name,
    SUM(fwr.weight) AS category_weight,
    ROUND(
        SUM(fwr.weight) / (SELECT SUM(weight) FROM FoodWasteRecords) * 100,
        1
    ) AS percentage_of_total
FROM FoodWasteRecords fwr
    JOIN FoodItems fi ON fwr.food_id   = fi.id
    JOIN Categories c ON fi.category_id = c.id
GROUP BY c.id, c.category_name
ORDER BY category_weight DESC;

-- -----------------------------------------------
-- Q17: Average waste per user per month
-- Useful for benchmarking: "You waste X kg/month vs. average Y kg/month."
-- -----------------------------------------------
SELECT
    user_monthly.month,
    ROUND(AVG(user_monthly.monthly_total), 2) AS avg_waste_per_user
FROM (
    SELECT
        user_id,
        DATE_FORMAT(waste_date, '%Y-%m') AS month,
        SUM(weight) AS monthly_total
    FROM FoodWasteRecords
    GROUP BY user_id, DATE_FORMAT(waste_date, '%Y-%m')
) AS user_monthly
GROUP BY user_monthly.month
ORDER BY user_monthly.month;
