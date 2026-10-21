const API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

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


