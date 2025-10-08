# 🃏 PokerPal

A poker analysis tool I built to combine my love for poker with my CompE coursework. Started as a simple odds calculator but grew into something much cooler - now it's got live simulations, range comparisons, and even a quiz to test your poker knowledge.

![PokerPal Demo](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-18.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Python](https://img.shields.io/badge/Python-3.12-yellow)

## ✨ Features

### 🎲 Live Simulator
- Real-time poker hand simulations with Monte Carlo analysis
- Automated dealing through all betting rounds (preflop, flop, turn, river)
- Real-time odds calculation using 1000+ iterations
- Hand rankings and win percentage display
- Customizable simulation speed and player count (2-10 players)

### 📊 Odds Calculator
- Input specific hands and community cards
- Stage-based analysis (preflop, flop, turn, river)
- Precise win percentages and hand rankings
- Support for 2-10 players
- Card validation and duplicate prevention

### 🎯 Range vs Range Calculator
- Compare different hand ranges and playing styles
- Predefined ranges: Tight, Loose, Premium, Suited Connectors, Pocket Pairs
- Interactive hand selection grid
- Equity calculation between ranges
- Visual equity bar display

### 📚 Educational Content Center
- **Hand Rankings Guide**: Complete poker hand hierarchy with examples and probabilities
- **Strategy Tips**: Position-based playing advice for different table positions
- **Poker Glossary**: Essential terms and definitions
- **Interactive Quiz**: 5-question knowledge test with explanations and scoring

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **CSS3** with glassmorphism design
- **Responsive Design** for all screen sizes

### Backend
- **Python 3.12** with `treys` library for poker hand evaluation
- **Flask** web framework for clean API endpoints
- **Monte Carlo simulation** for accurate odds calculation
- **CORS support** for frontend integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MohammedMohammed1025/PokerPal.git
   cd pokerpal
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies
   npm run install-all
   
   # Or install separately:
   # Frontend: cd frontend && npm install
   # Backend: pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   # Terminal 1: Start backend server
   python3 app.py
   
   # Terminal 2: Start frontend
   cd frontend && npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### 🌐 Live Demo
**Full Application**: [https://awake-friendship-production.up.railway.app](https://awake-friendship-production.up.railway.app)

> **Note**: The live demo includes full functionality with real poker calculations powered by the Flask backend.

## 📁 Project Structure

```
PokerPal/
├── frontend/                    # React TypeScript frontend
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── LiveSimulator.tsx
│   │   │   ├── OddsCalculator.tsx
│   │   │   ├── RangeCalculator.tsx
│   │   │   └── EducationalContent.tsx
│   │   ├── App.tsx            # Main application
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   └── pokersim.py            # Python poker calculations
├── app.py                     # Flask server (18 lines, clean & simple)
├── requirements.txt           # Python dependencies (treys, flask, flask-cors)
└── README.md
```

## 🎮 Usage

### Live Simulator
1. Click "Launch Simulator" from the main menu
2. Adjust simulation speed and player count
3. Click "Start Simulation" to begin automated dealing
4. Watch real-time odds and hand rankings update
5. Use "New Simulation" to start fresh after the river

### Odds Calculator
1. Click "Calculate Odds" from the main menu
2. Select game stage (preflop, flop, turn, river)
3. Input community cards (if applicable)
4. Enter player hands
5. Click "Calculate Odds" for instant results

### Range vs Range Calculator
1. Click "Compare Ranges" from the main menu
2. Select predefined ranges or create custom ones
3. Choose hands by clicking on the interactive grid
4. Add community cards if needed
5. Click "Calculate Range vs Range" for equity analysis

### Educational Content
1. Click "Start Learning" from the main menu
2. Navigate between Hand Rankings, Strategy Tips, Glossary, and Quiz
3. Take the interactive quiz to test your knowledge
4. Learn poker fundamentals at your own pace

## 🚧 Challenges & Lessons Learned

Building PokerPal taught me a lot about full-stack development. The biggest challenge was getting the Python `treys` library to work smoothly with React - I had to create a Flask server to bridge them since you can't run Python directly in the browser.

I also spent way too much time debugging duplicate card issues in the simulations. Turns out keeping track of used cards across different game phases is trickier than it looks!

The most rewarding part was seeing the Monte Carlo simulations actually work. Running 1000+ iterations to get accurate odds felt like magic the first time it worked.

## 🎯 What I Learned

This project was a great way to practice full-stack development. I got to work with React and TypeScript on the frontend, Python for the heavy math stuff, and learned how to connect them with Flask.

The Monte Carlo simulations were probably the coolest part - watching it run thousands of poker hands to calculate accurate odds was pretty satisfying. Also learned a ton about state management in React, especially when dealing with real-time updates.

Deploying to Railway taught me about production deployments and how to handle environment variables and static file serving in Flask.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 👨‍💻 Author

**Mohammed Mohammed**
- Computer Engineering Student at UIUC
- GitHub: [@MohammedMohammed1025](https://github.com/MohammedMohammed1025)

## 🙏 Acknowledgments

- [treys](https://github.com/ihendley/treys) - Python poker hand evaluation library
- [React](https://reactjs.org/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool and dev server

---

⭐ **Star this repository if you found it helpful!**
