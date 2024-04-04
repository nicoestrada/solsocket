const axios = require('axios');
const { getTokenLargestAccounts } = require("./getTokenLargestAccounts");
require('dotenv').config();

async function getAsset(tokenAddress, secondTokenAddress, lpLockedPct, lpLockedUSD, tokenImage, risks) {
  const url = 'enter rpc url';
  const data = {
    jsonrpc: '2.0',
    id: 1,
    method: 'getAsset',
    params: {
      id: tokenAddress
    }
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    //token info
    const tokenSymbol = response.data.result?.content?.metadata?.symbol;
    const tokenName = response.data.result?.content?.metadata?.name;
    const isRoyaltiesLocked = response.data.result?.royalty?.locked;
    const isMutable = response.data.result?.mutable;
    const isBurnt = response.data.result?.burnt
    const isFrozen = response.data.result?.ownership?.frozen;
    // const url = response.data.result?.content?.links?.external_url;
    // const maxSupply = response.data.result?.supply?.print_max_supply;
    // const currSupply = response.data.result?.supply?.print_current_supply;
    const authorities = response.data.result?.authorities?.[0].address;

    tokenAddress = tokenAddress.toBase58();
    secondTokenAddress = secondTokenAddress.toBase58();

    // getRugCheckInfo(tokenAddress);

    const displayData = 
      { 
        "Token": tokenSymbol, 
        "Name": tokenName, 
        "isMutable": isMutable, 
        "isBurnt": isBurnt,
        "LPLocked": lpLockedPct,
        "LPLockedUSD": lpLockedUSD,
        "Image": tokenImage,
        "Risks": risks,
        "LP Addresses": [
          tokenAddress,
          secondTokenAddress
        ]
      };

    if (isMutable === false) {
      // console.table(displayData);
      getTokenLargestAccounts(tokenAddress, displayData);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function
module.exports = { getAsset };