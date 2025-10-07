import React from 'react';
import Player from './Player';

interface Player {
  name: string;
  cards: string[];
  isActive: boolean;
  position: number;
}

interface PokerTableProps {
  players: Player[];
  board: string[];
  odds?: {
    wins: number[];
    ties: number[];
    win_percentages: number[];
    tie_percentages: number[];
  } | null;
}

const PokerTable: React.FC<PokerTableProps> = ({ players, board, odds }) => {
  const formatCard = (card: string) => {
    if (card.length !== 2) return card;
    const face = card[0].toUpperCase();
    const suit = card[1].toLowerCase();
    const suitSymbols = { 's': '♠', 'h': '♥', 'd': '♦', 'c': '♣' };
    const suitSymbol = suitSymbols[suit as keyof typeof suitSymbols];
    return `${face}${suitSymbol}`;
  };

  return (
    <div className="card">
      <div className="card-body p-4">
        <div className="position-relative bg-success rounded mx-auto" style={{ height: '500px', width: '700px' }}>
          {/* Poker Table */}
          <div 
            className="position-absolute rounded-circle border border-dark"
            style={{ 
              backgroundColor: '#0d5016',
              border: '8px solid #8B4513',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '450px',
              height: '450px'
            }}
          >
            {/* Center area for community cards */}
            <div 
              className="position-absolute d-flex gap-2 align-items-center justify-content-center"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '10px'
              }}
            >
              {board.map((card, index) => (
                <div 
                  key={index}
                  className="bg-white text-dark rounded d-flex align-items-center justify-content-center"
                  style={{ 
                    width: '45px', 
                    height: '65px', 
                    fontSize: '12px',
                    border: '2px solid #333',
                    fontWeight: 'bold'
                  }}
                >
                  {formatCard(card)}
                </div>
              ))}
            </div>

            {/* Players positioned around the table */}
            {players.map((player, index) => {
              // Simple, safe positioning that keeps players on screen
              const positions = [
                { top: '10px', left: '10px' }, // Top-left
                { top: '10px', right: '10px' }, // Top-right
                { bottom: '10px', right: '10px' }, // Bottom-right
                { bottom: '10px', left: '10px' }, // Bottom-left
                { top: '50%', left: '5px', transform: 'translateY(-50%)' }, // Left-middle
                { top: '50%', right: '5px', transform: 'translateY(-50%)' }, // Right-middle
              ];
              
              // Only show up to 6 players to prevent off-screen issues
              if (index >= 6) return null;
              
              const position = positions[index];
              
              return (
                <div 
                  key={index}
                  className="position-absolute"
                  style={position}
                >
                  <Player 
                    name={player.name}
                    cards={player.cards}
                    isActive={player.isActive}
                    position={player.position}
                    winPercentage={odds?.win_percentages[index]}
                    tiePercentage={odds?.tie_percentages[index]}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokerTable;
