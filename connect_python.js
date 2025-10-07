// SIMPLEST way to connect React frontend to your pokersim.py
const { spawn } = require('child_process');
const path = require('path');

// This function calls your pokersim.py directly
async function calculatePokerOdds(hands, board, numSims = 1000) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, 'backend', 'pokersim.py');
    const inputData = JSON.stringify({
      hands: hands,
      board: board,
      num_sims: numSims
    });

    console.log('🐍 Calling your pokersim.py with:', inputData);

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
          console.log('✅ Python result:', result);
          resolve(result);
        } catch (parseError) {
          console.error('❌ Error parsing Python output:', parseError);
          reject(new Error('Failed to parse Python script output'));
        }
      } else {
        console.error('❌ Python script error:', error);
        reject(new Error(`Python script failed with code ${code}: ${error}`));
      }
    });

    python.on('error', (err) => {
      console.error('❌ Failed to start Python script:', err);
      reject(err);
    });
  });
}

// Test it
async function test() {
  try {
    const result = await calculatePokerOdds(
      [['As', 'Kh'], ['Qd', 'Jc']], 
      ['2h', '3d', '7c'], 
      1000
    );
    console.log('🎉 SUCCESS! Your Python script works:', result);
  } catch (error) {
    console.error('💥 ERROR:', error.message);
  }
}

// Run test
test();

module.exports = { calculatePokerOdds };

