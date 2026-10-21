 export function createCoinRow(coin){
    const row = document.createElement("tr");

    const rankCell = document.createElement("td");
    rankCell.textContent = coin.market_cap_rank;

    const nameCell = document.createElement("td");
    nameCell.textContent = coin.name;

    const priceCell = document.createElement("td")
    //Add the dollar sign infront of numbers
    priceCell.textContent = coin.current_price.toLocaleString("en-US", { style: "currency", currency: "USD" });;

    const changeCell = document.createElement("td");
    changeCell.textContent = coin.price_change_percentage_24h.toFixed(2) + "%";
    if (coin.price_change_percentage_24h >= 0) {
    changeCell.classList.add("gain");
    }
    else {
   changeCell.classList.add("loss");
    }
   
    row.append(rankCell,nameCell, priceCell, changeCell )

    return row;
}
export function renderCoins(coins){
    const tableBody = document.querySelector("#coin-table-body");
    tableBody.replaceChildren();
    coins.forEach((coin) => {
        const row = createCoinRow(coin);
        tableBody.append(row);     
    });
}