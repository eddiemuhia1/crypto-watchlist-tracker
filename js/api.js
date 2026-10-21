const API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";
const BASE_URL = "https://api.coingecko.com/api/v3";

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


