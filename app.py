from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import sys
import json

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/calculate', methods=['POST'])
def calculate_odds():
    data = request.get_json()
    result = subprocess.run([sys.executable, 'backend/pokersim.py', json.dumps(data)], 
                          capture_output=True, text=True)
    return jsonify(json.loads(result.stdout))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
