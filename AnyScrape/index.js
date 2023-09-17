const {Scraper} = require("./scraper.js");

var scraper = new Scraper();

async function main() {
    await scraper.init();
    await scraper.load_config_file("/Users/daniel/Downloads/element_data.json")
    await scraper.scrape("https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join");
    console.log("\nDone");
}

main();