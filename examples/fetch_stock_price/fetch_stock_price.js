const { Scraper } = require("anyscrape");
const parser = require("node-html-parser");
const path = require("path");

async function fetch_stock_price() {
    let companies = ["AAPL", "GOOGL", "AMZN", "META"];
    let url = "https://www.google.com/finance/";
    let scraper = new Scraper();
    await scraper.init();

    await scraper.load_config_file(path.resolve("fetch_stock_price/config/stock_price.json"));

    for (let comp of companies) {
        let selected_elements = await scraper.scrape(url + `quote/${comp}:NASDAQ?hl=en`);

        console.log(`Stock price for ${comp}: \n`);
        for (let element of selected_elements) {
            let parsed = parser.parse(element);
            console.log('\x1b[36m%s\x1b[0m', parsed.textContent + "\n");
        }
    }
}

module.exports = { fetch_stock_price };