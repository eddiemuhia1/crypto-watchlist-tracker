import { fetchTopCoins,  searchCoins, getCoinsByIds } from "./api.js";
import { renderCoins, clearStatus, showStatus } from "./ui.js";

async function loadCoins() {
  showStatus("Loading...");  
  const coins = await fetchTopCoins();
  renderCoins(coins);
  clearStatus();
}

loadCoins();

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



