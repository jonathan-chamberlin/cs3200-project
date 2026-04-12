# Food Waste Tracker — Poster Presentation Script (Part 2)

**Team:** Xinxiang (Eunice), Yanjie (Candy), Xinyi, Jonathan
**Format:** Poster walkthrough, ~13 minutes total
**This part:** Conclusions, implications, expansion, UI (~6.5 minutes)

---

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
