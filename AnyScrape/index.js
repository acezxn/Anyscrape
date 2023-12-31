const parser = require("node-html-parser");
const puppeteer = require("puppeteer");
const { sleep, subset } = require("./utils/utils.js");
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
                headless: "new",
            });
            this.page = await this.browser.newPage();
        } catch (err) {
            console.log("Browser creation failed => : ", err);
        }
    }
    /**
     * Go to a specific url
     *
     * @param {String} url url to go to
     * @memberof Scraper
     */
    async goto(url) {
        try {
            await this.page.goto(url, { waitUntil: "domcontentloaded" });
        } catch (e) {
            throw e;
        }
    }
    /**
     * Runs a query selector and click on the
     * first selected element
     * 
     * @param {String} selector CSS selector
     * @memberof Scraper
     */
    async click_element(selector) {
        await this.page.waitForSelector(selector);
        await this.page.click(selector);
    }

    /**
     * Runs a query selector and type on the
     * first selected element
     * 
     * @param {Strihg} selector CSS selector
     * @param {Strihg} text text to type in
     * @memberof Scraper
     */
    async type_on_element(selector, text) {
        await this.page.waitForSelector(selector);
        await this.page.type(selector, text);
    }

    /**
     * Sets cookie for scraping
     *
     * @param {Object[]} cookies list of cookies
     * @memberof Scraper
     */
    async set_cookie(cookies) {
        await this.page.setCookie(...cookies);
    }

    /**
     * Loads configuration from json
     *
     * @param {String} filename file name
     * @memberof Scraper
     */
    async load_config_file(filename) {
        const config = require(filename);
        this.config = config;
    }
    /**
     * Loads configuration from dictionary
     *
     * @param {Object.<String, String>} config config dictionary
     * @memberof Scraper
     */
    async load_config(config) {
        this.config = config;
    }

    /**
     * Filters out elements by attributes listed in configuration
     *
     * @param {parser.HTMLElement[]} elements_array element array to be filtered
     * @returns {parser.HTMLElement[]} filtered element array
     * @memberof Scraper
     */
    #filter_by_attribute(elements_array) {
        let tmp_elements = [];
        for (let element of elements_array) {
            if (!(element instanceof parser.HTMLElement)) {
                continue;
            }
            let match = true;
            for (let [key, value] of Object.entries(this.config.filters)) {
                let attr_key = key.replace("_filter", "");
                if (attr_key !== "tag_name" && attr_key !== "tag_location" &&
                    value !== "" &&
                    element.attributes[attr_key] !== undefined &&
                    element.attributes[attr_key] !== value) {

                    if (attr_key === "class") {
                        let actual_class_set = new Set(element.attributes[attr_key].split(" "));
                        let expected_class_set = new Set(value.split(" "));

                        if (!subset(expected_class_set, actual_class_set)) {
                            match = false;
                            break;
                        }
                    } else {
                        match = false;
                        break;
                    }
                }
                else if (attr_key !== "tag_name" && attr_key !== "tag_location" &&
                    element.attributes[attr_key] === undefined) {
                    match = false;
                    break;
                }
            }
            if (match) {
                tmp_elements.push(element);
            }
        }
        return tmp_elements;
    }

    /**
     * Filter the page's html with location
     *
     * @returns {parser.HTMLElement[]}  
     * @memberof Scraper filtered element array
     */
    #filter_by_location() {
        var tmp_elements = [];
        var parsed_location = this.config.filters.tag_location_filter.split(".");

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
                    index >= 0 && index < root.childNodes.length; index += multiplier) {
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
     * @param {String} url url to scrape
     * @memberof Scraper
     */
    async scrape(url) {
        try {
            if ("cookies" in this.config) {
                await this.set_cookie(this.config.cookies);
            }
            if (url !== undefined && url !== "") {
                await this.goto(url);
            }
            await sleep(parseInt(this.config.scrape_delay));
            this.page_html = await this.page.evaluate(() => document.querySelector('body').innerHTML);
            this.parsed_page_html = parser.parse(this.page_html);

            var tag_query = "*";
            this.selected_elements = [];

            if ("tag_location_filter" in this.config.filters && this.config.filters.tag_location_filter !== "") {
                this.selected_elements = this.#filter_by_location();
            } else {
                if ("tag_name_filter" in this.config.filters && this.config.filters.tag_name_filter !== "") {
                    tag_query = this.config.filters.tag_name_filter;
                }
                this.selected_elements = this.parsed_page_html.getElementsByTagName(tag_query);
            }

            this.selected_elements = this.#filter_by_attribute(this.selected_elements);

            for (let index = 0; index < this.selected_elements.length; index++) {
                this.selected_elements[index] = this.selected_elements[index].toString();
            }
            return this.selected_elements;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = { Scraper }