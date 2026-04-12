# Food Waste Tracker — Poster Presentation Script

**Team:** Xinxiang (Eunice), Yanjie (Candy), Xinyi, Jonathan
**Format:** Poster walkthrough, ~13 minutes
**Structure:** First half = setup + queries. Second half = conclusions, implications, expansion, UI.

---

## Part 1: Setup and Queries (~6.5 minutes)

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

---

## Part 2: Conclusions, Implications, and Expansion (~6.5 minutes)

### Findings (~2 min)
**Point at:** Findings and Products section (bottom left), Key Insights (bottom middle)

So here's what the data actually showed us.

Prepared Food accounts for 28.1% of total waste. Grain is second at 24.2%. Those two categories alone make up over half of all waste. The most common waste reason is "Leftover, not eaten," at about 3.6 kilograms total. "Made too much" and "Expired" are the next biggest reasons.

The main drivers are behavioral. People are cooking more than they need, or they're forgetting about food until it goes bad. Those are two different problems. "Made too much" is a planning problem. You could fix it with better portion sizing. "Expired" is a visibility problem. You didn't know the food was about to go bad, or you forgot it was in the fridge. You could fix that with reminders.

The leaderboard also showed big variation across users. Some people waste significantly more than others. That matters because it means a generic "waste less food" message wouldn't actually help much. The person who wastes mostly from overcooked staples needs different advice than the person who keeps letting dairy expire. Personalized nudges based on each user's data would be more effective than general advice.

### Why the Results Are What They Are (~1.5 min)
**Point at:** Charts and Key Insights section

Prepared Food being the top category at 28% comes down to shelf life. Prepared meals have the shortest usable window. You cook dinner, don't eat the leftovers within a day or two, and they go bad. Compare that to something like canned goods or dry rice, which last months. The food with the tightest expiration window gets wasted the most. If we'd added an expiration_days column to FoodItems, we could actually correlate waste percentage against shelf life and test that directly. We didn't build that, but the data pattern strongly suggests it.

Grain being second at 24% is similar but for a different reason. Bread and cooked rice go stale fast, but the bigger issue is that dry goods are hard to portion. A cup of uncooked rice makes way more than most people expect. So you get hit from both sides: short shelf life after cooking and consistent overproduction.

"Made too much" being the top reason reinforces this. It's a portion estimation problem. Most people don't weigh or measure. They eyeball it. And the tendency is to make extra "just in case." Over time, those extras add up.

The user variation is interesting too. Some users waste two or three times more than others. We can't tell from the current schema whether that's household size, cooking frequency, or shopping habits. But if we added those fields to the Users table, we could segment users and figure out what actually drives the variation. Right now the data says personalized nudges would help more than generic advice, but we'd need that segmentation data to make the nudges specific.

### How This Project Could Be Expanded (~2 min)
**Point at:** Conclusion and Next Steps section (bottom right)

Portion-size suggestions would be the most obvious one. If the system knows you consistently waste 30% of the rice you cook, it could suggest you cook less next time. That's a simple calculation based on historical data. You'd add a RecommendedPortions table that tracks suggested amounts per food item per user, and update it as more data comes in.

Expiration reminders are another one. If you logged that you bought milk on Monday, and the system knows from your history that you tend to waste dairy after about five days, it could send you a reminder on Thursday. That would require adding a purchase date field and a notification system, but the underlying data model already supports it because we track food items and dates.

The analytics could also go deeper. Right now we show aggregate trends, but you could add time-of-week analysis. Do you waste more on weekends? After grocery shopping days? That kind of granularity would make the recommendations even more specific.

You could also move from reactive reporting to prediction. If we have three months of someone's data, we could predict which week they're likely to waste the most and send a nudge before it happens. That would mean adding a Predictions table that logs model outputs per user per week. When the confidence is high enough, trigger a notification. Then you'd track whether nudged users actually waste less, which closes the feedback loop.

And you could scale this beyond individual households. If a dining hall used this system, the analytics would help them adjust menu planning. You'd add a Location_ID foreign key to Users to group people by site. The core schema carries over.

### UI Walkthrough (~1 min)
**Point at:** App screenshots on poster (Log Waste Form, History, User & Food Management, Dashboard)

Quick walkthrough of the interface.

The main screen is the waste logging form. You pick your user from a dropdown, select the food item and category, choose a reason, enter the weight in kilograms, and pick the date. The dropdowns are populated by SELECT queries joining FoodItems with Categories.

The history page shows all records with filters for user, category, and date range. You can edit a record's weight or delete it right from this view.

The dashboard pulls everything together. Pie chart for waste by category, bar chart for waste by reason, total per user, monthly trends, the leaderboard, and average waste per user per month. All seven visualizations update from the same underlying queries.

Between registration, food management, logging, history, and analytics, we have full CRUD coverage across all five tables. The whole thing runs on Flask with MySQL through pymysql.

---

## Wrap-Up (~30 sec)

So to sum up: five normalized tables, 17 SQL queries, a web interface that covers the complete user journey from registration through analytics. The data showed that overproduction and expiration are the main waste drivers, and that there's enough variation across users that personalized recommendations would be the most effective next step.

Thanks. Happy to take any questions.
