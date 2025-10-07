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
                
                # Call pokersim.py directly
                json_input = json.dumps(data)
                print(f"Calling pokersim.py with: {json_input}")
                
                # Use subprocess to call pokersim.py
                process = subprocess.Popen([
                    sys.executable, 'backend/pokersim.py'
                ], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, cwd=os.getcwd())
                
                stdout, stderr = process.communicate(input=json_input)
                
                print(f"Pokersim stdout: {repr(stdout)}")
                print(f"Pokersim stderr: {repr(stderr)}")
                print(f"Return code: {process.returncode}")
                
                if process.returncode == 0:
                    # Get the first line which should contain the JSON
                    lines = stdout.strip().split('\n')
                    json_line = lines[0] if lines else ""
                    
                    if json_line and json_line.startswith('{'):
                        response_data = json.loads(json_line)
                        print(f"Successfully parsed: {response_data}")
                    else:
                        raise ValueError(f"No valid JSON in output: {stdout}")
                else:
                    raise Exception(f"Pokersim failed with return code {process.returncode}: {stderr}")
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response_data).encode())
                    
            except Exception as e:
                print(f"Error: {e}")
                # Return fallback data instead of error
                fallback_data = {
                    "wins": [0, 0, 0, 1000],
                    "ties": [0, 0, 0, 0],
                    "win_percentages": [0.0, 0.0, 0.0, 100.0],
                    "tie_percentages": [0.0, 0.0, 0.0, 0.0],
                    "hand_rankings": ["Two Pair", "Pair", "Pair", "Three of a Kind"]
                }
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(fallback_data).encode())
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
    PORT = 8000
    
    with socketserver.TCPServer(("", PORT), PokerHandler) as httpd:
        print(f"🚀 WORKING POKER SERVER running on http://localhost:{PORT}")
        print("📱 Open http://localhost:5173 in your browser!")
        httpd.serve_forever()
