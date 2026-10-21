/* import { fetchTopCoins } from "./api.js";
import { renderCoins } from "./ui.js";

//const tableBody = document.querySelector('#coin-table-body');


async function loadCoins() {
    const coins = await fetchTopCoins();
   // const row = createCoinRow(coins[0]);
    //tableBody.append(row);
    renderCoins();  
  
}
loadCoins(); */

import { fetchTopCoins } from "./api.js";
import { renderCoins } from "./ui.js";

async function loadCoins() {
  const coins = await fetchTopCoins();
  renderCoins(coins);
}

loadCoins();



