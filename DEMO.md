# Demo Instructions

## Video Demo
()

## Quick Start Demo

### Prerequisites
- Node.js v18+
- Solana devnet SOL
- Phantom wallet

### Setup
1. Clone repo:
```bash
git clone https://github.com/meekMusa2/solana-batch-executor.git
cd solana-batch-executor
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
# Edit .env with your private key
nano .env
```

4. Start backend (Terminal 1):
```bash
node server.js
```

5. Start frontend (Terminal 2):
```bash
npm start
```

6. Open browser to `http://localhost:3001`

### Test It
1. Enter your Solana address in "Recipient Address"
2. Enter amount (e.g., `1000` lamports)
3. Click "+ Add Transaction"
4. Repeat 2-3 times to create batch
5. Click "🚀 Execute Batch via Gateway"
6. Watch backend terminal for Gateway routing logs
7. See results appear in browser instantly

### Expected Output
- Browser: Transaction signatures with timestamps
- Backend: "Sending via Gateway (dual routing: RPC + Jito)..."
- Success: 100% confirmation rate
