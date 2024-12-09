import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

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
        conn.commit()


# Add sample users (ensure no duplicate entries)
def add_sample_users():
    with sqlite3.connect('ice_cream.db') as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT OR IGNORE INTO users (username, password) VALUES ('admin', 'adminpass')")
        cursor.execute("INSERT OR IGNORE INTO users (username, password) VALUES ('user1', 'userpass')")
        cursor.executemany('''INSERT INTO ice_creams (name, price) VALUES (?, ?)''', [
            ('Vanilla', 2.50),
            ('Chocolate', 3.00),
            ('Strawberry', 2.75),
            ('Mint', 3.25),
            ('Cookie Dough', 3.50)
        ])
        cursor.executemany('''INSERT INTO orders (username, ice_cream_name, quantity, total_price) VALUES (?, ?, ?, ?)''', [
            ('john_doe', 'Vanilla', 2, 5.00),
            ('jane_smith', 'Chocolate', 1, 3.00),
            ('alice_williams', 'Strawberry', 3, 8.25),
            ('bob_brown', 'Mint', 1, 3.25),
            ('charlie_davis', 'Cookie Dough', 2, 7.00)
        ])
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



if __name__ == '__main__':
    init_db()
    add_sample_users()
    app.run(debug=True)
