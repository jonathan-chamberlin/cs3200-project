from flask import Flask, render_template, request, redirect, url_for, flash
import pymysql

app = Flask(__name__)
app.secret_key = 'food-waste-tracker-secret'

# ---- Database connection ----
# Change these to match your local MySQL setup
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',           # root password 
    'database': 'food_waste_tracker',
    'cursorclass': pymysql.cursors.DictCursor
}

def get_db():
    return pymysql.connect(**DB_CONFIG)


# DASHBOARD / ANALYTICS  (Q11, Q12, Q13, Q16)

@app.route('/')
def dashboard():
    db = get_db()
    cur = db.cursor()

    # Q11 - total weight per user
    cur.execute("""
        SELECT u.first_name, u.last_name,
               SUM(fwr.weight) AS total_weight_wasted
        FROM FoodWasteRecords fwr
        JOIN Users u ON fwr.user_id = u.id
        GROUP BY u.id, u.first_name, u.last_name
        ORDER BY total_weight_wasted DESC
    """)
    user_totals = cur.fetchall()

    # Q12 - most wasted category
    cur.execute("""
        SELECT c.category_name,
               SUM(fwr.weight)  AS total_weight,
               COUNT(*)         AS record_count
        FROM FoodWasteRecords fwr
        JOIN FoodItems fi ON fwr.food_id = fi.id
        JOIN Categories c ON fi.category_id = c.id
        GROUP BY c.id, c.category_name
        ORDER BY total_weight DESC
    """)
    category_stats = cur.fetchall()

    # Q13 - waste by reason
    cur.execute("""
        SELECT wr.reason_description,
               SUM(fwr.weight)  AS total_weight,
               COUNT(*)         AS record_count
        FROM FoodWasteRecords fwr
        JOIN WasteReasons wr ON fwr.reason_id = wr.id
        GROUP BY wr.id, wr.reason_description
        ORDER BY total_weight DESC
    """)
    reason_stats = cur.fetchall()

    # Q16 - category percentage
    cur.execute("""
        SELECT c.category_name,
               SUM(fwr.weight) AS category_weight,
               ROUND(
                   SUM(fwr.weight) / (SELECT SUM(weight) FROM FoodWasteRecords) * 100,
                   1
               ) AS percentage_of_total
        FROM FoodWasteRecords fwr
        JOIN FoodItems fi ON fwr.food_id = fi.id
        JOIN Categories c ON fi.category_id = c.id
        GROUP BY c.id, c.category_name
        ORDER BY category_weight DESC
    """)
    category_pct = cur.fetchall()

    # Q14 - monthly waste trend
    cur.execute("""
        SELECT DATE_FORMAT(fwr.waste_date, '%Y-%m') AS month,
               SUM(fwr.weight)                        AS total_weight,
               COUNT(*)                               AS record_count
        FROM FoodWasteRecords fwr
        GROUP BY DATE_FORMAT(fwr.waste_date, '%Y-%m')
        ORDER BY month
    """)
    monthly_trend = cur.fetchall()

    # Q15 - leaderboard (least wasteful)
    cur.execute("""
        SELECT u.first_name, u.last_name,
               COALESCE(SUM(fwr.weight), 0) AS total_weight_wasted
        FROM Users u
        LEFT JOIN FoodWasteRecords fwr ON u.id = fwr.user_id
        GROUP BY u.id, u.first_name, u.last_name
        ORDER BY total_weight_wasted ASC
    """)
    leaderboard = cur.fetchall()

    # Q17 - average waste per user per month
    cur.execute("""
        SELECT user_monthly.month,
               ROUND(AVG(user_monthly.monthly_total), 2) AS avg_waste_per_user
        FROM (
            SELECT user_id,
                   DATE_FORMAT(waste_date, '%Y-%m') AS month,
                   SUM(weight) AS monthly_total
            FROM FoodWasteRecords
            GROUP BY user_id, DATE_FORMAT(waste_date, '%Y-%m')
        ) AS user_monthly
        GROUP BY user_monthly.month
        ORDER BY user_monthly.month
    """)
    avg_monthly = cur.fetchall()

    db.close()
    return render_template('dashboard.html',
                           user_totals=user_totals,
                           category_stats=category_stats,
                           reason_stats=reason_stats,
                           category_pct=category_pct,
                           monthly_trend=monthly_trend,
                           leaderboard=leaderboard,
                           avg_monthly=avg_monthly)



# LOG WASTE  (Q3 - INSERT, uses Q10 for dropdowns)

@app.route('/log', methods=['GET', 'POST'])
def log_waste():
    db = get_db()
    cur = db.cursor()

    if request.method == 'POST':
        user_id   = request.form['user_id']
        food_id   = request.form['food_id']
        reason_id = request.form['reason_id']
        weight    = request.form['weight']
        waste_date = request.form['waste_date']

        # Q3 - insert a waste record
        cur.execute("""
            INSERT INTO FoodWasteRecords (user_id, reason_id, food_id, weight, waste_date)
            VALUES (%s, %s, %s, %s, %s)
        """, (user_id, reason_id, food_id, weight, waste_date))
        db.commit()
        db.close()
        flash('Waste record added successfully!', 'success')
        return redirect(url_for('history', user_id=user_id))

    # GET - load dropdown data
    cur.execute("SELECT id, first_name, last_name FROM Users ORDER BY first_name")
    users = cur.fetchall()

    # Q10 - food items with categories
    cur.execute("""
        SELECT fi.id AS food_id, fi.food_name, c.category_name
        FROM FoodItems fi
        JOIN Categories c ON fi.category_id = c.id
        ORDER BY c.category_name, fi.food_name
    """)
    foods = cur.fetchall()

    cur.execute("SELECT id, reason_description FROM WasteReasons ORDER BY id")
    reasons = cur.fetchall()

    db.close()
    return render_template('log.html', users=users, foods=foods, reasons=reasons)



