const API_KEY = "1bed27ae-26fb-453b-9771-06bbbe64fc0b"
const url = `https://mainnet.helius-rpc.com/?api-key=${API_KEY}`

const getAsset = async () => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAsset',
      params: {
        id: 'FMHv9WYu6KmMwbMs4KghZou7LVNKdPDfvYnCcHc5pLrU',
        displayOptions: {
      showFungible: true //return details about a fungible token
  }
      },
    }),
  });

  const { result } = await response.json();
  const address = result.id;
  const mutable = result.mutable;
  const burnt = result.burnt;
  const frozen = result.ownership.frozen;
  const name = result.content.metadata.name;
  const description = result.content.metadata.description;
  const symbol = result.content.metadata.symbol;
  console.log(result)

  // console.log("New Token: ", symbol, "-", name, "\n", "Description: ",description, "\n", "CA: ", address)
  // console.log("Mutable: ", mutable);
  // console.log("Burnt ", burnt);
  // console.log("Frozen: ", frozen);
};
getAsset();
