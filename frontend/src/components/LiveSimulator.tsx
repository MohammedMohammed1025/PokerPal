import React, { useState, useEffect, useCallback } from 'react';
import './LiveSimulator.css';

interface LiveSimulatorProps {
  onBack?: () => void;
}

interface Player {
  name: string;
  cards: string[];
  isActive: boolean;
  position: number;
}

interface OddsData {
  wins: number[];
  ties: number[];
  win_percentages: number[];
  tie_percentages: number[];
  hand_rankings: string[];
}

const LiveSimulator: React.FC<LiveSimulatorProps> = ({ onBack }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [board, setBoard] = useState<string[]>([]);
  const [gamePhase, setGamePhase] = useState<'preflop' | 'flop' | 'turn' | 'river'>('preflop');
  const [odds, setOdds] = useState<OddsData | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(2000); // how fast cards deal
  const [simulationCount, setSimulationCount] = useState(0);
  const [isRiverComplete, setIsRiverComplete] = useState(false);

  // pick 2 random cards for a player
  const generateRandomHand = useCallback((usedCards: Set<string>) => {
    const faces = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const suits = ['s', 'h', 'd', 'c'];
    
    let hand: string[] = [];
    let attempts = 0;
    while (hand.length < 2 && attempts < 100) {
      const face = faces[Math.floor(Math.random() * faces.length)];
      const suit = suits[Math.floor(Math.random() * suits.length)];
      const card = face + suit;
      
      if (!usedCards.has(card)) {
        hand.push(card);
        usedCards.add(card);
      }
      attempts++;
    }
    
    return hand;
  }, []);

  // pick random community cards (flop/turn/river)
  const generateRandomBoard = useCallback((phase: 'flop' | 'turn' | 'river', usedCards: Set<string>) => {
    const faces = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const suits = ['s', 'h', 'd', 'c'];
    
    let newCards: string[] = [];
    const numCards = phase === 'flop' ? 3 : 1;
    let attempts = 0;
    
    while (newCards.length < numCards && attempts < 100) {
      const face = faces[Math.floor(Math.random() * faces.length)];
      const suit = suits[Math.floor(Math.random() * suits.length)];
      const card = face + suit;
      
      if (!usedCards.has(card)) {
        newCards.push(card);
        usedCards.add(card);
      }
      attempts++;
    }
    
    return newCards;
  }, []);

  // ask the Python server for win percentages
  const calculateOdds = useCallback(async (hands: string[][], board: string[]) => {
    try {
      const response = await fetch('/calculate', {
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
        console.error('Backend error:', result.error);
        throw new Error(result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Error calling Python backend:', error);
      throw new Error('Failed to calculate odds. Please try again.');
    }
  }, []);

  // start a new poker hand
  const initializeGame = useCallback(() => {
    const numPlayers = 4;
    const newPlayers = Array.from({ length: numPlayers }, (_, i) => ({
      name: `Player ${i + 1}`,
      cards: [],
      isActive: i === 0,
      position: i + 1
    }));
    
    setPlayers(newPlayers);
    setBoard([]);
    setGamePhase('preflop');
    setOdds(null);
    setSimulationCount(0);
  }, []);

  // deal the next cards (flop, turn, river)
  const nextStep = useCallback(async () => {
    if (gamePhase === 'preflop') {
      // give each player 2 cards
      const usedCards = new Set<string>();
      const newPlayers = players.map(player => ({
        ...player,
        cards: generateRandomHand(usedCards)
      }));
      setPlayers(newPlayers);
      
      // check who's winning before flop
      const hands = newPlayers.map(p => p.cards);
      const newOdds = await calculateOdds(hands, []);
      setOdds(newOdds);
      setGamePhase('flop');
      setSimulationCount(prev => prev + 1);
    } else if (gamePhase === 'flop') {
      // deal 3 community cards
      const usedCards = new Set<string>();
      players.forEach(player => {
        player.cards.forEach(card => usedCards.add(card));
      });
      
      const newBoard = generateRandomBoard('flop', usedCards);
      setBoard(newBoard);
      setGamePhase('turn');
      
      // check who's winning after flop
      const hands = players.map(p => p.cards);
      const newOdds = await calculateOdds(hands, newBoard);
      setOdds(newOdds);
      setSimulationCount(prev => prev + 1);
    } else if (gamePhase === 'turn') {
      // deal 1 more community card
      const usedCards = new Set<string>();
      players.forEach(player => {
        player.cards.forEach(card => usedCards.add(card));
      });
      board.forEach(card => usedCards.add(card));
      
      const newBoard = [...board, ...generateRandomBoard('turn', usedCards)];
      setBoard(newBoard);
      setGamePhase('river');
      
      // check who's winning after turn
      const hands = players.map(p => p.cards);
      const newOdds = await calculateOdds(hands, newBoard);
      setOdds(newOdds);
      setSimulationCount(prev => prev + 1);
    } else if (gamePhase === 'river') {
      // deal the final community card
      const usedCards = new Set<string>();
      players.forEach(player => {
        player.cards.forEach(card => usedCards.add(card));
      });
      board.forEach(card => usedCards.add(card));
      
      const newBoard = [...board, ...generateRandomBoard('river', usedCards)];
      setBoard(newBoard);
      
      // check final winner
      const hands = players.map(p => p.cards);
      const newOdds = await calculateOdds(hands, newBoard);
      setOdds(newOdds);
      setSimulationCount(prev => prev + 1);
      
      // hand is over - click "New Simulation" to start again
      setIsRiverComplete(true);
    }
  }, [gamePhase, players, board, generateRandomHand, generateRandomBoard, calculateOdds]);

  // Auto simulation effect
  useEffect(() => {
    let interval: number;
    
    if (isSimulating && !isRiverComplete) {
      interval = setInterval(() => {
        nextStep();
      }, simulationSpeed);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isSimulating, simulationSpeed, nextStep, isRiverComplete]);

  // Initialize on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Format card for display
  const formatCard = (card: string) => {
    if (!card || card.length !== 2) return { symbol: card || '', isRed: false };
    const face = card[0].toUpperCase();
    const suit = card[1].toLowerCase();
    const suitSymbols = { 's': '♠', 'h': '♥', 'd': '♦', 'c': '♣' };
    const suitSymbol = suitSymbols[suit as keyof typeof suitSymbols];
    const isRed = suit === 'h' || suit === 'd';
    return { symbol: `${face}${suitSymbol}`, isRed };
  };

  return (
    <div className="live-simulator">
      {/* Header */}
      <div className="simulator-header">
        <div className="header-top">
          {onBack && (
            <button className="back-button" onClick={onBack}>
              ← Back to Menu
            </button>
          )}
        </div>
        <h1>🎲 PokerPal Live Simulator</h1>
        <p>Watch poker hands unfold in real-time with Monte Carlo analysis</p>
      </div>

      {/* Controls */}
      <div className="controls">
        <button 
          className={`control-btn ${isSimulating ? 'pause' : 'play'}`}
          onClick={() => setIsSimulating(!isSimulating)}
        >
          {isSimulating ? '⏸️ Pause' : '▶️ Play'}
        </button>
        
        <button 
          className="control-btn reset"
          onClick={() => {
            setIsSimulating(false);
            setBoard([]);
            setGamePhase('preflop');
            setOdds(null);
            setSimulationCount(0);
            setIsRiverComplete(false);
            initializeGame();
          }}
        >
          🔄 Reset
        </button>
        
        <button 
          className="control-btn step"
          onClick={nextStep}
          disabled={isSimulating || isRiverComplete}
        >
          ⏭️ Next Step
        </button>
        
        <div className="speed-control">
          <label>Speed:</label>
          <select 
            value={simulationSpeed} 
            onChange={(e) => setSimulationSpeed(Number(e.target.value))}
          >
            <option value={500}>Fast (0.5s)</option>
            <option value={1000}>Normal (1s)</option>
            <option value={2000}>Slow (2s)</option>
            <option value={3000}>Very Slow (3s)</option>
          </select>
        </div>
      </div>

      {/* Game Info */}
      <div className="game-info">
        <div className="phase">Phase: <strong>{board.length === 0 ? 'PREFLOP' : board.length === 3 ? 'FLOP' : board.length === 4 ? 'TURN' : board.length === 5 ? 'RIVER' : 'PREFLOP'}</strong></div>
        <div className="simulation-count">Simulations: <strong>{simulationCount}</strong></div>
        {isRiverComplete && (
          <button 
            className="new-simulation-btn"
            onClick={() => {
              setGamePhase('preflop');
              setBoard([]);
              setOdds(null);
              setIsRiverComplete(false);
            }}
          >
            🎯 New Simulation
          </button>
        )}
      </div>

      {/* Poker Table */}
      <div className="poker-table">
        {/* Community Cards */}
        <div className="community-cards">
          <h3>Community Cards</h3>
          <div className="cards-container">
            {board.length > 0 ? (
              board.map((card, index) => {
                const cardData = formatCard(card);
                return (
                  <div 
                    key={index}
                    className={`card community-card ${cardData.isRed ? 'red' : 'black'}`}
                  >
                    {cardData.symbol}
                  </div>
                );
              })
            ) : (
              <div className="card-placeholder">No cards yet</div>
            )}
          </div>
        </div>

        {/* Players */}
        <div className="players">
          {players.map((player, index) => (
            <div key={index} className={`player ${player.isActive ? 'active' : ''}`}>
              <div className="player-info">
                <h4>{player.name}</h4>
                {odds && (
                  <div className="odds">
                    <div className="win-percentage">
                      Win: {odds.win_percentages[index]?.toFixed(1)}%
                    </div>
                    <div className="tie-percentage">
                      Tie: {odds.tie_percentages[index]?.toFixed(1)}%
                    </div>
                    <div className="hand-ranking">
                      {odds.hand_rankings[index]}
                    </div>
                  </div>
                )}
              </div>
              <div className="player-cards">
                {player.cards.map((card, cardIndex) => {
                  const cardData = formatCard(card);
                  return (
                    <div 
                      key={cardIndex}
                      className={`card player-card ${cardData.isRed ? 'red' : 'black'}`}
                    >
                      {cardData.symbol}
                    </div>
                  );
                })}
                {player.cards.length === 0 && (
                  <div className="card-placeholder">No cards</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveSimulator;
