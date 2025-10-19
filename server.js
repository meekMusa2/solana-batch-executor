const express = require('express');
const cors = require('cors');
const { executeBatch } = require('./batch-executor');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// API endpoint to execute batch transactions
app.post('/api/execute-batch', async (req, res) => {
  try {
    const { transactions } = req.body;

    if (!transactions || transactions.length === 0) {
      return res.status(400).json({ error: 'No transactions provided' });
    }

    console.log(`\n📦 Received batch with ${transactions.length} transactions`);
    const results = await executeBatch(transactions);

    res.json({
      success: true,
      results,
      summary: {
        total: results.length,
        successful: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'failed').length,
      },
    });
  } catch (error) {
    console.error('Error executing batch:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Gateway Batch Executor API running' });
});

app.listen(PORT, () => {
  console.log(`\n✅ Backend server running on http://localhost:${PORT}`);
  console.log('📡 Ready to execute transactions via Gateway\n');
});
