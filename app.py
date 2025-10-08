from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import sys
import json

app = Flask(__name__)
CORS(app)

@app.route('/calculate', methods=['POST'])
def calculate_odds():
    data = request.get_json()
    result = subprocess.run([sys.executable, 'backend/pokersim.py', json.dumps(data)], 
                          capture_output=True, text=True)
    return jsonify(json.loads(result.stdout))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
