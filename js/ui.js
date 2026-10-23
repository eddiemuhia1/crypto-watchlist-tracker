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

export function renderCoins(coins, currency = "usd"){
    const tableBody = document.querySelector("#coin-table-body");
    tableBody.replaceChildren();
    coins.forEach((coin) => {
// Pass the currency down to the row creator
        const row = createCoinRow(coin, currency);
        tableBody.append(row);     
    });
}
//Add a status message area
export function showStatus(message) {
  const status = document.querySelector("#status-message");
  status.textContent = message;
}
export function clearStatus() {
  const status = document.querySelector("#status-message");
  status.textContent = "";
}
export function createWatchlistRow(item, liveData, currency = "usd") {
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  nameCell.textContent = item.name;

  const livePriceCell = document.createElement("td");
  const currentPrice = liveData ? liveData.current_price : 0;
  
  // Apply dynamic currency formatting
  livePriceCell.textContent = currentPrice.toLocaleString("en-US", { 
    style: "currency", 
    currency: currency.toUpperCase() 
  });
  
  if (currentPrice > 0 && currentPrice <= item.targetPrice) {
    livePriceCell.classList.add("gain");
  }

  const targetPriceCell = document.createElement("td");
  // Apply dynamic currency formatting
  targetPriceCell.textContent = item.targetPrice.toLocaleString("en-US", { 
    style: "currency", 
    currency: currency.toUpperCase() 
  });

  const noteCell = document.createElement("td");
  noteCell.className = "note-cell";
  noteCell.textContent = item.note || "-";

  const actionCell = document.createElement("td");
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "btn-edit";
  editBtn.dataset.dbId = item.id;
  editBtn.dataset.name = item.name;
  editBtn.dataset.targetPrice = item.targetPrice;
  editBtn.dataset.note = item.note || "";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Remove";
  deleteBtn.className = "btn-delete";
  deleteBtn.dataset.dbId = item.id;

  actionCell.append(editBtn, deleteBtn);
  row.append(nameCell, livePriceCell, targetPriceCell, noteCell, actionCell);

  return row;
}

export function renderWatchlist(watchlistItems, liveMarketData, currency = "usd") {
  const tableBody = document.querySelector("#watchlist-table-body");
  tableBody.replaceChildren();

  if (watchlistItems.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" class="empty-watchlist">Your Watchlist is empty</td></tr>';
    return;
  }

  watchlistItems.forEach((item) => {
    const liveData = liveMarketData.find(coin => coin.id === item.coinId);
    // Pass currency to the row creator
    const row = createWatchlistRow(item, liveData, currency);
    tableBody.append(row);     
  });
}
