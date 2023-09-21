const { fetch_news } = require("./fetch_news/fetch_news.js");
const { fetch_stock_price } = require("./fetch_stock_price/fetch_stock_price.js");

async function main() {
    await fetch_news();
    await fetch_stock_price();
}

main();