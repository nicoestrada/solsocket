const { Connection, Keypair, VersionedTransaction } = require('@solana/web3.js');
const { Wallet } = require('@project-serum/anchor');
const fetch = require('cross-fetch');
const bs58 = require('bs58');
require('dotenv').config();

const connection = new Connection('https://long-dawn-sunset.solana-mainnet.quiknode.pro/3ecae5f94abc22ba36a0e77c674729a1df82e817/');

//PRIVATE KEY
const wallet = new Wallet(Keypair.fromSeed(Uint8Array.from(process.env.PRIVATE_KEY.slice(0,32))));

async function fetchQuote() {
    const tokenAddress="74pgRggd12L8CAMm9nXD4zFcE48UpG7CNLnDinFgJdFS"

    // tokenAddress = tokenAddress.toBase58();
    //PARAMS for quote
    // const inputMint = "So11111111111111111111111111111111111111112";
    const inputMint = "So11111111111111111111111111111111111111112";
    const outputMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    const amount = 100000000;
    const slippageBps = 10000;

    try {
        console.log("before fetch")
        const quoteResponse = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${tokenAddress}&amount=${amount}&slippageBps=${slippageBps}`);
        console.log("after fetch")

        if (!quoteResponse.ok) {
            throw new Error('Failed to fetch quote', quoteResponse);
        }
        console.log("fetch was good")

        const quoteData = await quoteResponse.json();
        console.log(quoteData, "waiting now...")

    } catch (error) {
        console.error('Error fetching quote:', error);
    }
}

// module.exports = { fetchQuote };
// fetchQuote();