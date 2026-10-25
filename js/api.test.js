import { getWatchlist, addToWatchlist } from "./api.js";

// Mock the browser's localStorage
beforeEach(() => {
  let store = {};
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => store[key] || null);
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { store[key] = value.toString(); });
});

afterEach(() => {
  jest.restoreAllMocks(); // Clean up after each test
});

test("adds a new coin to the watchlist", async () => {
  const mockCoin = { id: "bitcoin", name: "Bitcoin", symbol: "btc" };
  
  await addToWatchlist(mockCoin);
  const watchlist = await getWatchlist();
  
  expect(watchlist.length).toBe(1);
  expect(watchlist[0].name).toBe("Bitcoin");
});