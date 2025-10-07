#!/usr/bin/env python3
import http.server
import socketserver
import json
import subprocess
import sys
import os
from urllib.parse import urlparse

class PokerHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/poker.html'
        return super().do_GET()
    
    def do_POST(self):
        if self.path == '/calculate':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                # Call your pokersim.py directly - this is the simplest way!
                cmd = [sys.executable, 'backend/pokersim.py', json.dumps(data)]
                result = subprocess.run(cmd, capture_output=True, text=True, cwd=os.getcwd())
                
                if result.returncode == 0:
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(result.stdout.encode())
                else:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': result.stderr}).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    PORT = 8000
    with socketserver.TCPServer(("", PORT), PokerHandler) as httpd:
        print(f"🚀 SIMPLEST POKER SERVER running at http://localhost:{PORT}")
        print("📁 Just open http://localhost:8000 in your browser!")
        print("🐍 This calls your pokersim.py directly - no complex APIs!")
        httpd.serve_forever()

