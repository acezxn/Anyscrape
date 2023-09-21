const { fetch_news } = require("./fetch_news/fetch_news.js");

async function main() {
    await fetch_news();
}

main();