import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-dark text-white py-3 shadow">
      <div className="container">
        <div className="row align-items-center">
          <div className="col">
            <h1 className="h3 mb-0">
              <i className="bi bi-suit-spade-fill me-2"></i>
              Poker Simulator
            </h1>
            <p className="mb-0 text-muted">Monte Carlo poker odds calculator</p>
          </div>
          <div className="col-auto">
            <div className="d-flex gap-2">
              <button className="btn btn-outline-light btn-sm">
                <i className="bi bi-info-circle me-1"></i>
                Help
              </button>
              <button className="btn btn-outline-light btn-sm">
                <i className="bi bi-gear me-1"></i>
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
