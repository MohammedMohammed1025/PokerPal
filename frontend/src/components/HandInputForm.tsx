import React, { useState } from 'react';

interface HandInputFormProps {
  onHandSubmit: (hand: string[]) => void;
  disabled?: boolean;
}

const HandInputForm: React.FC<HandInputFormProps> = ({ onHandSubmit, disabled = false }) => {
  const [card1, setCard1] = useState('');
  const [card2, setCard2] = useState('');

  const faces = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  const suits = ['s', 'h', 'd', 'c'];
  const suitSymbols = { 's': '♠', 'h': '♥', 'd': '♦', 'c': '♣' };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (card1 && card2) {
      onHandSubmit([card1, card2]);
    }
  };

  const validateCard = (card: string) => {
    if (card.length !== 2) return false;
    const face = card[0].toUpperCase();
    const suit = card[1].toLowerCase();
    return faces.includes(face) && suits.includes(suit);
  };

  const formatCard = (card: string) => {
    if (card.length !== 2) return card;
    const face = card[0].toUpperCase();
    const suit = card[1].toLowerCase();
    const suitSymbol = suitSymbols[suit as keyof typeof suitSymbols];
    return `${face}${suitSymbol}`;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="bi bi-pencil-square me-2"></i>
          Enter Your Hand
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="card1" className="form-label">Card 1</label>
              <div className="input-group">
                <input
                  type="text"
                  className={`form-control ${card1 && !validateCard(card1) ? 'is-invalid' : ''}`}
                  id="card1"
                  value={card1}
                  onChange={(e) => setCard1(e.target.value.toUpperCase())}
                  placeholder="e.g., As"
                  maxLength={2}
                  disabled={disabled}
                />
                {card1 && validateCard(card1) && (
                  <span className="input-group-text bg-success text-white">
                    {formatCard(card1)}
                  </span>
                )}
              </div>
              <div className="form-text">Format: Face + Suit (e.g., As, Kh, 7d, Tc)</div>
            </div>
            <div className="col-md-6">
              <label htmlFor="card2" className="form-label">Card 2</label>
              <div className="input-group">
                <input
                  type="text"
                  className={`form-control ${card2 && !validateCard(card2) ? 'is-invalid' : ''}`}
                  id="card2"
                  value={card2}
                  onChange={(e) => setCard2(e.target.value.toUpperCase())}
                  placeholder="e.g., Kh"
                  maxLength={2}
                  disabled={disabled}
                />
                {card2 && validateCard(card2) && (
                  <span className="input-group-text bg-success text-white">
                    {formatCard(card2)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={disabled || !card1 || !card2 || !validateCard(card1) || !validateCard(card2)}
            >
              <i className="bi bi-calculator me-2"></i>
              Calculate Odds
            </button>
            <button 
              type="button" 
              className="btn btn-outline-secondary ms-2"
              onClick={() => {
                setCard1('');
                setCard2('');
              }}
              disabled={disabled}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Clear
            </button>
          </div>
        </form>
        
        <div className="mt-3">
          <small className="text-muted">
            <strong>Card Format:</strong> Face (2-9, T, J, Q, K, A) + Suit (s=♠, h=♥, d=♦, c=♣)
          </small>
        </div>
      </div>
    </div>
  );
};

export default HandInputForm;
