// SIMPLEST API - just calls your pokersim.py
const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// This calls your pokersim.py directly
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

// API endpoint that calls your Python script
app.post('/api/calculate', async (req, res) => {
  try {
    const { hands, board, num_sims } = req.body;
    console.log('📊 Calculating odds for:', { hands, board, num_sims });
    
    const result = await calculatePokerOdds(hands, board, num_sims || 1000);
    res.json(result);
  } catch (error) {
    console.error('💥 Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 SIMPLE POKER API running on http://localhost:${PORT}`);
  console.log('🐍 This calls your pokersim.py directly - no complex setup!');
  console.log('📱 Your React app can now call this API to get real odds!');
});
