const { Scraper } = require("anyscrape");
const parser = require("node-html-parser");
const path = require("path");

async function fetch_news() {
    let url = "https://www.nbcnews.com/";
    let scraper = new Scraper();
    await scraper.init();

    await scraper.load_config_file(path.resolve("fetch_news/config/latest_news.json"));
    let selected_elements = await scraper.scrape(url);

    console.log("Latest news from nbcnews: \n");
    for (let element of selected_elements) {
        let parsed = parser.parse(element);
        console.log('\x1b[36m%s\x1b[0m', parsed.textContent + "\n");
    }
}

module.exports = { fetch_news };