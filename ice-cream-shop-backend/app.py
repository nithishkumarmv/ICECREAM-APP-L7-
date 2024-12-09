import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
from dummy import flavors, ingredients

app = Flask(__name__)
CORS(app)

# Initialize SQLite database
def init_db():
    with sqlite3.connect('ice_cream.db') as conn:
        cursor = conn.cursor()
        #Create users and admin table
        cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                            id INTEGER PRIMARY KEY,
                            username TEXT UNIQUE,
                            password TEXT)''')
        # Create ice cream table
        cursor.execute('''CREATE TABLE IF NOT EXISTS ice_creams (
                            id INTEGER PRIMARY KEY,
                            name TEXT,
                            price REAL)''')
        # Create orders table
        cursor.execute('DROP TABLE IF EXISTS orders')
        cursor.execute('''CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY,
            username TEXT,
            ice_cream_name TEXT,
            quantity INTEGER,
            total_price REAL)''')
            # Create the custom_orders table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS custom_orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                flavor TEXT,
                ingredients TEXT,
                total_price REAL,
                date TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        conn.commit()


# Add sample users (ensure no duplicate entries)
def add_sample_users():
    with sqlite3.connect('ice_cream.db') as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT OR IGNORE INTO users (username, password) VALUES ('admin', 'adminpass')")
        cursor.execute("INSERT OR IGNORE INTO users (username, password) VALUES ('user1', 'userpass')")
        cursor.executemany('''INSERT INTO ice_creams (name, price) VALUES (?, ?)''', [
            ('Vanilla', 250),
            ('Chocolate', 300)
        ])
        cursor.executemany('''INSERT INTO orders (username, ice_cream_name, quantity, total_price) VALUES (?, ?, ?, ?)''', [
            ('john_doe', 'Vanilla', 2, 20),
            ('jane_smith', 'Chocolate', 1, 300),
            ('alice_williams', 'Strawberry', 3, 825),
            ('bob_brown', 'Mint', 1, 3.25),
            ('charlie_davis', 'Cookie Dough', 2, 700)
        ])
        cursor.execute('''
                INSERT OR IGNORE INTO ingredients (name, price) VALUES
                    ('Chocolate Chips', 20),
                    ('Strawberry Sauce', 30)
            ''')
        conn.commit()


@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    with sqlite3.connect('ice_cream.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password))
        user = cursor.fetchone()
    
    if user:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
    

# Route to add a new ice cream
@app.route('/api/ice-creams', methods=['POST'])
def add_ice_cream():
    data = request.json
    name = data.get('name')
    price = data.get('price')
    with sqlite3.connect('ice_cream.db') as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO ice_creams (name, price) VALUES (?, ?)', (name, price))
        conn.commit()
    return jsonify({'message': 'Ice cream added successfully'}), 201

# Route to update an existing ice cream
@app.route('/api/ice-creams/<int:id>', methods=['PUT'])
def update_ice_cream(id):
    data = request.json
    name = data.get('name')
    price = data.get('price')
    with sqlite3.connect('ice_cream.db') as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE ice_creams SET name = ?, price = ? WHERE id = ?', (name, price, id))
        conn.commit()
    return jsonify({'message': 'Ice cream updated successfully'})

# Route to delete an ice cream
@app.route('/api/ice-creams/<int:id>', methods=['DELETE'])
def delete_ice_cream(id):
    with sqlite3.connect('ice_cream.db') as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM ice_creams WHERE id = ?', (id,))
        conn.commit()
    return jsonify({'message': 'Ice cream deleted successfully'})

# Route to get all ice creams
@app.route('/api/ice-creams', methods=['GET'])
def get_ice_creams():
    with sqlite3.connect('ice_cream.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM ice_creams')
        ice_creams = cursor.fetchall()
    return jsonify(ice_creams)


#Route to add orders
@app.route('/api/orders', methods=['POST'])
def create_order():
    try:
        # Extract order data from request
        order_data = request.json
        
        username = order_data.get('username')
        ice_cream_name = order_data.get('ice_cream_name')
        quantity = order_data.get('quantity')
        total_price = order_data.get('total_price')
        date = order_data.get('date')

        if not all([username, ice_cream_name, quantity, total_price, date]):
            return jsonify({'message': 'Missing required fields'}), 400
        
        # Insert the order into the database
        with sqlite3.connect('ice_cream.db') as conn:
            cursor = conn.cursor()
            cursor.execute('''INSERT INTO orders (username, ice_cream_name, quantity, total_price)
                              VALUES (?, ?, ?, ?)''', (username, ice_cream_name, quantity, total_price))
            conn.commit()

        return jsonify({'message': 'Order placed successfully'}), 201

    except Exception as e:
        print(f"Error placing order: {e}")
        return jsonify({'message': 'Failed to place the order'}), 500

#Route to get all order details
@app.route('/api/orders', methods=['GET'])
def get_orders():
    try:
        with sqlite3.connect('ice_cream.db') as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM orders ORDER BY id DESC LIMIT 10')  # Get the latest 10 orders
            orders = cursor.fetchall()

        return jsonify(orders), 200

    except Exception as e:
        print(f"Error retrieving orders: {e}")
        return jsonify({'message': 'Failed to retrieve orders'}), 500


# Endpoint to get available flavors
@app.route('/api/flavors', methods=['GET'])
def get_flavors():
    return jsonify(flavors)

# Endpoint to get available ingredients
@app.route('/api/ingredients', methods=['GET'])
def get_ingredients():
    return jsonify(ingredients)

    

if __name__ == '__main__':
    init_db()
    add_sample_users()
    app.run(debug=True)
