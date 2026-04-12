# Food Waste Tracker — Poster Presentation Script (Part 1)

**Team:** Xinxiang (Eunice), Yanjie (Candy), Xinyi, Jonathan
**Format:** Poster walkthrough, ~13 minutes total
**This part:** Setup + queries (~6.5 minutes)

---

### Introduction & Motivation (~1.5 min)
**Point at:** Background, Motivation, and Goals section (top left of poster)

Hey everyone, we're Group 18. We built a Food Waste Tracker.

About 1.3 billion tons of food gets wasted globally every year. The average household throws out around $1,500 worth annually. But if you asked most people what they personally waste the most, or why, they couldn't tell you.

That's the problem we wanted to solve. We built a system where individuals can log what they throw out, browse their history, and see analytics on their own patterns. Think of it like a budget tracker, but for food you're throwing out. The idea is that if you can actually see what you waste, you can change your behavior. Right now, people don't have that visibility.

But recording data alone isn't useful. The goal was to surface patterns. What categories of food are you wasting the most? What's the reason? Is it because you're cooking too much, or because things are expiring before you get to them? Those are different problems with different solutions, and you need the data to tell them apart.

### Database Design (~2 min)
**Point at:** ER diagram (top right of poster), then Process, Methods and System section

Here's our ER diagram. We have five tables, all in Third Normal Form.

FoodWasteRecords is the central table. Each record connects a User to a FoodItem, a WasteReason, a weight, and a date. FoodItems each belong to a Category, so "Banana" is under "Fruit," "Milk" is under "Dairy." Users is its own entity because a user exists independently of any waste they log.

We separated Categories, FoodItems, and WasteReasons into their own tables instead of storing strings directly in the waste records. Without normalization, you'd have the string "Dairy" repeated in every single dairy waste record. If you wanted to rename it to something like "Dairy Products," you'd have to update hundreds of rows. But with our design, "Dairy" exists in one row in the Categories table and everything else references it by ID. That eliminates redundancy and keeps the data consistent.

The foreign keys enforce referential integrity. You can't log waste for a user or food item that doesn't exist in the system. We set CASCADE on updates so if you rename a category, every reference updates automatically. And RESTRICT on deletes, so you can't accidentally delete a food item that has waste records pointing to it. That prevents data loss.

We also knew users would want to filter by category, so having Categories as a separate indexed table makes those filter queries fast.

### Queries (~3 min)
**Point at:** Example Queries section (middle of poster)

We wrote 17 SQL queries total. I'll walk through the three main groups.

**CRUD operations.** Six queries handle the basics. INSERT for logging new waste records, registering users, and adding food items. SELECT with JOINs for populating the dropdowns and viewing records. UPDATE for editing a record's weight or a user's email. DELETE for removing records. All of these use parameterized queries with percent-s placeholders, so user input never gets concatenated into SQL strings directly. That prevents SQL injection.

**History and filtering.** Four queries handle browsing your waste history. The base query joins across four tables (FoodWasteRecords, FoodItems, Categories, WasteReasons, and Users) to show every record with the food name, category, reason, and weight. Then we built dynamic filtering on top of that. The app builds WHERE clauses based on which filters you set. So you can filter by user, by category, or by date range. If you want to see just your dairy waste from February, you set those filters and it narrows right down.

**Analytics.** Seven queries power the dashboard, and these are the most interesting ones. They all use GROUP BY with JOINs and aggregate functions.

Query 16 is a good example. It answers: what percentage of total waste does each food category account for? It joins FoodWasteRecords to FoodItems to Categories, groups by category, sums the weight, then divides each category's total by a subquery that gets the overall total. This gives you a percentage breakdown.

Query 17 uses a derived table. The inner query gets each user's monthly total waste. The outer query averages across all users. So you can see the average waste per person per month and compare yourself against that.

The other analytics queries cover waste by reason as a bar chart, total waste per user, monthly trends over time, and a leaderboard ranking users from least to most wasteful.
