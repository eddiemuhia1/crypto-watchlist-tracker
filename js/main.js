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

async function loadTrending() {
  const trending = await fetchTrending();
  const top3 = trending.slice(0, 3).map(item => `${item.item.name} (${item.item.symbol})`).join(" 🔥 | ");
  trendingStrip.innerHTML = `<span class="scrolling-text">Trending Now: 🔥 ${top3}</span>`;
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

const searchForm = document.querySelector("#search-form"); // Ensure this ID matches your HTML
const searchInput = document.querySelector("#search-input"); // Ensure this ID matches your HTML
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
    tableBody.innerHTML = '<tr><td colspan="4">No coins found</td></tr>';
    clearStatus();
    return;
  }
  
  // Take top 5 IDs and fetch their market data
  const topIds = searchResults.slice(0, 5).map(c => c.id);
  const marketData = await getCoinsByIds(topIds);
  
  if (marketData.length > 0) {
    renderCoins(marketData);
  } else {
    tableBody.innerHTML = '<tr><td colspan="4">No prices found for these coins</td></tr>';
  }
  
  clearStatus();
});



