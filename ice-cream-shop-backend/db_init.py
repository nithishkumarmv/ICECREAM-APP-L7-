import sqlite3

# Initialize SQLite database
def init_db():
    with sqlite3.connect('ice_cream.db') as conn:
        cursor = conn.cursor()
        # Create Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT UNIQUE,
                password TEXT
            )
        ''')
        # Create sample users
        cursor.execute("INSERT OR IGNORE INTO users (username, password) VALUES ('admin', 'admin123')")
        cursor.execute("INSERT OR IGNORE INTO users (username, password) VALUES ('user', 'user123')")
        conn.commit()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully.")
