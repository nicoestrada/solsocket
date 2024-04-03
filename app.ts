// import { Connection, PublicKey, LAMPORTS_PER_SOL, } from "@solana/web3.js";

// const web3 = require("@solana/web3.js");
// (async () => {
//   const solana = new web3.Connection("https://smart-responsive-firefly.solana-devnet.quiknode.pro/f9f91d670807a35b45b01058948e2cd890c264dd/");
//   console.log(await solana.getSlot());
// })();
const axios = require("axios");
(() => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const data = {
    jsonrpc: "2.0",
    id: 1,
    method: "searchAssets",
    params: {
        "sortBy": {
            "sortBy": "created",
            "sortDirection": "asc",
        }, 
        "ownerType": "token",
        "limit": 1, 
        "page": 1, 
    },
  };
  axios
    .post(
      "https://smart-responsive-firefly.solana-devnet.quiknode.pro/f9f91d670807a35b45b01058948e2cd890c264dd/",
      data,
      config
    )
    .then(function (response) {
      // handle success
      console.log(JSON.stringify(response.data.result.items));
    })
    .catch((err) => {
      // handle error
      console.log(err);
    });
})();