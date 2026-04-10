/**
 * CS3200 Food Waste Tracker — Google Slides Presentation Generator
 *
 * HOW TO USE:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Paste this entire file into Code.gs
 * 4. Click Run → select createPresentation
 * 5. Authorize when prompted
 * 6. Check your Google Drive for "CS3200 Food Waste Tracker — Group 18"
 */

function createPresentation() {
  var pres = SlidesApp.create("CS3200 Food Waste Tracker — Group 18");

  // Set widescreen 16:9
  // (default is already 16:9 in Google Slides)

  // Colors
  var DARK_GREEN = "#2D6A4F";
  var LIGHT_GREEN = "#52B788";
  var WHITE = "#FFFFFF";
  var DARK_TEXT = "#1B1B1B";
  var LIGHT_BG = "#F0F7F4";

  // Remove default blank slide
  var defaultSlide = pres.getSlides()[0];

  // ── Slide 1: Title ──
  var slide1 = defaultSlide;
  slide1.getBackground().setSolidFill(DARK_GREEN);

  slide1.insertTextBox("Food Waste Tracker", 50, 100, 620, 80)
    .getText().getTextStyle()
    .setFontSize(48).setBold(true).setForegroundColor(WHITE).setFontFamily("Calibri");
  slide1.getShapes()[0].setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);

  slide1.insertTextBox("A Database-Driven Analytics Platform", 50, 200, 620, 40)
    .getText().getTextStyle()
    .setFontSize(24).setForegroundColor(LIGHT_GREEN).setFontFamily("Calibri");
  slide1.getShapes()[1].setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);

  slide1.insertTextBox("CS3200 Database Design  |  Group 18", 50, 270, 620, 30)
    .getText().getTextStyle()
    .setFontSize(18).setForegroundColor(WHITE).setFontFamily("Calibri");
  slide1.getShapes()[2].setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);

  slide1.insertTextBox("Xinxiang (Eunice)  •  Yanjie (Candy)  •  Xinyi  •  Jonathan", 50, 320, 620, 30)
    .getText().getTextStyle()
    .setFontSize(16).setForegroundColor(LIGHT_GREEN).setFontFamily("Calibri");
  slide1.getShapes()[3].setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);

  slide1.getNotesPage().getSpeakerNotesShape().getText().setText(
    "Title slide — no speaking part. Transition to Eunice for Section 1."
  );

  // ── Slide 2: Introduction & Motivation ──
  var slide2 = pres.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  addSectionHeader_(slide2, "Section 1", "Introduction & Motivation", DARK_GREEN, WHITE, LIGHT_GREEN);

  slide2.insertTextBox(
    "• 1.3 billion tons of food wasted globally every year\n" +
    "• Average household throws out ~$1,500 worth annually\n" +
    "• Most people can't identify what they waste most or why\n\n" +
    "• Our solution: a Food Waste Tracker that lets individuals\n" +
    "  log waste, browse history, and see analytics on patterns\n" +
    "• Think of it like a budget tracker, but for food you throw out",
    30, 120, 380, 260
  ).getText().getTextStyle().setFontSize(14).setFontFamily("Calibri");

  slide2.getNotesPage().getSpeakerNotesShape().getText().setText(
    "Speaker: Eunice (~45 seconds)\n\n" +
    "1.3 billion tons of food gets wasted globally every year. Your household alone probably throws out about $1,500 worth. But if you asked most people what they waste the most or why, they couldn't tell you.\n\n" +
    "Hey everyone, we're Group 18. Our project is a Food Waste Tracker. You can see our full poster here. I'll start with the motivation, then we'll walk through the database design, a demo of the app, and our findings.\n\n" +
    "We built a system that lets individuals track what they waste, browse their history, and see analytics on their patterns. Think of it like a budget tracker, but for food you're throwing out."
  );

  // ── Slide 3: Database Design ──
  var slide3 = pres.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  addSectionHeader_(slide3, "Section 2", "Database Design", DARK_GREEN, WHITE, LIGHT_GREEN);

  slide3.insertTextBox(
    "• 5 tables, all in Third Normal Form (3NF)\n" +
    "• FoodWasteRecords at the center — connects\n" +
    "  User → FoodItem → WasteReason + weight + date\n\n" +
    "• Categories, FoodItems, WasteReasons in separate\n" +
    "  tables to eliminate redundancy\n\n" +
    "• Foreign keys enforce referential integrity\n" +
    "• CASCADE on updates, RESTRICT on deletes",
    30, 120, 350, 260
  ).getText().getTextStyle().setFontSize(14).setFontFamily("Calibri");

  slide3.getNotesPage().getSpeakerNotesShape().getText().setText(
    "Speaker: Candy (~1 minute)\n\n" +
    "Here's our ER diagram showing the conceptual design.\n\n" +
    "We have five tables, all in Third Normal Form. At the center is FoodWasteRecords, which connects a User to a FoodItem, a WasteReason, a weight, and a date. FoodItems each belong to a Category, so things like \"Banana\" are under \"Fruit\" and \"Milk\" is under \"Dairy.\"\n\n" +
    "We separated Categories, FoodItems, and WasteReasons into their own tables instead of storing strings directly in the waste records. Without normalization, you'd have the string \"Dairy\" repeated in every single dairy waste record. If you wanted to rename it, you'd have to update hundreds of rows. With our design, \"Dairy\" exists in one row in the Categories table, and everything else just references it by ID.\n\n" +
    "The foreign keys enforce referential integrity. For example, you can't log waste for a user or food item that doesn't exist. We also set CASCADE on updates and RESTRICT on deletes to prevent accidental data loss."
  );

  // ── Slide 4: Logging Waste ──
  var slide4 = pres.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  addSectionHeader_(slide4, "Section 3", "App Demo — Logging Waste", DARK_GREEN, WHITE, LIGHT_GREEN);

  slide4.insertTextBox(
    "• Select user, food item, waste reason from dropdowns\n" +
    "• Enter weight (kg) and date, then submit\n" +
    "• Runs INSERT into FoodWasteRecords\n\n" +
    "• Parameterized queries throughout (%s placeholders)\n" +
    "  → prevents SQL injection attacks\n" +
    "• Dropdowns populated by SELECT with JOINs\n" +
    "  (FoodItems + Categories)",
    30, 120, 380, 260
  ).getText().getTextStyle().setFontSize(14).setFontFamily("Calibri");

  slide4.getNotesPage().getSpeakerNotesShape().getText().setText(
    "Speaker: Xinyi (~45 seconds)\n\n" +
    "So let me walk you through the app. This is the core screen where you log food waste.\n\n" +
    "You pick your name from the dropdown, select the food item, choose a reason like \"Expired\" or \"Made too much,\" enter the weight in kilograms, and pick the date. Hit submit and it's recorded.\n\n" +
    "Behind the scenes, this runs an INSERT into FoodWasteRecords. We use parameterized queries throughout the app, meaning user input never gets concatenated into SQL strings directly. That prevents SQL injection attacks. The dropdowns are populated by SELECT queries joining FoodItems with Categories, so you see the food name alongside its category."
  );

  // ── Slide 5: History & Filtering ──
  var slide5 = pres.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  addSectionHeader_(slide5, "Section 4", "App Demo — History & Filtering", DARK_GREEN, WHITE, LIGHT_GREEN);

  slide5.insertTextBox(
    "• View full waste history: date, food, category, reason, weight\n" +
    "• Filter by user, category, or date range\n\n" +
    "• Dynamic query builds WHERE clauses based on active filters\n" +
    "• JOINs across 4 tables for complete details\n" +
    "• Edit weight or delete records inline\n" +
    "  (UPDATE and DELETE operations)",
    30, 120, 380, 260
  ).getText().getTextStyle().setFontSize(14).setFontFamily("Calibri");

  slide5.getNotesPage().getSpeakerNotesShape().getText().setText(
    "Speaker: Xinyi (~45 seconds)\n\n" +
    "Once you've logged some waste, you can view your full history here. It shows every record with the date, food name, category, reason, and weight.\n\n" +
    "But the real utility is in the filters. You can filter by user, by category, or by date range. So if you want to see just your dairy waste from February, you set those filters and it narrows right down.\n\n" +
    "On the backend, this is a dynamic query that builds WHERE clauses based on which filters you set. It uses JOINs across four tables to pull in all the details: FoodItems, Categories, WasteReasons, and Users.\n\n" +
    "You can also edit a record's weight or delete it entirely right from this view. Those are the UPDATE and DELETE operations."
  );

  // ── Slide 6: User & Food Management ──
  var slide6 = pres.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  addSectionHeader_(slide6, "Section 5", "User & Food Management", DARK_GREEN, WHITE, LIGHT_GREEN);

  slide6.insertTextBox(
    "• Register: enter name, email, phone\n" +
    "• Add food items and assign to categories\n" +
    "• Update user email from the Users page\n\n" +
    "• Full CRUD coverage across all main tables:\n" +
    "  Create, Read, Update, Delete",
    30, 120, 380, 200
  ).getText().getTextStyle().setFontSize(14).setFontFamily("Calibri");

  slide6.getNotesPage().getSpeakerNotesShape().getText().setText(
    "Speaker: Eunice (~30 seconds)\n\n" +
    "Before you can log waste, you need an account and food items in the system. Here's the registration page where you enter your name, email, and phone. And here's where you add new food items and assign them to a category.\n\n" +
    "On the Users page you can also update someone's email. So between these screens and the logging and history pages, we have full CRUD coverage: create, read, update, and delete across all our main tables."
  );

  // ── Slide 7: Analytics Dashboard ──
  var slide7 = pres.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  addSectionHeader_(slide7, "Section 6", "Analytics Dashboard", DARK_GREEN, WHITE, LIGHT_GREEN);

  slide7.insertTextBox(
    "• Waste by category (pie chart)\n" +
    "• Waste by reason (bar chart)\n" +
    "• Total waste per user\n" +
    "• Category breakdown table (% of total)\n" +
    "• Monthly trend chart\n" +
    "• Leaderboard: least to most wasteful\n" +
    "• Average waste per user per month\n\n" +
    "• All 7 analytics use GROUP BY + JOINs +\n" +
    "  aggregate functions\n" +
    "• Subqueries for % calculations\n" +
    "• Derived tables for monthly averages",
    30, 120, 350, 280
  ).getText().getTextStyle().setFontSize(13).setFontFamily("Calibri");

  slide7.getNotesPage().getSpeakerNotesShape().getText().setText(
    "Speaker: Jonathan (~1 minute)\n\n" +
    "This is the analytics dashboard, and it's where everything comes together.\n\n" +
    "Up top we have waste by category as a pie chart. In our seed data, Prepared Food and Grain are the biggest contributors. Next to that is waste by reason as a bar chart. \"Made too much\" and \"Expired\" are the top two, which tells you the main behavioral drivers.\n\n" +
    "Below that we have total waste per user and a category breakdown table showing each category's percentage of total waste.\n\n" +
    "The monthly trend chart shows how waste changes over time. And at the bottom we have a leaderboard ranking users from least to most wasteful, plus an average waste per user per month table.\n\n" +
    "All seven of these analytics come from GROUP BY queries with JOINs and aggregate functions. The category percentage uses a subquery to calculate each category's share of total waste. The monthly average uses a derived table to first get each user's monthly total, then averages across users."
  );

  // ── Slide 8: Query Summary ──
  var slide8 = pres.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  slide8.getBackground().setSolidFill(LIGHT_BG);
  addSectionHeader_(slide8, "Section 6", "17 SQL Queries", DARK_GREEN, WHITE, LIGHT_GREEN);

  // Three columns
  slide8.insertTextBox(
    "6 CRUD Operations\n\n" +
    "• INSERT waste records\n" +
    "• SELECT with filters\n" +
    "• UPDATE record weight\n" +
    "• DELETE records\n" +
    "• INSERT/UPDATE users\n" +
    "• INSERT food items",
    30, 120, 210, 260
  ).getText().getTextStyle().setFontSize(12).setFontFamily("Calibri");
  // Bold the header
  slide8.getShapes()[slide8.getShapes().length - 1].getText()
    .getRange(0, 20).getTextStyle().setBold(true).setForegroundColor(DARK_GREEN).setFontSize(16);

  slide8.insertTextBox(
    "4 History & Filtering\n\n" +
    "• Full history with JOINs\n" +
    "• Filter by user\n" +
    "• Filter by category\n" +
    "• Filter by date range",
    255, 120, 210, 260
  ).getText().getTextStyle().setFontSize(12).setFontFamily("Calibri");
  slide8.getShapes()[slide8.getShapes().length - 1].getText()
    .getRange(0, 21).getTextStyle().setBold(true).setForegroundColor(DARK_GREEN).setFontSize(16);

  slide8.insertTextBox(
    "7 Analytics Queries\n\n" +
    "• Waste by category\n" +
    "• Waste by reason\n" +
    "• Total per user\n" +
    "• Category % (subquery)\n" +
    "• Monthly trends\n" +
    "• User leaderboard\n" +
    "• Avg waste/user/month",
    480, 120, 220, 260
  ).getText().getTextStyle().setFontSize(12).setFontFamily("Calibri");
  slide8.getShapes()[slide8.getShapes().length - 1].getText()
    .getRange(0, 19).getTextStyle().setBold(true).setForegroundColor(DARK_GREEN).setFontSize(16);

  slide8.getNotesPage().getSpeakerNotesShape().getText().setText(
    "Speaker: Jonathan (continued)\n\n" +
    "In total we wrote 17 SQL queries: 6 CRUD operations for creating, updating, and deleting records across our tables, 4 history and filtering queries with dynamic WHERE clauses, and 7 analytics queries using GROUP BY, JOINs, subqueries, and derived tables."
  );

  // ── Slide 9: Conclusion ──
  var slide9 = pres.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  addSectionHeader_(slide9, "Section 7", "Conclusion & Key Findings", DARK_GREEN, WHITE, LIGHT_GREEN);

  slide9.insertTextBox(
    "• Full-stack database app: 5 normalized tables,\n" +
    "  17 SQL queries, complete web interface\n\n" +
    "• Key findings from the data:\n" +
    "  → \"Made too much\" and \"Expired\" are top waste reasons\n" +
    "  → Prepared Food is the most wasted category\n" +
    "  → Big variation across users → personalized\n" +
    "     nudges > generic advice\n\n" +
    "• Potential extensions: portion-size suggestions,\n" +
    "  expiration reminders based on user history",
    30, 120, 450, 260
  ).getText().getTextStyle().setFontSize(15).setFontFamily("Calibri");

  slide9.getNotesPage().getSpeakerNotesShape().getText().setText(
    "Speaker: Candy (~30 seconds)\n\n" +
    "To wrap up: we built a full-stack database application with 5 normalized tables, 17 SQL queries, and a web interface that covers the complete user journey.\n\n" +
    "Our data showed that \"Made too much\" and \"Expired\" are the top waste reasons, and Prepared Food is the most wasted category. Those are actionable findings. If you know your biggest waste driver, you can actually change your behavior.\n\n" +
    "Thanks for listening. Happy to take any questions."
  );

  // ── Slide 10: Thank You ──
  var slide10 = pres.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  slide10.getBackground().setSolidFill(DARK_GREEN);

  slide10.insertTextBox("Thank You!", 50, 130, 620, 60)
    .getText().getTextStyle()
    .setFontSize(48).setBold(true).setForegroundColor(WHITE).setFontFamily("Calibri");
  slide10.getShapes()[slide10.getShapes().length - 1].setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);

  slide10.insertTextBox("Questions?", 50, 220, 620, 40)
    .getText().getTextStyle()
    .setFontSize(28).setForegroundColor(LIGHT_GREEN).setFontFamily("Calibri");
  slide10.getShapes()[slide10.getShapes().length - 1].setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);

  slide10.insertTextBox("Group 18  •  CS3200 Database Design", 50, 290, 620, 30)
    .getText().getTextStyle()
    .setFontSize(18).setForegroundColor(WHITE).setFontFamily("Calibri");
  slide10.getShapes()[slide10.getShapes().length - 1].setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);

  Logger.log("Presentation created: " + pres.getUrl());

  // Show URL to user
  var ui = SpreadsheetApp || null;
  Logger.log("DONE! Open your presentation at:");
  Logger.log(pres.getUrl());

  return pres.getUrl();
}

// ── Helper: Section header bar ──
function addSectionHeader_(slide, sectionLabel, title, bgColor, titleColor, labelColor) {
  // Green rectangle header bar
  var rect = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, 0, 0, 720, 80);
  rect.getFill().setSolidFill(bgColor);
  rect.getBorder().setTransparent();

  // Section label
  slide.insertTextBox(sectionLabel, 40, 8, 300, 25)
    .getText().getTextStyle()
    .setFontSize(12).setForegroundColor(labelColor).setFontFamily("Calibri");

  // Title
  slide.insertTextBox(title, 40, 30, 600, 45)
    .getText().getTextStyle()
    .setFontSize(28).setBold(true).setForegroundColor(titleColor).setFontFamily("Calibri");
}
