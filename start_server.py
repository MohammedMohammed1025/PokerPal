#!/usr/bin/env python3
"""
Startup script for PokerPal Flask server
"""

import subprocess
import sys
import os

def main():
    print("🚀 Starting PokerPal Flask Server...")
    
    # Install dependencies if needed
    print("📦 Installing dependencies...")
    subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
    
    # Start Flask server
    print("🐍 Starting Flask server...")
    subprocess.run([sys.executable, 'app.py'], check=True)

if __name__ == "__main__":
    main()