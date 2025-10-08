import React, { useState, useCallback } from 'react';
import './OddsCalculator.css';

interface OddsCalculatorProps {
  onBack?: () => void;
}

interface Player {
  id: number;
  name: string;
  cards: string[];
}

interface OddsData {
  wins: number[];
  ties: number[];
  win_percentages: number[];
  tie_percentages: number[];
  hand_rankings: string[];
}

type GameStage = 'preflop' | 'flop' | 'turn' | 'river';

const OddsCalculator: React.FC<OddsCalculatorProps> = ({ onBack }) => {
  const [gameStage, setGameStage] = useState<GameStage>('preflop');
  const [numPlayers, setNumPlayers] = useState(4);
  const [players, setPlayers] = useState<Player[]>([]);
  const [communityCards, setCommunityCards] = useState<string[]>([]);
  const [odds, setOdds] = useState<OddsData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // add/remove players when you change the number
  React.useEffect(() => {
    const newPlayers = Array.from({ length: numPlayers }, (_, i) => ({
      id: i,
      name: `Player ${i + 1}`,
      cards: ['', '']
    }));
    setPlayers(newPlayers);
  }, [numPlayers]);

  // set up community cards based on what stage you pick
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

  // ask the Python server for win percentages
  const calculateOdds = useCallback(async () => {
    setIsCalculating(true);
    setError(null);
    
    try {
      // make sure all cards are filled in
      const allCards: string[] = [];
      
      // get all the player cards
      players.forEach(player => {
        player.cards.forEach(card => {
          if (card.trim()) {
            allCards.push(card.trim().toUpperCase());
          }
        });
      });
      
      // get all the community cards
      communityCards.forEach(card => {
        if (card.trim()) {
          allCards.push(card.trim().toUpperCase());
        }
      });
      
      // make sure no card is used twice
      const uniqueCards = new Set(allCards);
      if (uniqueCards.size !== allCards.length) {
        throw new Error('Duplicate cards detected! Please check your inputs.');
      }
      
      // make sure everyone has 2 cards
      const incompletePlayers = players.filter(p => p.cards.some(card => !card.trim()));
      if (incompletePlayers.length > 0) {
        throw new Error('All players must have 2 cards!');
      }
      
      // send the cards to the Python server
      const hands = players.map(p => p.cards.map(card => card.trim().toUpperCase()));
      const board = communityCards.map(card => card.trim().toUpperCase()).filter(card => card);
      
      const response = await fetch('http://localhost:8000/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hands: hands,
          board: board,
          num_sims: 1000
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setOdds(result);
    } catch (error) {
      // show warning when Python server isn't running
            alert('🎮 Demo Mode: Backend not available. For real calculations, run locally with: python3 app.py');
      setError(error instanceof Error ? error.message : 'An error occurred');
      setOdds(null);
    } finally {
      setIsCalculating(false);
    }
  }, [players, communityCards]);

  // Update player card
  const updatePlayerCard = (playerId: number, cardIndex: number, value: string) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, cards: player.cards.map((card, idx) => idx === cardIndex ? value : card) }
        : player
    ));
  };

  // Update community card
  const updateCommunityCard = (cardIndex: number, value: string) => {
    setCommunityCards(prev => prev.map((card, idx) => idx === cardIndex ? value : card));
  };

  // Format card for display
  const formatCard = (card: string) => {
    if (!card || card.length !== 2) return { symbol: card, isRed: false };
    const face = card[0].toUpperCase();
    const suit = card[1].toLowerCase();
    const suitSymbols = { 's': '♠', 'h': '♥', 'd': '♦', 'c': '♣' };
    const suitSymbol = suitSymbols[suit as keyof typeof suitSymbols];
    const isRed = suit === 'h' || suit === 'd';
    return { symbol: `${face}${suitSymbol}`, isRed };
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
    <div className="odds-calculator">
      {/* Header */}
      <div className="calculator-header">
        <div className="header-top">
          {onBack && (
            <button className="back-button" onClick={onBack}>
              ← Back to Menu
            </button>
          )}
        </div>
        <h1>📊 PokerPal Odds Calculator</h1>
        <p>Input specific hands and board cards for precise win percentages</p>
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

          {/* Number of Players */}
          <div className="player-count">
            <label>Number of Players:</label>
            <select 
              value={numPlayers} 
              onChange={(e) => setNumPlayers(Number(e.target.value))}
              className="player-select"
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num} Players</option>
              ))}
            </select>
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
                    onChange={(e) => updateCommunityCard(index, e.target.value)}
                    placeholder="e.g., As"
                    className="card-input"
                    maxLength={2}
                  />
                  {card && (
                    <div className={`card-preview ${formatCard(card).isRed ? 'red' : 'black'}`}>
                      {formatCard(card).symbol}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Player Hands */}
        <div className="players-section">
          <h2>Player Hands</h2>
          <div className="players-grid">
            {players.map((player) => (
              <div key={player.id} className="player-input">
                <h3>{player.name}</h3>
                <div className="player-cards">
                  {player.cards.map((card, cardIndex) => (
                    <div key={cardIndex} className="card-input-group">
                      <label>Card {cardIndex + 1}:</label>
                      <input
                        type="text"
                        value={card}
                        onChange={(e) => updatePlayerCard(player.id, cardIndex, e.target.value)}
                        placeholder="e.g., As"
                        className="card-input"
                        maxLength={2}
                      />
                      {card && (
                        <div className={`card-preview ${formatCard(card).isRed ? 'red' : 'black'}`}>
                          {formatCard(card).symbol}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <div className="calculate-section">
          <button 
            className="calculate-btn"
            onClick={calculateOdds}
            disabled={isCalculating}
          >
            {isCalculating ? '🔄 Calculating...' : '📊 Calculate Odds'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* Results */}
        {odds && (
          <div className="results-section">
            <h2>Results</h2>
            <div className="results-grid">
              {players.map((player, index) => (
                <div key={player.id} className="result-card">
                  <h3>{player.name}</h3>
                  <div className="player-hand-display">
                    {player.cards.map((card, cardIndex) => {
                      const cardData = formatCard(card);
                      return (
                        <div 
                          key={cardIndex} 
                          className={`result-card-display ${cardData.isRed ? 'red' : 'black'}`}
                        >
                          {cardData.symbol}
                        </div>
                      );
                    })}
                  </div>
                  <div className="odds-display">
                    <div className="win-percentage">
                      <span className="label">Win:</span>
                      <span className="value">{odds.win_percentages[index]?.toFixed(1)}%</span>
                    </div>
                    <div className="tie-percentage">
                      <span className="label">Tie:</span>
                      <span className="value">{odds.tie_percentages[index]?.toFixed(1)}%</span>
                    </div>
                    <div className="hand-ranking">
                      <span className="label">Hand:</span>
                      <span className="value">{odds.hand_rankings[index]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OddsCalculator;
