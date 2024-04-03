const { Connection, PublicKey } = require("@solana/web3.js");
const { WebSocket, MessageEvent, ErrorEvent } = require("ws");
const { getAsset } = require('./getAsset');
const { json } = require("stream/consumers");

const RAYDIUM_PUBLIC_KEY = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
const SESSION_HASH = 'boom' + Math.ceil(Math.random() * 1e9); // Random unique identifier for your session
const HTTP_URL = "https://long-dawn-sunset.solana-mainnet.quiknode.pro/3ecae5f94abc22ba36a0e77c674729a1df82e817/";
const WSS_URL = "wss://long-dawn-sunset.solana-mainnet.quiknode.pro/3ecae5f94abc22ba36a0e77c674729a1df82e817/";

let credits = 0;

const raydium = new PublicKey(RAYDIUM_PUBLIC_KEY);

const connection = new Connection(HTTP_URL, {
    wsEndpoint: WSS_URL,
    httpHeaders: {"x-session-hash": SESSION_HASH}
});

// Monitor logs
async function main(connection, programAddress) {
    console.log("Monitoring logs for program:", programAddress.toString());
    connection.onLogs(
        programAddress,
        ({ logs, err, signature }) => {
            if (err) return;

            if (logs && logs.some(log => log.includes("initialize2"))) {
                // console.log("Signature for 'initialize2':", signature);
                fetchRaydiumAccounts(signature, connection);
            }
        },
        "confirmed"
    );
}

// Parse transaction and filter data
async function fetchRaydiumAccounts(txId, connection) {
    const tx = await connection.getParsedTransaction(
        txId,
        {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed'
        });
    
    credits += 100;
    const accounts = tx?.transaction.message.instructions.find(ix => ix.programId.toBase58() === RAYDIUM_PUBLIC_KEY)?.accounts;

    if (!accounts) {
        console.log("No accounts found in the transaction.");
        return;
    }

    const tokenAIndex = 8;
    const tokenBIndex = 9;

    const tokenAAccount = accounts[tokenAIndex];
    const tokenBAccount = accounts[tokenBIndex];
    // const tokenProgram = accounts[0];
    console.log("------------------------------------")
    console.log("New LP Found: ", generateExplorerUrl(txId));
    // console.log("View top holders: ", generateHoldersUrl(tokenAAccount));
    getRugCheckInfo(tokenAAccount, tokenBAccount);
    console.log("------------------------------------")

    // console.log("Total QuickNode Credits Used in this session:", credits);
}

function generateExplorerUrl(txId) {
    return `https://solscan.io/tx/${txId}`;
}

// function generateHoldersUrl(tokenAAccount) {
//     return `https://solscan.io/token/${tokenAAccount.toBase58()}#holders`;
// }


//get info from rugcheck.xyz
async function getRugCheckInfo(tokenAAccount, tokenBAccount) {
    const rugCheckURL = `https://api.rugcheck.xyz/v1/tokens/${tokenAAccount}/report`;
    try {
      const response = await fetch(rugCheckURL);
        
    //   if (!response.ok) {
    //     throw new Error('Network response was not ok: ', response.message);
    //   }
    
      const rugcheckResult = await response.json();
        
      //round to nearest integer
      const lpLockedPct = Math.round(rugcheckResult?.markets?.[0]?.lp?.lpLockedPct);
      const lpLockedUSD = Math.round(rugcheckResult?.markets?.[0]?.lp?.lpLockedUSD)
      const tokenImage = rugcheckResult?.fileMeta?.image;
      const risks = rugcheckResult?.risks?.length > 0 ? rugcheckResult?.risks : "None";

      const mintAuthority = rugcheckResult?.token?.mintAuthority;
      const freezeAuthority = rugcheckResult?.token?.freezeAuthority;
      
      if (mintAuthority === null && freezeAuthority === null) {
        findMetadata(tokenAAccount, tokenBAccount, lpLockedPct, lpLockedUSD, tokenImage, risks);
      } else {
        console.log("Freeze or Mint authority enabled, discarding...")
      }

  
    } catch (error) {
      console.error('Error fetching JSON:', error);
      throw error;
    }
  }

async function findMetadata(tokenAAccount, tokenBAccount, lpLockedPct, lpLockedUSD, tokenImage, risks) {  
    try {
        const request = await getAsset(tokenAAccount, tokenBAccount, lpLockedPct, lpLockedUSD, tokenImage, risks);

    } catch (error) {
        console.log(error);
    }
}


  

main(connection, raydium).catch(console.error);