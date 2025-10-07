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
                
                # Test the subprocess call
                json_input = json.dumps(data)
                print(f"Sending to pokersim.py: {json_input}")
                
                result = subprocess.run([
                    sys.executable, 'backend/pokersim.py'
                ], input=json_input, text=True, capture_output=True, cwd=os.getcwd())
                
                print(f"Return code: {result.returncode}")
                print(f"Stdout: {repr(result.stdout)}")
                print(f"Stderr: {repr(result.stderr)}")
                
                if result.returncode == 0:
                    # Parse the JSON response - get only the first line which contains the JSON
                    lines = result.stdout.strip().split('\n')
                    json_line = lines[0] if lines else ""
                    print(f"JSON line: {repr(json_line)}")
                    
                    if json_line:
                        response_data = json.loads(json_line)
                        print(f"Parsed response: {response_data}")
                    else:
                        raise ValueError("No JSON output from pokersim.py")
                else:
                    print(f"Pokersim failed with return code {result.returncode}")
                    raise Exception(f"Pokersim failed: {result.stderr}")
                
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
    PORT = 8002
    
    with socketserver.TCPServer(("", PORT), PokerHandler) as httpd:
        print(f"🚀 DEBUG POKER SERVER running on http://localhost:{PORT}")
        print("📱 Open http://localhost:5173 in your browser!")
        httpd.serve_forever()
