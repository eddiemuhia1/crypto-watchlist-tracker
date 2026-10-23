import { fetchTopCoins, searchCoins, getCoinsByIds, addToWatchlist, deleteFromWatchlist, getWatchlist, fetchTrending, updateWatchlistItem } from "./api.js";
import { renderCoins, clearStatus, showStatus, renderWatchlist } from "./ui.js";

let currentCurrency = "usd";
const currencyToggle = document.querySelector("#currency-toggle");
const trendingStrip = document.querySelector("#trending-strip");

currencyToggle.addEventListener("change", (e) => {
  currentCurrency = e.target.value;
  loadCoins();
  loadWatchlist();
});

/* async function loadTrending() {
  const trending = await fetchTrending();
  
  const topCoins = trending.slice(0, 8).map(item => {
    const coin = item.item;
    const change24h = coin.data && coin.data.price_change_percentage_24h 
      ? coin.data.price_change_percentage_24h.usd.toFixed(2) 
      : "0.00";
    
    const sign = change24h >= 0 ? "+" : "";
    return `${coin.name} (${coin.symbol.toUpperCase()}): ${sign}${change24h}%`;
  }).join("  |  ");

  // Duplicate the string with a separator in between
  const fullText = `Trending Now: ${topCoins} \u00A0\u00A0|\u00A0\u00A0 `;
  trendingStrip.innerHTML = `<span class="scrolling-text">${fullText} ${fullText}</span>`;
} */
async function loadTrending() {
  const trending = await fetchTrending();
  const topCoins = trending.filter(item => {
    const change = item.item.data && item.item.data.price_change_percentage_24h ? item.item.data.price_change_percentage_24h.usd : 0;
  return change > 0;  
  })
  .sort((a,b) => {
    const changeA = a.item.data.price_change_percentage_24h.usd;
    const changeB = b.item.data.price_change_percentage_24h.usd;
    return changeB - changeA;
    }) 
  .slice(0,10)
  .map(item => {const coin = item.item; const change24h = coin.data.price_change_percentage_24h.usd.toFixed(2);
     return `${coin.name} (${coin.symbol.toUpperCase()}): +${change24h}%`;
    })
  .join(" | ");
  const fullText = `Trending Now: ${topCoins} \u00A0\u00A0|\u00A0\u00A0 `;
  trendingStrip.innerHTML = `<span class="scrolling-text">${fullText} ${fullText}</span>`;
}


loadTrending();

async function loadCoins() {
  showStatus("Loading...");

  try {
    const coins = await fetchTopCoins(currentCurrency);

    if (coins.length === 0) {
      showStatus("Couldn't load prices. Check your connection and try again.");
      return;
    }

    renderCoins(coins, currentCurrency);
    clearStatus();
  } catch (error) {
    console.error("loadCoins failed:", error);
    showStatus("Something went wrong while showing the prices.");
  }
}

loadCoins();
loadWatchlist();

const searchForm = document.querySelector("#search-form"); 
const searchInput = document.querySelector("#search-input"); 
const tableBody = document.querySelector("#coin-table-body"); 

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const query = searchInput.value.trim();
  
  if (!query) {
    loadCoins(); // Reload top 10 if input is empty
    return;
  }

  showStatus("Searching...");
  const searchResults = await searchCoins(query);
  
  if (searchResults.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5">No coins found</td></tr>';
    clearStatus();
    return;
  }
  
  // Take top 5 IDs and fetch their market data
  const topIds = searchResults.slice(0, 5).map(c => c.id);
  const marketData = await getCoinsByIds(topIds);
  
  if (marketData.length > 0) {
    renderCoins(marketData);
  } else {
    tableBody.innerHTML = '<tr><td colspan="5">No prices found for these coins</td></tr>';
  }
  
  clearStatus();
});
const modal = document.querySelector("#watchlist-modal")
const modalCoinName = document.querySelector("#modal-coin-name")
const modalCoinId = document.querySelector("#modal-coin-id")
const modalCoinSymbol = document.querySelector("#modal-coin-symbol")
const watchListForm = document.querySelector("#watchlist-form")
const cancelBtn = document.querySelector("#cancel-btn")

tableBody.addEventListener("click", (event) => {
  if (event.target.classList.contains("action-btn")) {
    const btn = event.target;
    
    // Populate hidden inputs and header with the clicked coin's data
    modalCoinId.value = btn.dataset.id;
    modalCoinSymbol.value = btn.dataset.symbol;
    modalCoinName.textContent = btn.dataset.name;
    
    // Show the modal by removing the 'hidden' class
    modal.classList.remove("hidden");
  }
});

// Close modal on cancel
cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  watchListForm.reset(); // Clear input fields
});

// Handle form submission 
watchListForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const targetPrice = document.querySelector("#target-price").value;
  const note = document.querySelector("#coin-note").value;
  
  // Construct the object expected by your json-server
  const newWatchlistItem = {
    coinId: modalCoinId.value,
    name: modalCoinName.textContent,
    symbol: modalCoinSymbol.value,
    targetPrice: parseFloat(targetPrice),
    note: note
  };
  
  showStatus("Saving to watchlist...");
  
  const savedItem = await addToWatchlist(newWatchlistItem);
  
  if (savedItem) {
    loadWatchlist()
  }
  
  // Close and clean up
  modal.classList.add("hidden");
  watchListForm.reset();
  clearStatus();
});
const watchlistTableBody = document.querySelector("#watchlist-table-body");


async function loadWatchlist() {
  const watchlistItems = await getWatchlist();
  
  if (watchlistItems.length === 0) {
    renderWatchlist([], [], currentCurrency);
    return;
  }
  const coinIds = watchlistItems.map(item => item.coinId);
  
  // Fetch live prices for those specific saved coins
  const liveMarketData = await getCoinsByIds(coinIds, currentCurrency);
  
  // Render the table with both local db data and live CoinGecko data
  renderWatchlist(watchlistItems, liveMarketData, currentCurrency);
}

// ---- Edit modal ----
const editModal = document.querySelector("#edit-modal");
const editForm = document.querySelector("#edit-form");
const editDbId = document.querySelector("#edit-db-id");
const editCoinName = document.querySelector("#edit-coin-name");
const editTargetPrice = document.querySelector("#edit-target-price");
const editNote = document.querySelector("#edit-note");
const editCancelBtn = document.querySelector("#edit-cancel-btn");

// One click listener for both Edit and Remove buttons (event delegation)
watchlistTableBody.addEventListener("click", async (event) => {
  const btn = event.target;

  if (btn.classList.contains("btn-edit")) {
    editDbId.value = btn.dataset.dbId;
    editCoinName.textContent = btn.dataset.name;
    editTargetPrice.value = btn.dataset.targetPrice;
    editNote.value = btn.dataset.note;
    editModal.classList.remove("hidden");
    return;
  }

  if (btn.classList.contains("btn-delete")) {
    const dbId = btn.dataset.dbId;
    btn.closest("tr").remove();

    const success = await deleteFromWatchlist(dbId);
    if (!success) {
      alert("Failed to delete item from database.");
      loadWatchlist();
    }
  }
});

editCancelBtn.addEventListener("click", () => {
  editModal.classList.add("hidden");
  editForm.reset();
});

editForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const changes = {
    targetPrice: parseFloat(editTargetPrice.value),
    note: editNote.value.trim()
  };

  showStatus("Saving changes...");
  const updated = await updateWatchlistItem(editDbId.value, changes);

  if (updated) {
    await loadWatchlist();
  } else {
    alert("Could not save your changes. Is json-server running?");
  }

  editModal.classList.add("hidden");
  editForm.reset();
  clearStatus();
});