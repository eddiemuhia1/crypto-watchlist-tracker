 export function createCoinRow(coin, currency = "usd"){
    const row = document.createElement("tr");
        row.dataset.id = coin.id;

    const rankCell = document.createElement("td");
    rankCell.textContent = coin.market_cap_rank;

    const nameCell = document.createElement("td");
    nameCell.textContent = `${coin.name} (${coin.symbol.toUpperCase()})`;

    const priceCell = document.createElement("td");
    priceCell.textContent = coin.current_price.toLocaleString("en-US", { 
style: "currency", 
currency: currency.toUpperCase() 
});;

    const changeCell = document.createElement("td");
    const percentage = coin.price_change_percentage_24h || 0;
     changeCell.textContent = percentage.toFixed(2) + "%";
    if (percentage >= 0) {
    changeCell.classList.add("gain");
    }     else {
   changeCell.classList.add("loss");
    }
   
const actionCell = document.createElement("td");
    const addButton = document.createElement("button");
    addButton.textContent = "+ Add";
    addButton.className = "action-btn";
    
    addButton.dataset.id = coin.id;
    addButton.dataset.name = coin.name;
    addButton.dataset.symbol = coin.symbol;
    
    actionCell.append(addButton);
    row.append(rankCell, nameCell, priceCell, changeCell, actionCell);

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