# Crypto Watchlist & Price Notifier

A dynamic web application built with Vanilla JavaScript that tracks real-time cryptocurrency prices, manages a personalized local watchlist, and visually highlights when coins hit specific target buy prices.

## Live Demo

https://eddiemuhia1.github.io/crypto-watchlist-tracker/

## Features

* **Live Market Data:** Fetches and displays the top 10 cryptocurrencies by market cap using the CoinGecko API.


* **Dynamic Currency Toggle:** Seamlessly switch the entire dashboard and watchlist between USD and KES (Kenyan Shillings). KES conversions are mathematically calculated using live exchange rates to bypass API endpoint restrictions.


* **Trending Strip:** A continuously scrolling CSS-animated banner highlighting the top 3 trending coins on the market.


* **Search Functionality:** Query the database to find specific cryptocurrencies and fetch their live market data.


* **Custom Watchlist (CRUD):** Add, edit, and remove coins from a personalized watchlist powered by a local REST API.


* **Target Price Tracking:** Set custom target prices for saved coins. The UI automatically highlights the live price in green when the market drops to or below your specified target.


* **Robust Error Handling:** Safely handles missing API data (like null 24-hour percentage changes) and API rate limits by displaying user-friendly status messages without crashing the application.



## Technologies Used

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
* **Backend / Database:** `json-server` (Local REST API mock)
* **External APIs:** CoinGecko API v3 (Markets, Search, Trending, and Exchange Rates endpoints)



## Prerequisites

To run this project locally, you need [Node.js](https://nodejs.org/) installed on your machine to run the local database.

## Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/eddiemuhia1/crypto-watchlist-tracker
cd <your-project-folder>

```


2. **Start the local database:**
The watchlist relies on `json-server` to store data. Open a terminal in the project root and run:


```bash
npx json-server --watch db.json --port 3000

```


3. **Launch the application:**
Open `index.html` in your browser using a local server extension (like VS Code's "Live Server").

## Project Structure

* **`api.js`**: Handles all asynchronous `fetch` requests to the CoinGecko API and local `json-server`.


* **`main.js`**: Acts as the controller, managing state (`currentCurrency`), event listeners, modals, and coordinating data between the API and the UI.


* **`ui.js`**: Handles all DOM manipulation, table row creation, dynamic currency formatting, and state-based CSS styling.



## Future Enhancements

* **Auto-Refresh Interval:** Implementing a background timer to fetch and update live prices automatically without manual page reloads.
* **Browser Notifications:** Wiring up the Desktop Notification API to alert users the moment a watchlist coin drops below its target price.
* **Interactive Sorting:** Adding clickable table headers to sort the displayed coins by market cap, name, or 24-hour price change.

## WireFrame
https://www.figma.com/design/14dWfNqvft375MuuKeE8Rt/Crypto-Watchlist-WireFrame?node-id=4-46&t=ZPjYcoxU7TvYO7NG-1
