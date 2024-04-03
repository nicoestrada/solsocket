const axios = require('axios');
const { fetchQuote } = require('./fetchQuote');
require(process.env);
const TELEGRAM_BOT_TOKEN = "enter bot token";
const TELEGRAM_CHAT_ID = "enter chat id";

async function getTokenLargestAccounts(tokenAddress, displayData) {
  const url = 'https://long-dawn-sunset.solana-mainnet.quiknode.pro/3ecae5f94abc22ba36a0e77c674729a1df82e817/';
  const data = {
    jsonrpc: '2.0',
    id: 1,
    method: 'getTokenLargestAccounts',
    params: [
        tokenAddress
    ]
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    //top holders info
    const tokenAccountAddress = response.data.result?.value?.address;
    const topHolders = response.data.result;


    const res = []

    for (const value of topHolders.value) {
        res.push({
            "Top Holders": JSON.stringify(value.address),
            "Amount": JSON.stringify(value.uiAmount),
            "Decimals": JSON.stringify(value.decimals)
        })
    }

    console.table(res);
    // fetchQuote(tokenAddress)


    const getRisks = (displayData) => {
      for (const risk of displayData.Risks) {
        const name = JSON.stringify(risk.name);
        const value = JSON.stringify(risk.value)
        const description = JSON.stringify(risk.description);
        const level = JSON.stringify(risk.level);
        return (`${level.toUpperCase()}! \n${name}: ${value} \n${description} \n`);
      }

    }
    
    const description = `Rug check: https://rugcheck.xyz/tokens/${tokenAddress} \nDexscreener: https://dexscreener.com/solana/${tokenAddress} \nCA: ${tokenAddress}`;
    const metadata = `Name: ${displayData.Name} \nSymbol: ${"$"+displayData.Token} \nLP Locked: ${displayData.LPLocked +"%"} \nLP in USD: ${"$"+displayData.LPLockedUSD} \nRisks: ${displayData.Risks !== "None" ? getRisks(displayData) : "None"}`;
    const imageURL = displayData.Image;
    // const Transfertimestamp = new Date(requestBody[0].timestamp * 1000).toLocaleString(); // Convert Unix timestamp to readable date-time
    // const Transfersignature = `https://xray.helius.xyz/tx/${requestBody[0].signature}`
    // Construct the message
    const messageToSendTransfer = 
      `----NEW LP CREATED---\n`+
      `${metadata}\n` +
      `${description}\n`;

      // `Signature:\n${Transfersignature}\n` +
      // `Timestamp:\n${Transfertimestamp}`;
    
    await sendToTelegramTransfer(messageToSendTransfer, imageURL);

  } catch (error) {
    console.error('Error:', error);
  }
}


async function sendToTelegramTransfer(message, imageURL) {
  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
  const response = await fetch(telegramUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      photo: imageURL,
      caption: message, 
      parse_mode: "HTML"
    }),
  });
  const responseData = await response.json();

  if (!response.ok) {
    console.error('Failed to send message to Telegram:', responseData);
  }
}


// Call the function
module.exports = { getTokenLargestAccounts };
