 export function createCoinRow(coin){
    const row = document.createElement("tr");
    //add data-id
    row.dataset.id = coin.id;

    const rankCell = document.createElement("td");
    rankCell.textContent = coin.market_cap_rank;

    const nameCell = document.createElement("td");
    nameCell.textContent = coin.name;

    const priceCell = document.createElement("td")
    //Add the dollar sign infront of numbers
    priceCell.textContent = coin.current_price.toLocaleString("en-US", { style: "currency", currency: "USD" });;

    const changeCell = document.createElement("td");
    const percentage = coin.price_change_percentage_24h || 0;
     changeCell.textContent = percentage.toFixed(2) + "%";
    if (percentage >= 0) {
    changeCell.classList.add("gain");
    }     else {
   changeCell.classList.add("loss");
    }
   
    row.append(rankCell,nameCell, priceCell, changeCell )

    return row;
}
export function renderCoins(coins){
    const tableBody = document.querySelector("#coin-table-body");
    tableBody.replaceChildren();
    coins.forEach((coin) => {
        const row = createCoinRow(coin);
        tableBody.append(row);     
    });
}
//Add a status message area
export function showStatus(message) {
  const status = document.querySelector("#status-message");
  status.textContent = message;
}
export function clearStatus() {
  const status = document.querySelector("");
  status.textContent = message;
}