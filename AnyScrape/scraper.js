const parser = require("node-html-parser");
const puppeteer = require("puppeteer")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class Scraper {
    constructor(url) {
        this.browser = null;
        this.page = null;
        this.page_html = "";
        this.parsed_page_html = null;
        this.config = null;
        this.selected_elements = [];
    }

    /**
     * Initializes the browser environment
     *
     * @memberof Scraper
     */
    async init() {
        try {
            this.browser = await puppeteer.launch({
                headless: true,
            });
        } catch (err) {
            console.log("Browser creation failed => : ", err);
        }
    }
    async goto(url) {
        this.page = await this.browser.newPage();
        await this.page.goto(url, { waitUntil: "domcontentloaded" });
    }
    async load_config_file(filename) {
        const config = require(filename);
        this.config = config;
    }
    async load_config(config) {
        this.config = config;
    }

    /**
     * Filters out elements by attributes listed in configuration
     *
     * @param {parser.parse.HTMLElement[]} elements_array element array to be filtered
     * @returns {parser.parse.HTMLElement[]} filtered element array
     * @memberof Scraper
     */
    filter_by_attribute(elements_array) {
        let tmp_elements = [];
        for (let element of elements_array) {
            let element_name = ""
            let element_class = "";
            let element_id = "";
            let element_type = "";

            if (element instanceof parser.parse.HTMLElement) {
                // filter out elements with name unmatch
                if (this.config.tag_name !== "") {
                    element_name = element.rawTagName;
                    if (element_name !== this.config.tag_name) {
                        continue;
                    }
                }
                // filter out elements with class unmatch
                if (this.config.tag_class !== "") {
                    element_class = element.getAttribute("class");
                    if (element_class !== this.config.tag_class) {
                        continue;
                    }
                }
                // filter out elements with id unmatch
                if (this.config.tag_id !== "") {
                    element_id = element.getAttribute("id");
                    if (element_id !== this.config.tag_id) {
                        continue;
                    }
                }
                // filter out elements with type unmatch
                if (this.config.tag_type !== "") {
                    element_type = element.getAttribute("type");
                    if (element_type !== this.config.tag_type) {
                        continue;
                    }
                }
            }
            tmp_elements.push(element);
        }
        return tmp_elements;
    }

    /**
     * Filter the page's html with location
     *
     * @returns {parser.parse.HTMLElement[]}  
     * @memberof Scraper filtered element array
     */
    filter_by_location() {
        var tmp_elements = [];
        var parsed_location = this.config.tag_location.split(".");

        function search(root, depth = 0) {
            if (root === undefined) {
                return;
            }
            if (depth === parsed_location.length) {
                tmp_elements.push(root);
                return;
            }

            let location = parsed_location[depth];
            let operands = [];
            let multiplier_changed = false;
            let multiplier = 0;
            let offset = 0;
            let operator_idx = 0;

            // evaluates equation if it is
            if (!/^[0-9]*$/.test(location)) {
                location = location.toLowerCase().replace(" ", "");
                operands = location.split(/[+-]+/);
                for (let index = 0; index < operands.length; index++) {
                    if (operands[index].includes("x")) {
                        if (operands[index].length > 1) {
                            let amount = parseInt(operands[index].replace("x", ""));
                            multiplier += location[operator_idx] === "-" ? -amount : amount;
                        } else {
                            multiplier += location[operator_idx] === "-" ? -1 : 1;
                        }
                        multiplier_changed = true;
                    }
                    else if (operands[index].length >= 1) {
                        let amount = parseInt(operands[index]);
                        offset += location[operator_idx] === "-" ? -amount : amount;
                    }

                    if (operands[index].length !== 0) {
                        operator_idx += operands[index].length;
                    }
                }

                if (!multiplier_changed) {
                    multiplier = 0;
                }

                for (let index = Math.max(Math.min(offset, root.childNodes.length - 1), 0);
                    index < root.childNodes.length; index += multiplier) {
                    search(root.childNodes[index], depth + 1);
                }
                return;
            }
            return search(root.childNodes[parseInt(location)], depth + 1);
        }

        search(this.parsed_page_html);
        return tmp_elements;
    }

    /**
     * Scrape the url
     *
     * @param {*} url url to scrape
     * @param {*} delay_ms millisecond delay before grabbing html
     * @memberof Scraper
     */
    async scrape(url) {
        await this.goto(url);
        await sleep(parseInt(this.config.scrape_delay));
        this.page_html = await this.page.evaluate(() => document.querySelector('body').innerHTML);
        this.parsed_page_html = parser.parse(this.page_html);

        var tag_query = "*";
        this.selected_elements = [];

        if (this.config.tag_location !== "") {
            this.selected_elements = this.filter_by_location();
        } else {
            // filter by tag name
            if (this.config.tag_name !== "") {
                tag_query = this.config.tag_name;
            }
            this.selected_elements = this.parser.parsed_page_html.getElementsByTagName(this.config.tag_name);
        }
        this.selected_elements = this.filter_by_attribute(this.selected_elements);

        return this.selected_elements;
    }
}

module.exports = {Scraper}