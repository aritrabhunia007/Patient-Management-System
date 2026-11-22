from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# --- Database Configuration ---
# Update these credentials to match your local MySQL setup
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'password',
    'database': 'caresync_db'
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

# --- Routes ---

@app.route('/api/patients', methods=['GET'])
def get_patients():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM patients")
        patients = cursor.fetchall()
        return jsonify(patients), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            cursor.close()
            conn.close()

@app.route('/api/patients', methods=['POST'])
def add_patient():
    data = request.json
    required_fields = ['name', 'age', 'gender', 'contact']
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
        
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO patients (name, age, gender, contact, medical_history) 
            VALUES (%s, %s, %s, %s, %s)
        """
        values = (data['name'], data['age'], data['gender'], data['contact'], data.get('medical_history', ''))
        cursor.execute(query, values)
        conn.commit()
        return jsonify({"message": "Patient added successfully", "id": cursor.lastrowid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            cursor.close()
            conn.close()

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "Backend is running!"})

if __name__ == '__main__':
    print("Starting CareSync Backend Server on port 5000...")
    print("NOTE: Make sure MySQL is running and you have run the schema.sql file!")
    app.run(debug=True, port=5000)
