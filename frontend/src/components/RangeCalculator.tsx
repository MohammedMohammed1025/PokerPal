import React, { useState, useCallback } from 'react';
import './RangeCalculator.css';

interface RangeCalculatorProps {
  onBack?: () => void;
}

interface HandRange {
  id: string;
  name: string;
  hands: string[];
  color: string;
}

interface RangeVsRangeResult {
  range1: string;
  range2: string;
  win_percentages: number[];
  tie_percentages: number[];
  equity: number;
  total_hands: number;
}

type GameStage = 'preflop' | 'flop' | 'turn' | 'river';

const RangeCalculator: React.FC<RangeCalculatorProps> = ({ onBack }) => {
  const [gameStage, setGameStage] = useState<GameStage>('preflop');
  const [range1, setRange1] = useState<HandRange>({ id: 'range1', name: 'Range 1', hands: [], color: '#ff6b6b' });
  const [range2, setRange2] = useState<HandRange>({ id: 'range2', name: 'Range 2', hands: [], color: '#4ecdc4' });
  const [communityCards, setCommunityCards] = useState<string[]>([]);
  const [results, setResults] = useState<RangeVsRangeResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSelectingRange, setIsSelectingRange] = useState<'range1' | 'range2' | null>(null);

  // Predefined hand ranges
  const predefinedRanges = {
    'Tight': ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', 'AKs', 'AQs', 'AJs', 'AKo', 'AQo'],
    'Loose': ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s', 'KQo', 'KJo', 'KTo', 'K9o', 'K8o', 'K7o', 'K6o', 'K5o', 'K4o', 'K3o', 'K2o', 'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s', 'QJo', 'QTo', 'Q9o', 'Q8o', 'Q7o', 'Q6o', 'Q5o', 'Q4o', 'Q3o', 'Q2o', 'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s', 'JTo', 'J9o', 'J8o', 'J7o', 'J6o', 'J5o', 'J4o', 'J3o', 'J2o', 'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s', 'T2s', 'T9o', 'T8o', 'T7o', 'T6o', 'T5o', 'T4o', 'T3o', 'T2o', '98s', '97s', '96s', '95s', '94s', '93s', '92s', '98o', '97o', '96o', '95o', '94o', '93o', '92o', '87s', '86s', '85s', '84s', '83s', '82s', '87o', '86o', '85o', '84o', '83o', '82o', '76s', '75s', '74s', '73s', '72s', '76o', '75o', '74o', '73o', '72o', '65s', '64s', '63s', '62s', '65o', '64o', '63o', '62o', '54s', '53s', '52s', '54o', '53o', '52o', '43s', '42s', '43o', '42o', '32s', '32o'],
    'Premium': ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AQs', 'AJs', 'AKo', 'AQo'],
    'Suited Connectors': ['AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s', 'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s', 'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s', 'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s', 'T2s', '98s', '97s', '96s', '95s', '94s', '93s', '92s', '87s', '86s', '85s', '84s', '83s', '82s', '76s', '75s', '74s', '73s', '72s', '65s', '64s', '63s', '62s', '54s', '53s', '52s', '43s', '42s', '32s'],
    'Pocket Pairs': ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22']
  };

  // All possible hands
  const allHands = [
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
    'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o',
    'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
    'KQo', 'KJo', 'KTo', 'K9o', 'K8o', 'K7o', 'K6o', 'K5o', 'K4o', 'K3o', 'K2o',
    'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s',
    'QJo', 'QTo', 'Q9o', 'Q8o', 'Q7o', 'Q6o', 'Q5o', 'Q4o', 'Q3o', 'Q2o',
    'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s',
    'JTo', 'J9o', 'J8o', 'J7o', 'J6o', 'J5o', 'J4o', 'J3o', 'J2o',
    'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s', 'T2s',
    'T9o', 'T8o', 'T7o', 'T6o', 'T5o', 'T4o', 'T3o', 'T2o',
    '98s', '97s', '96s', '95s', '94s', '93s', '92s',
    '98o', '97o', '96o', '95o', '94o', '93o', '92o',
    '87s', '86s', '85s', '84s', '83s', '82s',
    '87o', '86o', '85o', '84o', '83o', '82o',
    '76s', '75s', '74s', '73s', '72s',
    '76o', '75o', '74o', '73o', '72o',
    '65s', '64s', '63s', '62s',
    '65o', '64o', '63o', '62o',
    '54s', '53s', '52s',
    '54o', '53o', '52o',
    '43s', '42s',
    '43o', '42o',
    '32s', '32o'
  ];

  // Update community cards based on game stage
  React.useEffect(() => {
    const maxCards = gameStage === 'preflop' ? 0 : gameStage === 'flop' ? 3 : gameStage === 'turn' ? 4 : 5;
    if (maxCards === 0) {
      setCommunityCards([]);
    } else {
      setCommunityCards(prev => {
        const newCards = Array.from({ length: maxCards }, (_, i) => prev[i] || '');
        return newCards;
      });
    }
  }, [gameStage]);

  // Calculate range vs range
  const calculateRangeVsRange = useCallback(async () => {
    if (range1.hands.length === 0 || range2.hands.length === 0) {
      setError('Both ranges must have at least one hand');
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      // Convert ranges to specific hands for calculation
      const range1Hands = range1.hands.map(hand => {
        if (hand.endsWith('s')) {
          const face1 = hand[0];
          const face2 = hand[1];
          return [face1 + 's', face2 + 's'];
        } else if (hand.endsWith('o')) {
          const face1 = hand[0];
          const face2 = hand[1];
          return [face1 + 's', face2 + 'h'];
        } else {
          // Pocket pair
          return [hand[0] + 's', hand[0] + 'h'];
        }
      });

      const range2Hands = range2.hands.map(hand => {
        if (hand.endsWith('s')) {
          const face1 = hand[0];
          const face2 = hand[1];
          return [face1 + 'd', face2 + 'c'];
        } else if (hand.endsWith('o')) {
          const face1 = hand[0];
          const face2 = hand[1];
          return [face1 + 'd', face2 + 'c'];
        } else {
          // Pocket pair
          return [hand[0] + 'd', hand[0] + 'c'];
        }
      });

      // Flatten and create all combinations
      const allHands = [];
      for (const hand1 of range1Hands) {
        for (const hand2 of range2Hands) {
          allHands.push([hand1, hand2]);
        }
      }

      // Calculate for each combination
      const results = [];
      for (const hands of allHands) {
        const response = await fetch('http://localhost:8000/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            hands: hands,
            board: communityCards.filter(card => card.trim()),
            num_sims: 100
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }

        results.push(result);
      }

      // Calculate average equity
      const totalEquity = results.reduce((sum, result) => sum + result.win_percentages[0], 0);
      const averageEquity = totalEquity / results.length;

      setResults({
        range1: range1.name,
        range2: range2.name,
        win_percentages: [averageEquity, 100 - averageEquity],
        tie_percentages: [0, 0],
        equity: averageEquity,
        total_hands: allHands.length
      });

    } catch (error) {
      // Show demo mode message
      alert('🎮 Demo Mode: Backend not available. For real calculations, run locally with: python3 test_server.py');
      setError(error instanceof Error ? error.message : 'An error occurred');
      setResults(null);
    } finally {
      setIsCalculating(false);
    }
  }, [range1, range2, communityCards]);

  // Apply predefined range
  const applyPredefinedRange = (rangeName: string, targetRange: 'range1' | 'range2') => {
    const hands = predefinedRanges[rangeName as keyof typeof predefinedRanges] || [];
    if (targetRange === 'range1') {
      setRange1(prev => ({ ...prev, hands }));
    } else {
      setRange2(prev => ({ ...prev, hands }));
    }
  };

  // Toggle hand selection
  const toggleHand = (hand: string) => {
    if (isSelectingRange) {
      const currentRange = isSelectingRange === 'range1' ? range1 : range2;
      const newHands = currentRange.hands.includes(hand)
        ? currentRange.hands.filter(h => h !== hand)
        : [...currentRange.hands, hand];

      if (isSelectingRange === 'range1') {
        setRange1(prev => ({ ...prev, hands: newHands }));
      } else {
        setRange2(prev => ({ ...prev, hands: newHands }));
      }
    }
  };

  // Get stage description
  const getStageDescription = (stage: GameStage) => {
    switch (stage) {
      case 'preflop': return 'Hole cards only - no community cards';
      case 'flop': return '3 community cards dealt';
      case 'turn': return '4 community cards dealt';
      case 'river': return 'All 5 community cards dealt';
    }
  };

  return (
    <div className="range-calculator">
      {/* Header */}
      <div className="calculator-header">
        <div className="header-top">
          {onBack && (
            <button className="back-button" onClick={onBack}>
              ← Back to Menu
            </button>
          )}
        </div>
        <h1>🎯 PokerPal Range vs Range Calculator</h1>
        <p>Compare hand ranges and calculate equity in poker scenarios</p>
      </div>

      <div className="calculator-content">
        {/* Game Configuration */}
        <div className="config-section">
          <h2>Game Configuration</h2>
          
          {/* Game Stage Selection */}
          <div className="stage-selection">
            <label>Game Stage:</label>
            <div className="stage-buttons">
              {(['preflop', 'flop', 'turn', 'river'] as GameStage[]).map(stage => (
                <button
                  key={stage}
                  className={`stage-btn ${gameStage === stage ? 'active' : ''}`}
                  onClick={() => setGameStage(stage)}
                >
                  {stage.toUpperCase()}
                </button>
              ))}
            </div>
            <p className="stage-description">{getStageDescription(gameStage)}</p>
          </div>
        </div>

        {/* Community Cards */}
        {gameStage !== 'preflop' && (
          <div className="community-section">
            <h2>Community Cards</h2>
            <div className="community-cards-input">
              {communityCards.map((card, index) => (
                <div key={index} className="card-input-group">
                  <label>{index < 3 ? 'Flop' : index === 3 ? 'Turn' : 'River'}:</label>
                  <input
                    type="text"
                    value={card}
                    onChange={(e) => {
                      const newCards = [...communityCards];
                      newCards[index] = e.target.value;
                      setCommunityCards(newCards);
                    }}
                    placeholder="e.g., As"
                    className="card-input"
                    maxLength={2}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Range Selection */}
        <div className="ranges-section">
          <h2>Hand Ranges</h2>
          
          <div className="ranges-container">
            {/* Range 1 */}
            <div className="range-container">
              <div className="range-header">
                <h3 style={{ color: range1.color }}>{range1.name}</h3>
                <div className="range-controls">
                  <select 
                    onChange={(e) => applyPredefinedRange(e.target.value, 'range1')}
                    className="predefined-select"
                  >
                    <option value="">Select Predefined Range</option>
                    {Object.keys(predefinedRanges).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <button 
                    className={`range-btn ${isSelectingRange === 'range1' ? 'active' : ''}`}
                    onClick={() => setIsSelectingRange(isSelectingRange === 'range1' ? null : 'range1')}
                  >
                    {isSelectingRange === 'range1' ? 'Stop Selecting' : 'Select Hands'}
                  </button>
                </div>
              </div>
              <div className="selected-hands">
                {range1.hands.map(hand => (
                  <span key={hand} className="hand-tag" style={{ backgroundColor: range1.color }}>
                    {hand}
                  </span>
                ))}
                {range1.hands.length === 0 && (
                  <span className="no-hands">No hands selected</span>
                )}
              </div>
            </div>

            {/* Range 2 */}
            <div className="range-container">
              <div className="range-header">
                <h3 style={{ color: range2.color }}>{range2.name}</h3>
                <div className="range-controls">
                  <select 
                    onChange={(e) => applyPredefinedRange(e.target.value, 'range2')}
                    className="predefined-select"
                  >
                    <option value="">Select Predefined Range</option>
                    {Object.keys(predefinedRanges).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <button 
                    className={`range-btn ${isSelectingRange === 'range2' ? 'active' : ''}`}
                    onClick={() => setIsSelectingRange(isSelectingRange === 'range2' ? null : 'range2')}
                  >
                    {isSelectingRange === 'range2' ? 'Stop Selecting' : 'Select Hands'}
                  </button>
                </div>
              </div>
              <div className="selected-hands">
                {range2.hands.map(hand => (
                  <span key={hand} className="hand-tag" style={{ backgroundColor: range2.color }}>
                    {hand}
                  </span>
                ))}
                {range2.hands.length === 0 && (
                  <span className="no-hands">No hands selected</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hand Selection Grid */}
        {isSelectingRange && (
          <div className="hand-selection-section">
            <h2>Select Hands for {isSelectingRange === 'range1' ? range1.name : range2.name}</h2>
            <div className="hand-grid">
              {allHands.map(hand => {
                const currentRange = isSelectingRange === 'range1' ? range1 : range2;
                const isSelected = currentRange.hands.includes(hand);
                return (
                  <button
                    key={hand}
                    className={`hand-button ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleHand(hand)}
                    style={{
                      backgroundColor: isSelected ? currentRange.color : 'rgba(255, 255, 255, 0.1)',
                      borderColor: currentRange.color
                    }}
                  >
                    {hand}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Calculate Button */}
        <div className="calculate-section">
          <button 
            className="calculate-btn"
            onClick={calculateRangeVsRange}
            disabled={isCalculating || range1.hands.length === 0 || range2.hands.length === 0}
          >
            {isCalculating ? '🔄 Calculating...' : '🎯 Calculate Range vs Range'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="results-section">
            <h2>Range vs Range Results</h2>
            <div className="range-results">
              <div className="equity-display">
                <div className="equity-bar">
                  <div 
                    className="equity-fill range1-fill"
                    style={{ 
                      width: `${results.equity}%`,
                      backgroundColor: range1.color 
                    }}
                  >
                    <span className="equity-text">
                      {range1.name}: {results.equity.toFixed(1)}%
                    </span>
                  </div>
                  <div 
                    className="equity-fill range2-fill"
                    style={{ 
                      width: `${100 - results.equity}%`,
                      backgroundColor: range2.color 
                    }}
                  >
                    <span className="equity-text">
                      {range2.name}: {(100 - results.equity).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="results-details">
                <div className="result-stat">
                  <span className="stat-label">Total Hand Combinations:</span>
                  <span className="stat-value">{results.total_hands}</span>
                </div>
                <div className="result-stat">
                  <span className="stat-label">Range 1 Equity:</span>
                  <span className="stat-value">{results.equity.toFixed(2)}%</span>
                </div>
                <div className="result-stat">
                  <span className="stat-label">Range 2 Equity:</span>
                  <span className="stat-value">{(100 - results.equity).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RangeCalculator;
