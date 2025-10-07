import React, { useState } from 'react'
import './App.css'
import LiveSimulator from './components/LiveSimulator'
import OddsCalculator from './components/OddsCalculator'

type AppMode = 'menu' | 'simulator' | 'calculator'

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('menu')

  const handleModeSelect = (mode: 'simulator' | 'calculator') => {
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

  return (
    <div className="main-menu">
      <div className="hero-section">
        <div className="poker-suits">
          <span className="suit suit-spade">♠</span>
          <span className="suit suit-heart">♥</span>
          <span className="suit suit-diamond">♦</span>
          <span className="suit suit-club">♣</span>
        </div>
        <h1 className="main-title">ALL IN SIM</h1>
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
      </div>

      <div className="info-section">
        <h2>What You Can Do</h2>
        <div className="info-grid">
          <div className="info-item">
            <strong>Monte Carlo Analysis</strong>
            <p>Run thousands of simulations to get accurate win percentages</p>
          </div>
          <div className="info-item">
            <strong>Hand Rankings</strong>
            <p>Get instant hand strength analysis using professional poker evaluation</p>
          </div>
          <div className="info-item">
            <strong>Real-time Updates</strong>
            <p>See odds change as community cards are revealed</p>
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