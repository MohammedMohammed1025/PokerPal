import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient" 
         style={{ background: 'linear-gradient(135deg, #0d5016 0%, #1a7a2e 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="text-center text-white mb-5">
              <div className="display-1 mb-3">
                <i className="bi bi-suit-spade-fill"></i>
                <i className="bi bi-suit-heart-fill text-danger mx-2"></i>
                <i className="bi bi-suit-diamond-fill text-danger"></i>
                <i className="bi bi-suit-club-fill"></i>
              </div>
              <h1 className="display-4 fw-bold mb-3">ALL IN SIM</h1>
              <p className="lead mb-5">Monte Carlo poker odds calculator with live simulations</p>
            </div>
            
            <div className="row g-4">
              <div className="col-md-6">
                <div 
                  className="card h-100 shadow-lg border-0 cursor-pointer"
                  style={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                  }}
                  onClick={() => navigate('/auto')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="card-body text-center p-5">
                    <div className="display-1 text-primary mb-4">
                      <i className="bi bi-play-circle-fill"></i>
                    </div>
                    <h3 className="card-title fw-bold mb-3">Auto Simulation</h3>
                    <p className="card-text text-muted mb-4">
                      Watch automated poker simulations with live odds updates, 
                      card dealing animations, and real-time probability calculations.
                    </p>
                    <div className="d-flex justify-content-center gap-2 mb-3">
                      <span className="badge bg-primary">Live Odds</span>
                      <span className="badge bg-success">Animations</span>
                      <span className="badge bg-info">Auto Deal</span>
                    </div>
                    <button className="btn btn-primary btn-lg px-4">
                      <i className="bi bi-play-fill me-2"></i>
                      Start Auto Simulation
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div 
                  className="card h-100 shadow-lg border-0 cursor-pointer"
                  style={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                  }}
                  onClick={() => navigate('/manual')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="card-body text-center p-5">
                    <div className="display-1 text-success mb-4">
                      <i className="bi bi-pencil-square"></i>
                    </div>
                    <h3 className="card-title fw-bold mb-3">Manual Input</h3>
                    <p className="card-text text-muted mb-4">
                      Enter your own hands and community cards to calculate 
                      precise win probabilities and analyze specific scenarios.
                    </p>
                    <div className="d-flex justify-content-center gap-2 mb-3">
                      <span className="badge bg-success">Custom Hands</span>
                      <span className="badge bg-warning">Precise Odds</span>
                      <span className="badge bg-info">Scenario Analysis</span>
                    </div>
                    <button className="btn btn-success btn-lg px-4">
                      <i className="bi bi-pencil me-2"></i>
                      Enter Manual Mode
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-5">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="d-flex align-items-center justify-content-center text-white">
                    <i className="bi bi-calculator me-2"></i>
                    <span>Monte Carlo Simulation</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center justify-content-center text-white">
                    <i className="bi bi-graph-up me-2"></i>
                    <span>Live Odds Updates</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center justify-content-center text-white">
                    <i className="bi bi-lightning me-2"></i>
                    <span>Real-time Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
