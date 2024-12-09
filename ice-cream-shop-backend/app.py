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






if __name__ == '__main__':
    init_db()
    add_sample_users()
    app.run(debug=True)
