const { Keypair } = require('@solana/web3.js');
require('dotenv').config();

const secretKey = JSON.parse(process.env.PRIVATE_KEY);
const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));

console.log('Your Public Key:', keypair.publicKey.toString());
