# Food Waste Tracker - Presentation Script

**Team:** Xinxiang (Eunice), Yanjie (Candy), Xinyi, Jonathan
**Total time:** ~5 minutes

---

## Section 1: Introduction & Motivation
**Speaker:** Eunice
**On screen:** Poster (full view, then zoom to Background section)
**Time:** ~45 seconds

1.3 billion tons of food gets wasted globally every year. Your household alone probably throws out about $1,500 worth. But if you asked most people what they waste the most or why, they couldn't tell you.

Hey everyone, we're Group 18. Our project is a Food Waste Tracker. You can see our full poster here. I'll start with the motivation, then we'll walk through the database design, a demo of the app, and our findings.

We built a system that lets individuals track what they waste, browse their history, and see analytics on their patterns. Think of it like a budget tracker, but for food you're throwing out.

---

## Section 2: Database Design
**Speaker:** Candy
**On screen:** `08_er_diagram.png`
**Time:** ~1 minute

Here's our ER diagram showing the conceptual design.

We have five tables, all in Third Normal Form. At the center is FoodWasteRecords, which connects a User to a FoodItem, a WasteReason, a weight, and a date. FoodItems each belong to a Category, so things like "Banana" are under "Fruit" and "Milk" is under "Dairy."

We separated Categories, FoodItems, and WasteReasons into their own tables instead of storing strings directly in the waste records. Without normalization, you'd have the string "Dairy" repeated in every single dairy waste record. If you wanted to rename it, you'd have to update hundreds of rows. With our design, "Dairy" exists in one row in the Categories table, and everything else just references it by ID.

The foreign keys enforce referential integrity. For example, you can't log waste for a user or food item that doesn't exist. We also set CASCADE on updates and RESTRICT on deletes to prevent accidental data loss.

---

## Section 3: App Demo - Logging Waste
**Speaker:** Xinyi
**On screen:** `02_log_waste.png`
**Time:** ~45 seconds

So let me walk you through the app. This is the core screen where you log food waste.

You pick your name from the dropdown, select the food item, choose a reason like "Expired" or "Made too much," enter the weight in kilograms, and pick the date. Hit submit and it's recorded.

Behind the scenes, this runs an INSERT into FoodWasteRecords. We use parameterized queries throughout the app, meaning user input never gets concatenated into SQL strings directly. That prevents SQL injection attacks. The dropdowns are populated by SELECT queries joining FoodItems with Categories, so you see the food name alongside its category.

---

## Section 4: App Demo - History & Filtering
**Speaker:** Xinyi
**On screen:** `03_history_all.png`, then `04_history_filtered.png`
**Time:** ~45 seconds

Once you've logged some waste, you can view your full history here. It shows every record with the date, food name, category, reason, and weight.

But the real utility is in the filters. You can filter by user, by category, or by date range. So if you want to see just your dairy waste from February, you set those filters and it narrows right down.

On the backend, this is a dynamic query that builds WHERE clauses based on which filters you set. It uses JOINs across four tables to pull in all the details: FoodItems, Categories, WasteReasons, and Users.

You can also edit a record's weight or delete it entirely right from this view. Those are the UPDATE and DELETE operations.

---

## Section 5: App Demo - User & Food Management
**Speaker:** Eunice
**On screen:** `05_register.png`, then `06_add_food.png`, then `07_users.png`
**Time:** ~30 seconds

Before you can log waste, you need an account and food items in the system. Here's the registration page where you enter your name, email, and phone. And here's where you add new food items and assign them to a category.

On the Users page you can also update someone's email. So between these screens and the logging and history pages, we have full CRUD coverage: create, read, update, and delete across all our main tables.

---

## Section 6: Analytics Dashboard
**Speaker:** Jonathan
**On screen:** `01_dashboard.png`
**Time:** ~1 minute

This is the analytics dashboard, and it's where everything comes together.

Up top we have waste by category as a pie chart. In our seed data, Prepared Food and Grain are the biggest contributors. Next to that is waste by reason as a bar chart. "Made too much" and "Expired" are the top two, which tells you the main behavioral drivers.

Below that we have total waste per user and a category breakdown table showing each category's percentage of total waste.

The monthly trend chart shows how waste changes over time. And at the bottom we have a leaderboard ranking users from least to most wasteful, plus an average waste per user per month table.

All seven of these analytics come from GROUP BY queries with JOINs and aggregate functions. The category percentage uses a subquery to calculate each category's share of total waste. The monthly average uses a derived table to first get each user's monthly total, then averages across users.

In total we wrote 17 SQL queries: 6 CRUD operations for creating, updating, and deleting records across our tables, 4 history and filtering queries with dynamic WHERE clauses, and 7 analytics queries using GROUP BY, JOINs, subqueries, and derived tables.

---

## Section 7: Conclusion
**Speaker:** Candy
**On screen:** Poster (zoomed to Conclusion & Key Insights sections)
**Time:** ~30 seconds

To wrap up: we built a full-stack database application with 5 normalized tables, 17 SQL queries, and a web interface that covers the complete user journey.

Our data showed that "Made too much" and "Expired" are the top waste reasons, and Prepared Food is the most wasted category. Those are actionable findings. If you know your biggest waste driver, you can actually change your behavior.

Thanks for listening. Happy to take any questions.

---

## Speaker Assignment Summary

| Section | Speaker | Time |
|---------|---------|------|
| 1. Introduction & Motivation | Eunice | ~45s |
| 2. Database Design (ER diagram) | Candy | ~60s |
| 3. Logging Waste demo | Xinyi | ~45s |
| 4. History & Filtering demo | Xinyi | ~45s |
| 5. User & Food Management demo | Eunice | ~30s |
| 6. Analytics Dashboard | Jonathan | ~60s |
| 7. Conclusion | Candy | ~30s |
| **Total** | | **~5 min** |
