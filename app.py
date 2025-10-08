#!/usr/bin/env python3
"""
Flask server for PokerPal - Professional Poker Analysis Platform
Provides API endpoints for poker calculations using pokersim.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import sys
import os
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    """Serve the main page"""
    return app.send_static_file('index.html')

@app.route('/calculate', methods=['POST'])
def calculate_odds():
    """
    Calculate poker odds using pokersim.py
    Expected JSON: {
        "hands": [["As", "Kh"], ["2c", "3d"]],
        "board": ["Ac", "Kd", "2h"],
        "num_sims": 1000
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        # Validate required fields
        required_fields = ['hands', 'board', 'num_sims']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        print(f"📊 Calculating odds for {len(data['hands'])} hands, board: {data['board']}")
        
        # Call pokersim.py with the data
        result = subprocess.run([
            sys.executable, 'backend/pokersim.py',
            json.dumps(data)
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode != 0:
            print(f"❌ pokersim.py error: {result.stderr}")
            return jsonify({'error': f'Calculation failed: {result.stderr}'}), 500
        
        # Parse the result
        try:
            result_data = json.loads(result.stdout)
            print(f"✅ Successfully calculated odds")
            return jsonify(result_data)
        except json.JSONDecodeError as e:
            print(f"❌ JSON parse error: {e}")
            return jsonify({'error': 'Invalid response from calculation engine'}), 500
            
    except subprocess.TimeoutExpired:
        print("⏰ Calculation timed out")
        return jsonify({'error': 'Calculation timed out'}), 408
    except Exception as e:
        print(f"❌ Server error: {e}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'PokerPal API',
        'version': '1.0.0'
    })

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"🚀 PokerPal Flask Server starting...")
    print(f"📡 Port: {port}")
    print(f"🐛 Debug: {debug}")
    print(f"🌐 Open: http://localhost:{port}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
