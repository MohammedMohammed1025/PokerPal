import React from 'react';

interface PlayerProps {
  name: string;
  cards: string[];
  isActive: boolean;
  position: number;
  winPercentage?: number;
  tiePercentage?: number;
}

const Player: React.FC<PlayerProps> = ({ name, cards, isActive, position, winPercentage, tiePercentage }) => {
  const formatCard = (card: string) => {
    if (card.length !== 2) return card;
    const face = card[0].toUpperCase();
    const suit = card[1].toLowerCase();
    const suitSymbols = { 's': '♠', 'h': '♥', 'd': '♦', 'c': '♣' };
    const suitSymbol = suitSymbols[suit as keyof typeof suitSymbols];
    return `${face}${suitSymbol}`;
  };

  return (
    <div 
      className={`position-absolute ${isActive ? 'border border-warning' : ''}`}
      style={{
        backgroundColor: isActive ? '#ffc107' : '#6c757d',
        borderRadius: '10px',
        padding: '12px',
        minWidth: '140px',
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
      }}
    >
      <div style={{ fontSize: '12px' }}>{name}</div>
      {cards.length > 0 && (
        <div className="d-flex gap-1 justify-content-center mt-1">
          {cards.map((card, index) => (
            <div key={index} 
                 className="bg-white text-dark rounded" 
                 style={{ 
                   width: '30px', 
                   height: '40px', 
                   fontSize: '10px', 
                   display: 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'center',
                   border: '1px solid #ccc'
                 }}>
              {formatCard(card)}
            </div>
          ))}
        </div>
      )}
      {(winPercentage !== undefined || tiePercentage !== undefined) && (
        <div className="mt-1" style={{ fontSize: '9px' }}>
          {winPercentage !== undefined && (
            <div className="text-success">Win: {winPercentage.toFixed(1)}%</div>
          )}
          {tiePercentage !== undefined && (
            <div className="text-info">Tie: {tiePercentage.toFixed(1)}%</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Player; 