const API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";
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

export async function fetchTopCoins() {
 try {
    const response = await fetch(API_URL)
    if (!response.ok) {
       throw new Error(`Request failed: ${response.status}`);
    }
    const coins = await response.json();
    return coins;
  } 
  catch (error) {
   console.error("Could not fetch coins: ", error); 
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

export async function getCoinsByIds(ids) {
  try {
    const idsString = Array.isArray(ids) ? ids.join(',') : ids;
    if (!idsString) return [];
    
    const response = await fetch(`${BASE_URL}/coins/markets?vs_currency=usd&ids=${encodeURIComponent(idsString)}`);
    if (!response.ok) throw new Error(`Market fetch failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching market data:", error);
    return [];
  }
}
export async function getWatchlist(){
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
    const response = await fetch(DB_URL, {
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