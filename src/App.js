import React, { useState } from 'react';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  const addTransaction = () => {
    if (!toAddress || !amount) {
      alert('Please fill in all fields');
      return;
    }

    const newTx = {
      toAddress,
      amountLamports: parseInt(amount),
      id: Date.now(),
    };

    setTransactions([...transactions, newTx]);
    setToAddress('');
    setAmount('');
  };

  const removeTransaction = (id) => {
    setTransactions(transactions.filter(tx => tx.id !== id));
  };

  const executeBatch = async () => {
    if (transactions.length === 0) {
      alert('Add at least one transaction');
      return;
    }

    setLoading(true);
    setResults([]);
    setSuccessCount(0);

    try {
      // Call backend API to execute batch through Gateway
      const response = await fetch('http://localhost:5000/api/execute-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions }),
      });

      if (!response.ok) {
        throw new Error('Backend error: ' + response.statusText);
      }

      const data = await response.json();
      setResults(data.results);
      setSuccessCount(data.summary.successful);

      // Clear transactions after successful execution
      setTransactions([]);
      alert(`✅ Batch executed! ${data.summary.successful}/${data.summary.total} transactions successful`);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>⚡ Solana Batch Executor</h1>
          <p>Powered by Sanctum Gateway</p>
        </header>

        <section className="input-section">
          <h2>Add Transactions</h2>
          <div className="form">
            <input
              type="text"
              placeholder="Recipient Address"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Amount (Lamports)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
            />
            <button onClick={addTransaction} disabled={loading}>
              + Add Transaction
            </button>
          </div>
        </section>

        {transactions.length > 0 && (
          <section className="queue-section">
            <h2>Transaction Queue ({transactions.length})</h2>
            <div className="transaction-list">
              {transactions.map((tx) => (
                <div key={tx.id} className="transaction-item">
                  <div>
                    <small>To: {tx.toAddress.substring(0, 20)}...</small>
                    <div>{tx.amountLamports} lamports</div>
                  </div>
                  <button
                    onClick={() => removeTransaction(tx.id)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              className="execute-btn"
              onClick={executeBatch}
              disabled={loading || transactions.length === 0}
            >
              {loading ? '⏳ Executing...' : '🚀 Execute Batch via Gateway'}
            </button>
          </section>
        )}

        {results.length > 0 && (
          <section className="results-section">
            <h2>Results ✅</h2>
            <div className="results-summary">
              <strong>{successCount}/{results.length} Successful</strong>
            </div>
            <div className="results-list">
              {results.map((result) => (
                <div key={result.index} className="result-item">
                  <span className="status">✅</span>
                  <div className="result-details">
                    <small>Signature: {result.signature.substring(0, 30)}...</small>
                    <tiny>{result.timestamp}</tiny>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
