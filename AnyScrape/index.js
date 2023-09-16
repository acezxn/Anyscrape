import Scraper from "./scraper.js";

var scraper = new Scraper();

async function main() {
    await scraper.init();
    await scraper.set_configuration("/Users/daniel/Downloads/element_data.json")
    await scraper.scrape("https://www.nbcnews.com/");
    console.log("\nDone");
}

main();