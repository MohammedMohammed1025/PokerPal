import React, { useState, useEffect, useCallback } from 'react';
import PokerTable from './PokerTable';

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
}

const AutoSimulation: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [board, setBoard] = useState<string[]>([]);
  const [gamePhase, setGamePhase] = useState<'preflop' | 'flop' | 'turn' | 'river'>('preflop');
  const [odds, setOdds] = useState<OddsData | null>(null);
  const [simulationCount, setSimulationCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate random cards
  const generateRandomCard = useCallback(() => {
    const faces = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const suits = ['s', 'h', 'd', 'c'];
    const face = faces[Math.floor(Math.random() * faces.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    return face + suit;
  }, []);

  // Generate random hand
  const generateRandomHand = useCallback(() => {
    const usedCards = new Set<string>();
    const hand = [];
    
    while (hand.length < 2) {
      const card = generateRandomCard();
      if (!usedCards.has(card)) {
        usedCards.add(card);
        hand.push(card);
      }
    }
    
    return hand;
  }, [generateRandomCard]);

  // Generate random board
  const generateRandomBoard = useCallback((phase: 'preflop' | 'flop' | 'turn' | 'river') => {
    const usedCards = new Set<string>();
    
    // Add all player cards to used cards
    players.forEach(player => {
      player.cards.forEach(card => usedCards.add(card));
    });
    
    const board = [];
    const cardsNeeded = phase === 'preflop' ? 0 : phase === 'flop' ? 3 : phase === 'turn' ? 4 : 5;
    
    while (board.length < cardsNeeded) {
      const card = generateRandomCard();
      if (!usedCards.has(card)) {
        usedCards.add(card);
        board.push(card);
      }
    }
    
    return board;
  }, [players, generateRandomCard]);

  // Calculate odds using your Python backend
  const calculateOdds = useCallback(async (hands: string[][], board: string[]) => {
    try {
      const response = await fetch('http://localhost:8000/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hands: hands,
          board: board,
          num_sims: 1000
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error calling Python backend:', error);
      // Fallback to simple mock data if backend is not available
      const winPercentages = hands.map(() => Math.random() * 100);
      const tiePercentages = hands.map(() => Math.random() * 20);
      
      const total = winPercentages.reduce((sum, val) => sum + val, 0);
      const normalizedWins = winPercentages.map(val => (val / total) * 100);
      const normalizedTies = tiePercentages.map(val => (val / total) * 100);
      
      return {
        wins: normalizedWins.map(val => Math.floor(val * 10)),
        ties: normalizedTies.map(val => Math.floor(val * 10)),
        win_percentages: normalizedWins,
        tie_percentages: normalizedTies,
        hand_rankings: hands.map(() => 'High Card')
      };
    }
  }, []);

  // Initialize game
  const initializeGame = useCallback(() => {
    const numPlayers = 4;
    const newPlayers: Player[] = [];
    
    for (let i = 0; i < numPlayers; i++) {
      newPlayers.push({
        name: `Player ${i + 1}`,
        cards: [],
        isActive: i === 0,
        position: i + 1
      });
    }
    
    setPlayers(newPlayers);
    setBoard([]);
    setGamePhase('preflop');
    setOdds(null);
    setSimulationCount(0);
    setIsInitialized(false);
  }, []);

  // Step-by-step simulation
  const nextStep = useCallback(async () => {
    if (!isInitialized) {
      // Deal initial hands
      const newPlayers = players.map(player => ({
        ...player,
        cards: generateRandomHand()
      }));
      setPlayers(newPlayers);
      setIsInitialized(true);
      
      // Calculate preflop odds
      const hands = newPlayers.map(p => p.cards);
      const newOdds = await calculateOdds(hands, []);
      setOdds(newOdds);
      setSimulationCount(prev => prev + 1);
    } else if (gamePhase === 'preflop') {
      // Deal flop
      const newBoard = generateRandomBoard('flop');
      setBoard(newBoard);
      setGamePhase('flop');
      
      // Calculate flop odds
      const hands = players.map(p => p.cards);
      const newOdds = await calculateOdds(hands, newBoard);
      setOdds(newOdds);
      setSimulationCount(prev => prev + 1);
    } else if (gamePhase === 'flop') {
      // Deal turn
      const newBoard = [...board, ...generateRandomBoard('turn').slice(-1)];
      setBoard(newBoard);
      setGamePhase('turn');
      
      // Calculate turn odds
      const hands = players.map(p => p.cards);
      const newOdds = await calculateOdds(hands, newBoard);
      setOdds(newOdds);
      setSimulationCount(prev => prev + 1);
    } else if (gamePhase === 'turn') {
      // Deal river
      const newBoard = [...board, ...generateRandomBoard('river').slice(-1)];
      setBoard(newBoard);
      setGamePhase('river');
      
      // Calculate river odds
      const hands = players.map(p => p.cards);
      const newOdds = await calculateOdds(hands, newBoard);
      setOdds(newOdds);
      setSimulationCount(prev => prev + 1);
    } else {
      // Reset for new hand
      initializeGame();
    }
  }, [isInitialized, gamePhase, board, players, generateRandomHand, generateRandomBoard, calculateOdds, initializeGame]);

  // Initialize on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const resetSimulation = () => {
    initializeGame();
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="bg-dark text-white py-3 shadow">
        <div className="container">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="h3 mb-0">
                <i className="bi bi-play-circle-fill me-2"></i>
                Auto Simulation Mode
              </h1>
              <p className="mb-0 text-muted">Watch live poker simulations with animated odds</p>
            </div>
            <div className="col-auto">
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={nextStep}
                >
                  <i className="bi bi-arrow-right me-1"></i>
                  Next Step
                </button>
                <button 
                  className="btn btn-outline-light btn-sm"
                  onClick={resetSimulation}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  New Hand
                </button>
                <button 
                  className="btn btn-outline-light btn-sm"
                  onClick={onBack}
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-4">
        {/* Step Information */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center justify-content-center">
                  <div className="col-md-2 col-6 mb-2 mb-md-0">
                    <div className="text-center">
                      <div className="h4 text-primary mb-0">{simulationCount}</div>
                      <small className="text-muted">Steps Completed</small>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-2 mb-md-0">
                    <div className="text-center">
                      <div className="h4 text-success mb-0">
                        {!isInitialized ? 'Deal Hands' : 
                         gamePhase === 'preflop' ? 'Deal Flop' :
                         gamePhase === 'flop' ? 'Deal Turn' :
                         gamePhase === 'turn' ? 'Deal River' : 'New Hand'}
                      </div>
                      <small className="text-muted">Next Action</small>
                    </div>
                  </div>
                  <div className="col-md-2 col-6 mb-2 mb-md-0">
                    <div className="text-center">
                      <div className="h4 text-info mb-0">{gamePhase}</div>
                      <small className="text-muted">Current Phase</small>
                    </div>
                  </div>
                  <div className="col-md-2 col-6 mb-2 mb-md-0">
                    <div className="text-center">
                      <div className="h4 text-warning mb-0">{players.length}</div>
                      <small className="text-muted">Players</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          <div className="col-12">
            <PokerTable 
              players={players}
              board={board}
              odds={odds}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoSimulation;
