# Poster Q&A Prep

Questions a professor or TA might ask at the poster session, with answers any team member can give.

---

### 1. Why did you choose this topic? Why does it matter?

About a third of all food produced globally gets wasted every year. That's a massive problem, but most people have no idea what they personally throw out or why. We wanted to build something that makes that visible. The app lets you log what you waste, see your history, and look at analytics so you can actually spot patterns and change your behavior. It's like a budget tracker but for food.

---

### 2. Walk me through your ER diagram. Why these tables?

FoodWasteRecords is the central table. Each record links a User to a FoodItem, a WasteReason, a weight, and a date. FoodItems each belong to a Category, so "Banana" maps to "Fruit" and "Milk" maps to "Dairy." We pulled Categories, FoodItems, and WasteReasons into their own tables because those are reusable lookup data that multiple records reference. Users is its own entity since a user exists independently of any waste they log. So five tables total, all connected through foreign keys.

---

### 3. How did you normalize your tables? What normal form?

All five tables are in Third Normal Form. The easiest way to see it: if we had stored category_name directly in FoodWasteRecords, that would create a transitive dependency. The category name depends on the food item, not on the waste record. So we broke it into its own table. FoodItems references Categories by ID, and WasteReasons is separate for the same reason. Each table stores exactly one kind of thing, and no column depends on anything other than that table's primary key. We also knew users would want to filter by category, so having Categories as a separate indexed table makes those filter queries fast.

---

### 4. Why did you separate Categories (or WasteReasons) into its own table instead of storing it inline?

If we stored the string "Dairy" directly in every waste record, we'd have the same string repeated dozens of times. If someone wanted to rename "Dairy" to "Dairy Products," you'd have to update every single row. With our design, "Dairy" exists in one row in the Categories table and everything else references it by ID. That eliminates redundancy and makes the data consistent. It also means we can add new categories without touching the waste records at all.

---

### 5. Show me an interesting query. What question does it answer?

Query 16 is a good one. It answers: "What percentage of total waste does each food category account for?" It joins FoodWasteRecords to FoodItems to Categories, groups by category, sums the weight, then divides each category's total by a subquery that gets the overall total. In our data, Prepared Food comes out at about 29% and Grain at about 24%. That tells you leftovers and overcooked staples are the biggest targets for reduction. If you were building a notification system on top of this, those categories are where you'd focus first.

---

### 6. What JOINs or subqueries are you using and why?

Most of our queries use JOINs because the data lives across five tables. Just to show a waste record with the food name, category, and reason, we're joining three tables in one query. Query 16 also has a subquery in the SELECT clause to get the total weight, so we can calculate each category's percentage of overall waste. And Query 17 uses a derived table: it first gets each user's monthly total, then the outer query averages across users. We went with JOINs over subqueries wherever we could because they're easier to read and usually faster.

---

### 7. How does your app work? Show me.

It's a Flask web app connected to MySQL through pymysql. The main flow is: you pick your user from a dropdown, select a food item and a reason, enter the weight and date, and hit submit. That inserts a row into FoodWasteRecords. Then you can go to the History page and see all your records with filters for user, category, and date range. The dashboard page runs seven different analytics queries and displays charts and tables: waste by category, waste by reason, monthly trends, a leaderboard, and average waste per user per month. Every query uses parameterized inputs with %s placeholders so we're not vulnerable to SQL injection.

---

### 8. What did you learn from your data/analysis?

The two biggest waste reasons are "Made too much" and "Expired." Prepared Food and Grain are the heaviest categories. So the main drivers are behavioral: people cook more than they need or forget about food until it goes bad. The leaderboard also showed big variation across users, which means a generic "waste less" message wouldn't help much. If we built this out further, we'd add portion-size suggestions based on each user's history and expiration reminders for the foods they waste most often. The data makes it clear that personalized nudges would be more effective than general advice.

---
