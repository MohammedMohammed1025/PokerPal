#!/usr/bin/env python3
import http.server
import socketserver
import json
import subprocess
import sys
import os

class PokerHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/calculate':
            try:
                # Read the JSON data
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                print(f"Received data: {data}")
                
                # Call the actual pokersim.py script
                result = subprocess.run([
                    sys.executable, 'backend/pokersim.py'
                ], input=json.dumps(data), text=True, capture_output=True, cwd=os.getcwd())
                
                if result.returncode == 0:
                    # Parse the JSON response - get only the first line which contains the JSON
                    json_output = result.stdout.split('\n')[0]
                    response_data = json.loads(json_output)
                    print(f"Pokersim result: {response_data}")
                else:
                    print(f"Pokersim error: {result.stderr}")
                    # Fallback to mock data if pokersim fails
                    response_data = {
                        "wins": [45, 30, 15, 10],
                        "ties": [5, 3, 2, 1],
                        "win_percentages": [45.0, 30.0, 15.0, 10.0],
                        "tie_percentages": [5.0, 3.0, 2.0, 1.0],
                        "hand_rankings": ["High Card", "High Card", "High Card", "High Card"]
                    }
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response_data).encode())
                    
            except Exception as e:
                print(f"Error: {e}")
                error_response = {'error': str(e)}
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(error_response).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == "__main__":
    PORT = 8001
    
    with socketserver.TCPServer(("", PORT), PokerHandler) as httpd:
        print(f"🚀 TEST POKER SERVER running on http://localhost:{PORT}")
        print("📱 Open http://localhost:5173 in your browser!")
        httpd.serve_forever()
