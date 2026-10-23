const BASE_URL = "https://api.coingecko.com/api/v3";
const DB_URL = "http://localhost:3000/watchlist";

//run jsob by: npx json-server --watch db.json --port 3000

// Helper function to get the live USD to KES conversion rate
async function getKesMultiplier() {
  const res = await fetch(`${BASE_URL}/exchange_rates`);
  const data = await res.json();
  // Divide KES rate by USD rate to get the multiplier
  return data.rates.kes.value / data.rates.usd.value;
}

export async function fetchTopCoins(currency = "usd") {
  try {
    // Always fetch markets in USD to avoid API rejections
    const fetchCurrency = currency === "kes" ? "usd" : currency;
    const response = await fetch(`${BASE_URL}/coins/markets?vs_currency=${fetchCurrency}&order=market_cap_desc&per_page=10&page=1`);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    const data = await response.json();

    // If user wants KES, multiply the USD prices by the exchange rate
    if (currency === "kes") {
      const kesRate = await getKesMultiplier();
      return data.map(coin => ({ ...coin, current_price: coin.current_price * kesRate }));
    }
    return data;
  } catch (error) {
    console.error("Could not fetch coins: ", error); 
    return []; 
  } 
}

export async function getCoinsByIds(ids, currency = "usd") {
  try {
    const idsString = Array.isArray(ids) ? ids.join(',') : ids;
    if (!idsString) return [];
    
    const fetchCurrency = currency === "kes" ? "usd" : currency;
    const response = await fetch(`${BASE_URL}/coins/markets?vs_currency=${fetchCurrency}&ids=${encodeURIComponent(idsString)}`);
    if (!response.ok) throw new Error(`Market fetch failed: ${response.status}`);
    const data = await response.json();

    if (currency === "kes") {
      const kesRate = await getKesMultiplier();
      return data.map(coin => ({ ...coin, current_price: coin.current_price * kesRate }));
    }
    return data;
  } catch (error) {
    console.error("Error fetching market data:", error);
    return [];
  }
}

export async function searchCoins(query) {
  try {
    const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error(`Search failed: ${response.status}`);
    const data = await response.json();
    return data.coins || []; 
  } catch (error) {
    console.error("Error searching coins:", error);
    return [];
  }
}

//fetches the trending coins and displays them in a strip
export async function fetchTrending() {
  try {
    const response = await fetch(`${BASE_URL}/search/trending`);
    if (!response.ok) throw new Error(`Trending fetch failed`);
    const data = await response.json();
    return data.coins; 
  } catch (error) {
    console.error("Error fetching trending coins:", error);
    return [];
  }
}
// Fetch watchlist items from browser storage
export async function getWatchlist() {
  const items = localStorage.getItem("crypto_watchlist");
  return items ? JSON.parse(items) : [];
}

// Add new coin to browser storage
export async function addToWatchlist(coinData) {
  const watchlist = await getWatchlist();
  // Ensure the coin has a unique ID, falling back to a timestamp
  const newItem = { ...coinData, id: coinData.id || Date.now().toString() };
  watchlist.push(newItem);
  localStorage.setItem("crypto_watchlist", JSON.stringify(watchlist));
  return newItem;
}

// Delete coin from browser storage
export async function deleteFromWatchlist(id) {
  const watchlist = await getWatchlist();
  const updatedWatchlist = watchlist.filter(item => item.id !== id);
  localStorage.setItem("crypto_watchlist", JSON.stringify(updatedWatchlist));
  return true;
}

// Update target price or notes in browser storage
export async function updateWatchlistItem(id, changes) {
  const watchlist = await getWatchlist();
  const index = watchlist.findIndex(item => item.id === id);
  if (index !== -1) {
    watchlist[index] = { ...watchlist[index], ...changes };
    localStorage.setItem("crypto_watchlist", JSON.stringify(watchlist));
    return watchlist[index];
  }
  return null;
}

/* export async function getWatchlist(){
  try{
    const response = await fetch (DB_URL);
    if(!response.ok) throw new Error (`Watchlist fetch failed; ${response.status}`);
    return await response.json();
  }
  catch(error){
    console.error("Error fetching watchlist", error);
    return[];
  }
}
//sends new data
export async function addToWatchlist(coinData){
  try {
    const response = await fetch((DB_URL), {
      method:"POST", headers: {"Content-Type":"application/json"},
      body:JSON.stringify(coinData) });
    if(!response.ok) throw new Error (`Failed to add coin: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error adding to watchlist",error);
    return null;
  }
}
//Add a delete request function
export async function deleteFromWatchlist(id) {
  try {
    const response = await fetch(`${DB_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
    return true;
  } catch (error) {
    console.error("Error deleting from watchlist:", error);
    return false;
  }
}
export async function updateWatchlistItem(id, changes) {
  try {
    const response = await fetch(`${DB_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
    if (!response.ok) throw new Error(`Update failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error updating watchlist item:", error);
    return null;
  }
} */
export async function updateTargetPrice(id, newTarget) {
  try {
    await fetch(`${DB_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetPrice: Number(newTarget) })
    });
  } catch (error) {
    console.error("Failed to update target price", error);
  }
}