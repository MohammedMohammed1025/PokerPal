import { useState } from 'react'
import './App.css'
import LiveSimulator from './components/LiveSimulator'
import OddsCalculator from './components/OddsCalculator'
import RangeCalculator from './components/RangeCalculator'
import EducationalContent from './components/EducationalContent'

// PokerPal - Professional Poker Analysis Platform
// Full-stack application with React frontend and Flask backend

type AppMode = 'menu' | 'simulator' | 'calculator' | 'range' | 'education'

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('menu')

  const handleModeSelect = (mode: 'simulator' | 'calculator' | 'range' | 'education') => {
    setCurrentMode(mode)
  }

  const handleBackToMenu = () => {
    setCurrentMode('menu')
  }

  if (currentMode === 'simulator') {
    return <LiveSimulator onBack={handleBackToMenu} />
  }

  if (currentMode === 'calculator') {
    return <OddsCalculator onBack={handleBackToMenu} />
  }

  if (currentMode === 'range') {
    return <RangeCalculator onBack={handleBackToMenu} />
  }

  if (currentMode === 'education') {
    return <EducationalContent onBack={handleBackToMenu} />
  }

  return (
    <div className="main-menu">
      <div className="hero-section">
        <div className="poker-suits">
          <span className="suit suit-spade">♠</span>
          <span className="suit suit-heart">♥</span>
          <span className="suit suit-diamond">♦</span>
          <span className="suit suit-club">♣</span>
        </div>
        <h1 className="main-title">PokerPal</h1>
        <p className="subtitle">Professional Poker Analysis & Simulation Platform</p>
        <p className="description">
          Master poker with advanced Monte Carlo simulations, real-time odds calculation, 
          and comprehensive hand analysis. Perfect for players of all skill levels.
        </p>
      </div>

      <div className="features-section">
        <div className="feature-card" onClick={() => handleModeSelect('simulator')}>
          <div className="feature-icon">🎲</div>
          <h3>Live Simulator</h3>
          <p>Watch hands unfold in real-time with automated simulations. See how different scenarios play out with thousands of Monte Carlo iterations.</p>
          <button className="feature-button">Launch Simulator</button>
        </div>

        <div className="feature-card" onClick={() => handleModeSelect('calculator')}>
          <div className="feature-icon">📊</div>
          <h3>Odds Calculator</h3>
          <p>Input your specific hands and board cards to get precise win percentages, hand rankings, and detailed probability analysis.</p>
          <button className="feature-button">Calculate Odds</button>
        </div>

        <div className="feature-card" onClick={() => handleModeSelect('range')}>
          <div className="feature-icon">🎯</div>
          <h3>Range vs Range</h3>
          <p>Compare hand ranges and calculate equity between different playing styles. Perfect for understanding range interactions and GTO play.</p>
          <button className="feature-button">Compare Ranges</button>
        </div>

        <div className="feature-card" onClick={() => handleModeSelect('education')}>
          <div className="feature-icon">📚</div>
          <h3>Learn Poker</h3>
          <p>Master poker fundamentals with hand rankings, strategy tips, terminology, and interactive quizzes to improve your game.</p>
          <button className="feature-button">Start Learning</button>
        </div>
      </div>

      <div className="info-section">
        <h2>What You Can Do</h2>
        <div className="info-grid">
          <div className="info-item">
            <strong>Monte Carlo Analysis</strong>
            <p>Run thousands of simulations to get accurate win percentages</p>
          </div>
          <div className="info-item">
            <strong>Range vs Range</strong>
            <p>Compare hand ranges and calculate equity between different playing styles</p>
          </div>
          <div className="info-item">
            <strong>Educational Content</strong>
            <p>Learn poker fundamentals with interactive quizzes and strategy guides</p>
          </div>
          <div className="info-item">
            <strong>Real-time Updates</strong>
            <p>See odds change as community cards are revealed</p>
          </div>
          <div className="info-item">
            <strong>Hand Rankings</strong>
            <p>Get instant hand strength analysis using professional poker evaluation</p>
          </div>
          <div className="info-item">
            <strong>Multiple Players</strong>
            <p>Analyze scenarios with 2-10 players at the table</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App