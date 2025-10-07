import React from 'react';

interface GameControlsProps {
  onDealFlop: () => void;
  onDealTurn: () => void;
  onDealRiver: () => void;
  onReset: () => void;
  onAddPlayer: () => void;
  onRemovePlayer: () => void;
  gamePhase: 'preflop' | 'flop' | 'turn' | 'river';
  playerCount: number;
  disabled?: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onDealFlop,
  onDealTurn,
  onDealRiver,
  onReset,
  onAddPlayer,
  onRemovePlayer,
  gamePhase,
  playerCount,
  disabled = false
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="bi bi-controller me-2"></i>
          Game Controls
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-2">
          <div className="col-12">
            <div className="d-flex gap-2 flex-wrap">
              <button 
                className="btn btn-success"
                onClick={onDealFlop}
                disabled={disabled || gamePhase !== 'preflop'}
              >
                <i className="bi bi-play-circle me-1"></i>
                Deal Flop
              </button>
              
              <button 
                className="btn btn-info"
                onClick={onDealTurn}
                disabled={disabled || gamePhase !== 'flop'}
              >
                <i className="bi bi-skip-forward me-1"></i>
                Deal Turn
              </button>
              
              <button 
                className="btn btn-primary"
                onClick={onDealRiver}
                disabled={disabled || gamePhase !== 'turn'}
              >
                <i className="bi bi-skip-end me-1"></i>
                Deal River
              </button>
            </div>
          </div>
          
          <div className="col-12">
            <hr className="my-2" />
            <div className="d-flex gap-2 flex-wrap">
              <button 
                className="btn btn-outline-secondary"
                onClick={onAddPlayer}
                disabled={disabled || playerCount >= 8}
              >
                <i className="bi bi-person-plus me-1"></i>
                Add Player
              </button>
              
              <button 
                className="btn btn-outline-secondary"
                onClick={onRemovePlayer}
                disabled={disabled || playerCount <= 2}
              >
                <i className="bi bi-person-dash me-1"></i>
                Remove Player
              </button>
              
              <button 
                className="btn btn-outline-danger"
                onClick={onReset}
                disabled={disabled}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                New Game
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              <strong>Phase:</strong> {gamePhase.charAt(0).toUpperCase() + gamePhase.slice(1)}
            </small>
            <small className="text-muted">
              <strong>Players:</strong> {playerCount}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
