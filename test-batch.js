const { Keypair } = require('@solana/web3.js');
const { executeBatch } = require('./batch-executor');
require('dotenv').config();

async function main() {
  // Get your own public key as the recipient
  const secretKey = JSON.parse(process.env.PRIVATE_KEY);
  const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
  const yourAddress = keypair.publicKey.toString();

  console.log('Sending SOL to:', yourAddress);

  // Batch of 2 transactions (sending SOL back to yourself)
  const batchTransactions = [
    {
      toAddress: yourAddress,
      amountLamports: 1000, // 0.001 SOL
    },
    {
      toAddress: yourAddress,
      amountLamports: 2000, // 0.002 SOL
    },
  ];

  try {
    const results = await executeBatch(batchTransactions);
    console.log('\n📊 Batch Results:');
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Batch execution failed:', error);
  }
}

main();
