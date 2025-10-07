import React from 'react';

interface OddsData {
  wins: number[];
  ties: number[];
  win_percentages: number[];
  tie_percentages: number[];
}

interface OddsDisplayProps {
  odds: OddsData | null;
  players: Array<{
    name: string;
    cards: string[];
    isActive: boolean;
  }>;
  board: string[];
  loading?: boolean;
}

const OddsDisplay: React.FC<OddsDisplayProps> = ({ odds, players, board, loading = false }) => {
  const formatCard = (card: string) => {
    if (card.length !== 2) return card;
    const face = card[0].toUpperCase();
    const suit = card[1].toLowerCase();
    const suitSymbols = { 's': '♠', 'h': '♥', 'd': '♦', 'c': '♣' };
    const suitSymbol = suitSymbols[suit as keyof typeof suitSymbols];
    return `${face}${suitSymbol}`;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Calculating odds...</span>
          </div>
          <p className="mt-2 mb-0">Calculating odds...</p>
        </div>
      </div>
    );
  }

  if (!odds) {
    return (
      <div className="card">
        <div className="card-body text-center text-muted">
          <i className="bi bi-calculator display-4"></i>
          <p className="mt-2 mb-0">Enter hands to see odds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="bi bi-graph-up me-2"></i>
          Win Odds
        </h5>
      </div>
      <div className="card-body">
        {board.length > 0 && (
          <div className="mb-3">
            <h6>Community Cards:</h6>
            <div className="d-flex gap-2">
              {board.map((card, index) => (
                <div 
                  key={index}
                  className="bg-white text-dark rounded d-flex align-items-center justify-content-center border"
                  style={{ 
                    width: '40px', 
                    height: '60px', 
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {formatCard(card)}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="row g-3">
          {players.map((player, index) => (
            <div key={index} className="col-md-6">
              <div className={`card ${player.isActive ? 'border-warning' : ''}`}>
                <div className={`card-body ${player.isActive ? 'bg-warning bg-opacity-10' : ''}`}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="card-title mb-0">{player.name}</h6>
                    {player.isActive && (
                      <span className="badge bg-warning text-dark">Active</span>
                    )}
                  </div>
                  
                  <div className="mb-2">
                    <small className="text-muted">Hand:</small>
                    <div className="d-flex gap-1">
                      {player.cards.map((card, cardIndex) => (
                        <div 
                          key={cardIndex}
                          className="bg-white text-dark rounded d-flex align-items-center justify-content-center border"
                          style={{ 
                            width: '30px', 
                            height: '45px', 
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          {formatCard(card)}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="text-success">
                        <strong>{odds.win_percentages[index]?.toFixed(1) || 0}%</strong>
                        <br />
                        <small className="text-muted">Win</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-info">
                        <strong>{odds.tie_percentages[index]?.toFixed(1) || 0}%</strong>
                        <br />
                        <small className="text-muted">Tie</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{ width: `${odds.win_percentages[index] || 0}%` }}
                      ></div>
                      <div 
                        className="progress-bar bg-info" 
                        style={{ width: `${odds.tie_percentages[index] || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 text-center">
          <small className="text-muted">
            Based on Monte Carlo simulation (1000 iterations)
          </small>
        </div>
      </div>
    </div>
  );
};

export default OddsDisplay;
