import React, { useState } from 'react';

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

const ManualMode: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [players, setPlayers] = useState<Player[]>([
    { name: 'Player 1', cards: [], isActive: true, position: 1 },
    { name: 'Player 2', cards: [], isActive: false, position: 2 },
    { name: 'Player 3', cards: [], isActive: false, position: 3 },
  ]);
  
  const [board, setBoard] = useState<string[]>([]);
  const [gamePhase, setGamePhase] = useState<'preflop' | 'flop' | 'turn' | 'river'>('preflop');
  const [odds, setOdds] = useState<OddsData | null>(null);
  const [loading] = useState(false);

  const handleHandSubmit = async (hand: string[]) => {
    // Update the active player's hand
    const newPlayers = players.map((player, index) => 
      index === 0 ? { ...player, cards: hand } : player
    );
    setPlayers(newPlayers);
    
    // Calculate odds with Python script directly
    try {
      // Call the Python server that uses your pokersim.py backend
      const response = await fetch('http://localhost:8000/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hands: newPlayers.map(p => p.cards),
          board: board,
          num_sims: 1000
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Check if there's an error from the backend
      if (result.error) {
        console.error('Backend error:', result.error);
        throw new Error(result.error);
      }
      setOdds(result);
    } catch (error) {
      console.error('Error calculating odds:', error);
      // Show demo mode message
      alert('🎮 Demo Mode: Backend not available. For real calculations, run locally with: python3 test_server.py');
    }
  };

  const handleDealFlop = () => {
    setBoard(['2s', '7h', 'Ad']);
    setGamePhase('flop');
  };

  const handleDealTurn = () => {
    setBoard(prev => [...prev, 'Kc']);
    setGamePhase('turn');
  };

  const handleDealRiver = () => {
    setBoard(prev => [...prev, '9s']);
    setGamePhase('river');
  };

  const handleReset = () => {
    setPlayers([
      { name: 'Player 1', cards: [], isActive: true, position: 1 },
      { name: 'Player 2', cards: [], isActive: false, position: 2 },
      { name: 'Player 3', cards: [], isActive: false, position: 3 },
    ]);
    setBoard([]);
    setGamePhase('preflop');
    setOdds(null);
  };

  const handleAddPlayer = () => {
    if (players.length < 6) { // Reduced max players for better layout
      setPlayers(prev => [...prev, {
        name: `Player ${prev.length + 1}`,
        cards: [],
        isActive: false,
        position: prev.length + 1
      }]);
    }
  };

  const handleRemovePlayer = () => {
    if (players.length > 2) {
      setPlayers(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="bg-dark text-white py-3 shadow">
        <div className="container">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="h3 mb-0">
                <i className="bi bi-pencil-square me-2"></i>
                Manual Input Mode
              </h1>
              <p className="mb-0 text-muted">Enter your own hands and analyze specific scenarios</p>
            </div>
            <div className="col-auto">
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
      
      <div className="container-fluid py-4">
        {/* Controls Row */}
        <div className="row mb-4">
          <div className="col-lg-6">
            <HandInputForm 
              onHandSubmit={handleHandSubmit}
              disabled={loading}
            />
          </div>
          <div className="col-lg-6">
            <GameControls
              onDealFlop={handleDealFlop}
              onDealTurn={handleDealTurn}
              onDealRiver={handleDealRiver}
              onReset={handleReset}
              onAddPlayer={handleAddPlayer}
              onRemovePlayer={handleRemovePlayer}
              gamePhase={gamePhase}
              playerCount={players.length}
              disabled={loading}
            />
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

export default ManualMode;
