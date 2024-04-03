import  { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import axios from "axios";

const url = "https://smart-responsive-firefly.solana-devnet.quiknode.pro/f9f91d670807a35b45b01058948e2cd890c264dd/"
// Create a connection to the Solana JSON RPC endpoint
const connection = new Connection('https://smart-responsive-firefly.solana-devnet.quiknode.pro/f9f91d670807a35b45b01058948e2cd890c264dd/');

// Public key of the address for which you want to retrieve signatures
const address = new PublicKey('75tTsbp4qkN4XLnWBj7xWzEbfgeZzJTTZH8h94ttKxcg');

// Number of signature results to return (optional)
const limit = 10;
const trxSignatures = new Array(0);

// RPC method request to get signatures for a specific address
connection.getSignaturesForAddress(TOKEN_2022_PROGRAM_ID, {
  limit,
}).then((signatures) => {
    signatures.forEach(signature => {
      //logic for grabbing every trx signature in most recent time
      trxSignatures.push(signature.signature);
    });

    console.log("Got the 10 most recent transactions from TOKEN 2022 PROGRAM below! \n " + trxSignatures + "\n Now grabbing those transaction objects for you...");

    for (const signature of trxSignatures) {
      getTransaction(signature);
    }

}).catch((error) => {
    console.error('Error fetching signatures:', error);
});


async function getTransaction(signature: string) {
  try {
      const response = await axios.post(url, {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTransaction",
        "params": [
          signature,
          {
            "maxSupportedTransactionVersion": 0
          }
        ]
      }, {
          headers: {
              'Content-Type': 'application/json'
          }
      });

      console.log('Transaction:', JSON.stringify(response.data));
  } catch (error) {
      console.error('Error fetching transaction:', error);
  }
}