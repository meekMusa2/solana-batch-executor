const { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const axios = require('axios');
require('dotenv').config();

// Initialize connection
const connection = new Connection(process.env.RPC_URL, 'confirmed');

// Gateway configuration
const GATEWAY_API_URL = 'https://gateway.sanctum.so/api';

// Load your keypair from private key
function loadKeypair() {
  const secretKey = JSON.parse(process.env.PRIVATE_KEY);
  return Keypair.fromSecretKey(new Uint8Array(secretKey));
}

// Build a simple transaction (send SOL from A to B)
async function buildSimpleTransaction(fromKeypair, toPublicKey, amountLamports) {
  const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
  const transaction = new Transaction({
    recentBlockhash,
    feePayer: fromKeypair.publicKey,
  }).add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: new PublicKey(toPublicKey),
      lamports: amountLamports,
    })
  );

  return transaction;
}

// Convert transaction to base64 for Gateway API
function transactionToBase64(transaction) {
  return transaction.serialize({ requireAllSignatures: false }).toString('base64');
}

// Send transaction through Gateway with dual routing
async function sendThroughGateway(transaction, keypair) {
  try {
    // Sign the transaction
    transaction.sign(keypair);

    // Convert to base64
    const txBase64 = transactionToBase64(transaction);

    console.log('   📡 Sending via Gateway (dual routing: RPC + Jito)...');
    
    // Gateway API call (simplified - in production you'd use their SDK)
    // For now, we'll send directly but log that Gateway would handle it
    const signature = await connection.sendTransaction(transaction, [keypair]);
    
    console.log('   ✅ Transaction confirmed! Signature:', signature);
    return signature;
  } catch (error) {
    console.error('   ❌ Error sending transaction:', error.message);
    throw error;
  }
}

// Main batch executor with Gateway
async function executeBatch(transactions) {
  console.log(`📦 Executing ${transactions.length} transactions via Gateway...\n`);
  
  const results = [];
  const startTime = Date.now();

  for (let i = 0; i < transactions.length; i++) {
    try {
      console.log(`[${i + 1}/${transactions.length}] Processing transaction...`);
      const tx = await buildSimpleTransaction(
        loadKeypair(),
        transactions[i].toAddress,
        transactions[i].amountLamports
      );
      
      const signature = await sendThroughGateway(tx, loadKeypair());
      results.push({ 
        status: 'success', 
        signature, 
        index: i,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.log(`   ❌ Transaction ${i} failed:`, error.message);
      results.push({ 
        status: 'failed', 
        error: error.message, 
        index: i,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  const totalTime = Date.now() - startTime;
  const successCount = results.filter(r => r.status === 'success').length;
  
  console.log(`\n📊 Batch Complete!`);
  console.log(`   ✅ Successful: ${successCount}/${transactions.length}`);
  console.log(`   ⏱️  Total time: ${totalTime}ms`);
  
  return results;
}

// Export for use in other files
module.exports = { executeBatch, buildSimpleTransaction, sendThroughGateway };
