import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, getTokenMetadata } from "@solana/spl-token";

import { LAMPORTS_PER_SOL, Connection, PublicKey } from "@solana/web3.js";
import { WebSocket, MessageEvent, ErrorEvent } from "ws";

const account = "enter acc"
const mintedTokens = new Array();

const connection = new Connection("enter url")

//track notification changes of a specific public key account
function subscribeToAccount(ws: WebSocket, account: string) {
    const request = {
        "jsonrpc": "2.0",
        "id": 1567,
        "method": "accountSubscribe",
        "params": [
            account,
            {
            "encoding": "jsonParsed",
            "commitment": "confirmed"
            }
        ]
    }
    ws.send(JSON.stringify(request));
}

function subscribeToProgram(ws: WebSocket, programId: string) {
    const request = {
        "jsonrpc": "2.0",
        "id": 9834,
        "method": "programSubscribe",
        "params": [
            programId,
            {
                "encoding": "jsonParsed",
                "commitment": "confirmed"
            }
        ]
    }
    ws.send(JSON.stringify(request));

}

const ws = new WebSocket("enter wss url");


ws.addEventListener("open", () => {
    console.log("Connection open. Listening...");

    // subscribeToAccount(ws, "75tTsbp4qkN4XLnWBj7xWzEbfgeZzJTTZH8h94ttKxcg")
    subscribeToProgram(ws, TOKEN_2022_PROGRAM_ID.toBase58());
})

ws.addEventListener("close", () => {
    console.log("Connection closed. Goodbye.")
})

ws.addEventListener("message", (ev: MessageEvent) => {
    // console.log("New message: " + ev.data);
    const data = JSON.parse(ev.data.toString());

    //if we call the subscribeToAccount()
    if (data?.method === "accountNotification") {
        const lamports = data?.params?.result?.value?.lamports;
        console.log("New balance: " + lamports/LAMPORTS_PER_SOL);
    }

    //if we call the subscribeToProgram()
    if (data?.method === "programNotification") {

        const newNotificationType = data?.params?.result?.value?.account?.data?.parsed?.type;
        const newTokenType = data?.params?.result?.value?.account?.data?.parsed?.info?.decimals;
        const freezeAuthority = data?.params?.result?.value?.account?.data?.parsed?.info?.freezeAuthority;
        const mintAuthority = data?.params?.result?.value?.account?.data?.parsed?.info?.mintAuthority;
        const extensions = data["params"]?.["result"]?.["value"]?.["account"]?.["data"]?.["parsed"]?.["info"]?.["extensions"];

        const pubKey = data?.params?.result?.value?.pubkey;
       
        if (newNotificationType === "mint" && newTokenType !== 0 && freezeAuthority === null && mintAuthority === null) {
            mintedTokens.push(pubKey);
            // console.log(mintedTokens);
            console.log("Added new token: ", pubKey)
            
            const newPubKey = new PublicKey(pubKey);

            findMetadata(newPubKey);
            // console.log("New Mint Notification: " + ev.data)
        }        
    }
})

ws.addEventListener("error", (ev: ErrorEvent) => {
    console.log(""+ev.error);
})

async function findMetadata(newPubKey: PublicKey) {
    const tokenMetadata = await getTokenMetadata(
        connection,
        newPubKey
    ) 
    if (tokenMetadata !== null) {
        console.log("Token Metadata: ", tokenMetadata)
    }
}