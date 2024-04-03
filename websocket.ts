const WebSocket = require('ws');
const axios = require('axios');
const { PublicKey } = require('@solana/web3.js');

// Define the schema for the token account data
interface TokenAccount {
    owner: string;
    amount: number;
    decimals: number;
}

// Connect to a Solana node
const connectionUrl = 'ws://localhost:8900';
const ws = new WebSocket(connectionUrl);

// Specify the SPL token program ID
export const tokenProgramId = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

// Set up a loop to continuously fetch token accounts associated with the token program ID
async function monitorTokenAccounts() {
    ws.on('open', () => {
        console.log('WebSocket connection established');
    });

    ws.on('message', async (ws: WebSocket) => {
        try {
            const parsedData = JSON.parse(ws.toString());
            const account = parsedData.params.result.value;

            // Decode the account data from base64
            const accountData = Buffer.from(account.data[0], 'base64');

            // Deserialize the account data into a TokenAccount object
            const tokenAccount: TokenAccount = {
                owner: account.owner,
                amount: account.amount,
                decimals: account.decimals,
            };

            // Extract relevant metadata
            const mint = account.pubkey;
            const owner = tokenAccount.owner;
            const tokenAmount = tokenAccount.amount;
            const decimals = tokenAccount.decimals;

            // Create a token metadata object
            const metadata = {
                mint,
                owner,
                tokenAmount,
                decimals,
            };

            // Print token metadata
            console.log(JSON.stringify(metadata, null, 2));
        } catch (error) {
            console.error('Error processing websocket message:', error);
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket encountered an error:', error);
    });

    // Subscribe to program account updates
    ws.send(JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'accountSubscribe',
        params: {
            pubkey: tokenProgramId.toBase58(),
            commitment: 'recent',
        },
    }));
}

// Start monitoring token accounts
monitorTokenAccounts();
