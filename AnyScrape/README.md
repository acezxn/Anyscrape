# Anyscrape

Scrape any public data with ease

## Purpose

The first step to write a typical web scraper is to identify which element to scrape. As a result, an immense amount of work is done to research the structure of the web. Even worse, some websites have dynamically changing information on html elements or structures that are unfriendly to web scrapers.

The library is intended to circumvent anti-scraping structures, and simplify the process of web scraping by leaving a large room of customization.

To simplify the configuration of the web scraper, anyscrape-reader is a GUI application that allows intuitive element selection, and generation of filters.

## Usage

1.) Initialize the scraper class

```javascript
const { Scraper } = require("anyscrape");

async function main() {
    let scraper = new Scraper();
    await scraper.init();
}
```

2.) Load configuration

The configuration is generated as a json file by Anyscrape reader. This specifies which element for anyscrape to fetch.

Load json configuration file

```Javascript
await scraper.load_config_file("filepath.json");
```

or load dictionary object

```javascript
await scraper.load_config(dictionary);
```

3.) Web scraping

With configuration imported, the next step is to scrape a website.

Get html objects selected as a string array

```javascript
let selected_elements = await scraper.scrape(url);
```

Since a string array is returned, it is recommended to use other html parsing library for further manipulation, such as [node-html-parser](https://www.npmjs.com/package/node-html-parser)

## Examples

Fetch headlines from nbcnews.com

config.json:

```json
{
    "filters": {
        "tag_name_filter": "span",
        "class_filter": "tease-card__headline"
    },
    "scrape_delay": 0
}
```

index.js:

```javascript
const { Scraper } = require("anyscrape");
const parser = require("node-html-parser");
const path = require("path");

async function fetch_news() {
    let url = "https://www.nbcnews.com/";
    let scraper = new Scraper();
    await scraper.init();

    await scraper.load_config_file(path.resolve("config.json"));
    let selected_elements = await scraper.scrape(url);

    console.log("Headlines from nbcnews: \n");
    for (let element of selected_elements) {
        let parsed = parser.parse(element);
        console.log('\x1b[36m%s\x1b[0m', parsed.textContent + "\n");
    }
}
```

for more examples, see [examples](https://github.com/acezxn/Anyscrape/tree/main/examples)
