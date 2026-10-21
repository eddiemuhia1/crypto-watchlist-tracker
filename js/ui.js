 export function createCoinRow(coin){
    const row = document.createElement("tr");

    const rankCell = document.createElement("td");
    rankCell.textContent = coin.market_cap_rank;

    const nameCell = document.createElement("td");
    nameCell.textContent = coin.name;

    const priceCell = document.createElement("td")
    priceCell.textContent = coin.current_price;

    row.append(rankCell,nameCell, priceCell )

    return row;

}