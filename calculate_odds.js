// SIMPLEST way - just calls your pokersim.py directly
const { spawn } = require('child_process');
const path = require('path');

// This function calls your pokersim.py directly
function calculatePokerOdds(hands, board, numSims = 1000) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, 'backend', 'pokersim.py');
    const inputData = JSON.stringify({
      hands: hands,
      board: board,
      num_sims: numSims
    });

    const python = spawn('python3', [pythonScript, inputData]);
    
    let output = '';
    let error = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (parseError) {
          reject(new Error('Failed to parse Python output'));
        }
      } else {
        reject(new Error(`Python script failed: ${error}`));
      }
    });

    python.on('error', (err) => {
      reject(err);
    });
  });
}

// Export for use
module.exports = { calculatePokerOdds };

