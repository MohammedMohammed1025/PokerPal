#!/usr/bin/env python3
import http.server
import socketserver
import json
import subprocess
import sys
import os
from urllib.parse import urlparse, parse_qs

class PokerHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/calculate':
            try:
                # Read the JSON data
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                # Call the pokersim.py script
                result = subprocess.run([
                    sys.executable, 'backend/pokersim.py'
                ], input=json.dumps(data), text=True, capture_output=True, cwd=os.getcwd())
                
                if result.returncode == 0:
                    # Parse the JSON response - get only the first line which contains the JSON
                    json_output = result.stdout.split('\n')[0]
                    response_data = json.loads(json_output)
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps(response_data).encode())
                else:
                    # Handle error
                    error_response = {'error': result.stderr or 'Unknown error'}
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps(error_response).encode())
                    
            except Exception as e:
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
    PORT = 8000
    
    with socketserver.TCPServer(("", PORT), PokerHandler) as httpd:
        print(f"🚀 POKER SIMULATOR running on http://localhost:{PORT}")
        print("🐍 This calls your pokersim.py directly!")
        print(f"📱 Open http://localhost:5173 in your browser!")
        httpd.serve_forever()