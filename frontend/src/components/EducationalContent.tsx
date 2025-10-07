import React, { useState } from 'react';
import './EducationalContent.css';

interface EducationalContentProps {
  onBack?: () => void;
}

type ContentSection = 'hand-rankings' | 'strategy' | 'glossary' | 'quiz';

const EducationalContent: React.FC<EducationalContentProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<ContentSection>('hand-rankings');

  const handRankings = [
    {
      rank: 1,
      name: 'Royal Flush',
      description: 'A, K, Q, J, 10, all the same suit',
      example: 'A♠ K♠ Q♠ J♠ T♠',
      probability: '1 in 649,740'
    },
    {
      rank: 2,
      name: 'Straight Flush',
      description: 'Five cards in a sequence, all in the same suit',
      example: '9♣ 8♣ 7♣ 6♣ 5♣',
      probability: '1 in 72,193'
    },
    {
      rank: 3,
      name: 'Four of a Kind',
      description: 'All four cards of the same rank',
      example: 'J♠ J♥ J♦ J♣ 3♠',
      probability: '1 in 4,165'
    },
    {
      rank: 4,
      name: 'Full House',
      description: 'Three of a kind with a pair',
      example: '8♠ 8♥ 8♦ 4♣ 4♠',
      probability: '1 in 694'
    },
    {
      rank: 5,
      name: 'Flush',
      description: 'Any five cards of the same suit, but not in a sequence',
      example: 'K♠ 10♠ 7♠ 4♠ 2♠',
      probability: '1 in 509'
    },
    {
      rank: 6,
      name: 'Straight',
      description: 'Five cards in a sequence, but not all the same suit',
      example: '9♥ 8♣ 7♦ 6♠ 5♠',
      probability: '1 in 255'
    },
    {
      rank: 7,
      name: 'Three of a Kind',
      description: 'Three cards of the same rank',
      example: '7♠ 7♥ 7♦ K♣ 2♠',
      probability: '1 in 47'
    },
    {
      rank: 8,
      name: 'Two Pair',
      description: 'Two different pairs',
      example: 'A♠ A♥ 9♣ 9♦ 3♠',
      probability: '1 in 21'
    },
    {
      rank: 9,
      name: 'Pair',
      description: 'Two cards of the same rank',
      example: '10♠ 10♥ 8♦ 4♣ 2♠',
      probability: '1 in 2.4'
    },
    {
      rank: 10,
      name: 'High Card',
      description: 'When you haven\'t made any of the hands above',
      example: 'K♠ J♣ 8♦ 4♥ 2♠',
      probability: '1 in 1.4'
    }
  ];

  const strategyTips = [
    {
      position: 'Early Position',
      tips: [
        'Play tight - only premium hands',
        'Raise with strong hands to build the pot',
        'Avoid marginal hands that can get you in trouble',
        'Examples: AA, KK, QQ, JJ, AK, AQ'
      ]
    },
    {
      position: 'Middle Position',
      tips: [
        'Slightly looser than early position',
        'Can play some suited connectors',
        'Be aware of players behind you',
        'Examples: TT, 99, AJ, AT, KQ'
      ]
    },
    {
      position: 'Late Position',
      tips: [
        'Can play more hands',
        'Steal blinds with weaker hands',
        'Position is your advantage',
        'Examples: 88, 77, A9, K9, QJ'
      ]
    },
    {
      position: 'Blinds',
      tips: [
        'Defend with reasonable hands',
        'Consider pot odds when calling',
        'Be cautious with weak hands',
        'Examples: Any pair, suited aces, suited connectors'
      ]
    }
  ];

  const glossary = [
    { term: 'Action', definition: 'A player\'s turn to act (bet, call, raise, or fold)' },
    { term: 'All-in', definition: 'Betting all of your remaining chips' },
    { term: 'Ante', definition: 'A small forced bet that all players must make before each hand' },
    { term: 'Blind', definition: 'Forced bets made before cards are dealt (small blind and big blind)' },
    { term: 'Board', definition: 'The community cards dealt face up in the center of the table' },
    { term: 'Button', definition: 'The dealer position that rotates clockwise after each hand' },
    { term: 'Call', definition: 'To match the current bet' },
    { term: 'Check', definition: 'To pass the action without betting (only if no bet has been made)' },
    { term: 'Equity', definition: 'Your mathematical chance of winning the pot' },
    { term: 'Flop', definition: 'The first three community cards dealt' },
    { term: 'Fold', definition: 'To give up your hand and forfeit any chance of winning' },
    { term: 'Hole Cards', definition: 'The two private cards dealt to each player' },
    { term: 'Pot Odds', definition: 'The ratio of the current pot size to the cost of a call' },
    { term: 'Raise', definition: 'To increase the current bet' },
    { term: 'River', definition: 'The fifth and final community card' },
    { term: 'Turn', definition: 'The fourth community card' },
    { term: 'Variance', definition: 'The statistical fluctuation in poker results over time' }
  ];

  const quizQuestions = [
    {
      question: 'What is the highest possible hand in poker?',
      options: ['Four of a Kind', 'Royal Flush', 'Straight Flush', 'Full House'],
      correct: 1,
      explanation: 'A Royal Flush (A, K, Q, J, 10 all the same suit) is the highest possible hand in poker.'
    },
    {
      question: 'How many community cards are dealt in Texas Hold\'em?',
      options: ['3', '4', '5', '6'],
      correct: 2,
      explanation: 'Five community cards are dealt: 3 on the flop, 1 on the turn, and 1 on the river.'
    },
    {
      question: 'What position has the most advantage in poker?',
      options: ['Early Position', 'Middle Position', 'Late Position', 'Blinds'],
      correct: 2,
      explanation: 'Late position (button and cutoff) has the most advantage because you act last and have more information.'
    },
    {
      question: 'What does "pot odds" refer to?',
      options: ['The size of the pot', 'The ratio of pot size to call cost', 'The number of players', 'The betting round'],
      correct: 1,
      explanation: 'Pot odds is the ratio of the current pot size to the cost of a call, helping determine if a call is profitable.'
    },
    {
      question: 'Which hand is stronger: A♠ A♥ or K♠ K♥?',
      options: ['A♠ A♥', 'K♠ K♥', 'They are equal', 'Depends on the board'],
      correct: 0,
      explanation: 'A♠ A♥ (pocket aces) is stronger than K♠ K♥ (pocket kings). Aces are the highest ranking card.'
    }
  ];

  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleQuizAnswer = (answerIndex: number) => {
    if (showQuizAnswer) return;
    
    setSelectedAnswer(answerIndex);
    setShowQuizAnswer(true);
    
    if (answerIndex === quizQuestions[currentQuizQuestion].correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowQuizAnswer(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizQuestion(0);
    setSelectedAnswer(null);
    setShowQuizAnswer(false);
    setQuizScore(0);
  };

  return (
    <div className="educational-content">
      {/* Header */}
      <div className="content-header">
        <div className="header-top">
          {onBack && (
            <button className="back-button" onClick={onBack}>
              ← Back to Menu
            </button>
          )}
        </div>
        <h1>📚 PokerPal Education Center</h1>
        <p>Learn poker fundamentals, strategy, and terminology</p>
      </div>

      <div className="content-body">
        {/* Navigation */}
        <div className="content-nav">
          <button 
            className={`nav-btn ${activeSection === 'hand-rankings' ? 'active' : ''}`}
            onClick={() => setActiveSection('hand-rankings')}
          >
            🃏 Hand Rankings
          </button>
          <button 
            className={`nav-btn ${activeSection === 'strategy' ? 'active' : ''}`}
            onClick={() => setActiveSection('strategy')}
          >
            🎯 Strategy Tips
          </button>
          <button 
            className={`nav-btn ${activeSection === 'glossary' ? 'active' : ''}`}
            onClick={() => setActiveSection('glossary')}
          >
            📖 Glossary
          </button>
          <button 
            className={`nav-btn ${activeSection === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveSection('quiz')}
          >
            🧠 Quiz
          </button>
        </div>

        {/* Content Sections */}
        <div className="content-section">
          {/* Hand Rankings */}
          {activeSection === 'hand-rankings' && (
            <div className="hand-rankings-content">
              <h2>Poker Hand Rankings</h2>
              <p className="section-description">
                Learn the hierarchy of poker hands from highest to lowest. Understanding hand rankings is fundamental to playing poker.
              </p>
              
              <div className="rankings-list">
                {handRankings.map((hand) => (
                  <div key={hand.rank} className="ranking-item">
                    <div className="rank-number">#{hand.rank}</div>
                    <div className="hand-info">
                      <h3>{hand.name}</h3>
                      <p className="hand-description">{hand.description}</p>
                      <div className="hand-example">
                        <strong>Example:</strong> {hand.example}
                      </div>
                      <div className="hand-probability">
                        <strong>Probability:</strong> {hand.probability}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategy Tips */}
          {activeSection === 'strategy' && (
            <div className="strategy-content">
              <h2>Position-Based Strategy</h2>
              <p className="section-description">
                Your position at the table greatly affects which hands you should play. Here's a guide for different positions.
              </p>
              
              <div className="strategy-grid">
                {strategyTips.map((position) => (
                  <div key={position.position} className="strategy-card">
                    <h3>{position.position}</h3>
                    <ul>
                      {position.tips.map((tip, tipIndex) => (
                        <li key={tipIndex}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Glossary */}
          {activeSection === 'glossary' && (
            <div className="glossary-content">
              <h2>Poker Glossary</h2>
              <p className="section-description">
                Essential poker terms and definitions to help you understand the game better.
              </p>
              
              <div className="glossary-grid">
                {glossary.map((item, index) => (
                  <div key={index} className="glossary-item">
                    <h4>{item.term}</h4>
                    <p>{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quiz */}
          {activeSection === 'quiz' && (
            <div className="quiz-content">
              <h2>Poker Knowledge Quiz</h2>
              <p className="section-description">
                Test your poker knowledge with these multiple choice questions.
              </p>
              
              {currentQuizQuestion < quizQuestions.length ? (
                <div className="quiz-question">
                  <div className="quiz-progress">
                    Question {currentQuizQuestion + 1} of {quizQuestions.length}
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <h3>{quizQuestions[currentQuizQuestion].question}</h3>
                  
                  <div className="quiz-options">
                    {quizQuestions[currentQuizQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        className={`quiz-option ${
                          showQuizAnswer 
                            ? index === quizQuestions[currentQuizQuestion].correct 
                              ? 'correct' 
                              : selectedAnswer === index 
                                ? 'incorrect' 
                                : ''
                            : selectedAnswer === index 
                              ? 'selected' 
                              : ''
                        }`}
                        onClick={() => handleQuizAnswer(index)}
                        disabled={showQuizAnswer}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  {showQuizAnswer && (
                    <div className="quiz-explanation">
                      <h4>Explanation:</h4>
                      <p>{quizQuestions[currentQuizQuestion].explanation}</p>
                      <button className="next-question-btn" onClick={nextQuizQuestion}>
                        {currentQuizQuestion < quizQuestions.length - 1 ? 'Next Question' : 'View Results'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="quiz-results">
                  <h3>Quiz Complete!</h3>
                  <div className="score-display">
                    <div className="score-circle">
                      <span className="score-number">{quizScore}</span>
                      <span className="score-total">/{quizQuestions.length}</span>
                    </div>
                    <p className="score-percentage">
                      {Math.round((quizScore / quizQuestions.length) * 100)}% Correct
                    </p>
                  </div>
                  
                  <div className="score-message">
                    {quizScore === quizQuestions.length && (
                      <p className="perfect-score">🎉 Perfect! You're a poker expert!</p>
                    )}
                    {quizScore >= quizQuestions.length * 0.8 && quizScore < quizQuestions.length && (
                      <p className="good-score">👍 Great job! You know your poker!</p>
                    )}
                    {quizScore >= quizQuestions.length * 0.6 && quizScore < quizQuestions.length * 0.8 && (
                      <p className="ok-score">👌 Not bad! Keep studying!</p>
                    )}
                    {quizScore < quizQuestions.length * 0.6 && (
                      <p className="study-score">📚 Keep studying! You'll get there!</p>
                    )}
                  </div>
                  
                  <button className="retake-quiz-btn" onClick={resetQuiz}>
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationalContent;