# HISTORY  (Q7, Q8, Q9 - view / filter records)

@app.route('/history')
def history():
    db = get_db()
    cur = db.cursor()

    # Get filter parameters
    user_id   = request.args.get('user_id', '')
    category  = request.args.get('category', '')
    date_from = request.args.get('date_from', '')
    date_to   = request.args.get('date_to', '')

    # Build dynamic query based on filters
    query = """
        SELECT fwr.id AS record_id,
               u.first_name, u.last_name,
               fi.food_name, c.category_name,
               wr.reason_description,
               fwr.weight, fwr.waste_date
        FROM FoodWasteRecords fwr
        JOIN Users u         ON fwr.user_id  = u.id
        JOIN FoodItems fi    ON fwr.food_id  = fi.id
        JOIN Categories c    ON fi.category_id = c.id
        JOIN WasteReasons wr ON fwr.reason_id = wr.id
        WHERE 1=1
    """
    params = []

    if user_id:
        query += " AND fwr.user_id = %s"
        params.append(user_id)
    if category:
        query += " AND c.category_name = %s"
        params.append(category)
    if date_from:
        query += " AND fwr.waste_date >= %s"
        params.append(date_from)
    if date_to:
        query += " AND fwr.waste_date <= %s"
        params.append(date_to)

    query += " ORDER BY fwr.waste_date DESC"
    cur.execute(query, params)
    records = cur.fetchall()

    # Load dropdown data for filters
    cur.execute("SELECT id, first_name, last_name FROM Users ORDER BY first_name")
    users = cur.fetchall()

    cur.execute("SELECT DISTINCT category_name FROM Categories ORDER BY category_name")
    categories = cur.fetchall()

    db.close()
    return render_template('history.html',
                           records=records, users=users, categories=categories,
                           sel_user=user_id, sel_category=category,
                           sel_from=date_from, sel_to=date_to)



# UPDATE weight  (Q4)

@app.route('/update/<int:record_id>', methods=['POST'])
def update_record(record_id):
    new_weight = request.form['new_weight']
    db = get_db()
    cur = db.cursor()
    cur.execute("UPDATE FoodWasteRecords SET weight = %s WHERE id = %s",
                (new_weight, record_id))
    db.commit()
    db.close()
    flash('Record updated!', 'success')
    return redirect(url_for('history'))



# DELETE record  (Q5)

@app.route('/delete/<int:record_id>', methods=['POST'])
def delete_record(record_id):
    db = get_db()
    cur = db.cursor()
    cur.execute("DELETE FROM FoodWasteRecords WHERE id = %s", (record_id,))
    db.commit()
    db.close()
    flash('Record deleted.', 'info')
    return redirect(url_for('history'))


# REGISTER USER  (Q1)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        email = request.form['email']
        phone = request.form.get('phone', '')

        db = get_db()
        cur = db.cursor()
        cur.execute("""
            INSERT INTO Users (first_name, last_name, email, phone)
            VALUES (%s, %s, %s, %s)
        """, (first_name, last_name, email, phone))
        db.commit()
        db.close()
        flash('User registered successfully!', 'success')
        return redirect(url_for('register'))

    return render_template('register.html')


# ADD FOOD ITEM  (Q2)

@app.route('/add-food', methods=['GET', 'POST'])
def add_food():
    db = get_db()
    cur = db.cursor()

    if request.method == 'POST':
        food_name = request.form['food_name']
        category_id = request.form['category_id']

        cur.execute("""
            INSERT INTO FoodItems (food_name, category_id)
            VALUES (%s, %s)
        """, (food_name, category_id))
        db.commit()
        db.close()
        flash('Food item added successfully!', 'success')
        return redirect(url_for('add_food'))

    cur.execute("SELECT id, category_name FROM Categories ORDER BY category_name")
    categories = cur.fetchall()
    db.close()
    return render_template('add_food.html', categories=categories)


# MANAGE USERS  (Q6 - update email)

@app.route('/users')
def users():
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT id, first_name, last_name, email, phone FROM Users ORDER BY first_name")
    users = cur.fetchall()
    db.close()
    return render_template('users.html', users=users)


@app.route('/update-email/<int:user_id>', methods=['POST'])
def update_email(user_id):
    new_email = request.form['new_email']
    db = get_db()
    cur = db.cursor()
    cur.execute("UPDATE Users SET email = %s WHERE id = %s", (new_email, user_id))
    db.commit()
    db.close()
    flash('Email updated!', 'success')
    return redirect(url_for('users'))


if __name__ == '__main__':
    app.run(debug=True)