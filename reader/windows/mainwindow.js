const electron = require("electron")
const { WindowManager } = require("../window_manager");
const parser = require("node-html-parser");
const path = require("node:path");
const { Scraper } = require("anyscrape");
const { get_node_depthstring } = require("../utils/utils.js");

var ipc = electron.ipcMain;

/**
 * The main window UI
 *
 */
const mainWindow = () => {
    var window = new electron.BrowserWindow({
        width: 400,
        height: 650,
        nodeIntegration: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    });
    var debug = null;
    var raw_page_html = "";
    var raw_selected_html = null;

    async function test_scrape(config, url) {
        let scraper = new Scraper();
        await scraper.init();
        await scraper.load_config(config);
        let selected_elements = await scraper.scrape(url);
        window.webContents.send('test_result', selected_elements.join("\n"));
    }

    // delete window when closed
    window.on("closed", () => {
        WindowManager.windows.delete(window);
        window = null;
    });

    // on receiving the document's html
    ipc.on('page_html', (event, content) => {
        raw_page_html = content;
        parsed_page_html = parser.parse(raw_page_html);
    });

    ipc.on('test_content', (event, content, url) => {
        console.log("test started");
        test_scrape(content, url)
    });

    // on receiving the user-selected html
    ipc.on('selected_html', (event, content) => {
        let parsed_selected_html = parser.parse(content);
        console.log(parsed_selected_html.childNodes[0].getAttribute("class"));
        let tag_location = get_node_depthstring(parsed_page_html, parsed_selected_html);
        let tag_name = parsed_selected_html.childNodes[0].rawTagName === undefined ?
            "" : parsed_selected_html.childNodes[0].rawTagName;
        let attributes = parsed_selected_html.childNodes[0].rawAttrs;
        let tag_class = "";
        let tag_id = "";
        let tag_type = "";

        // Get argument types from attributes string
        if (attributes !== undefined) {
            let attr_segments = attributes.split("\"");
            let prefix = "";
            for (let index = 0; index + 1 < attr_segments.length; index++) {
                if (index > 0) {
                    prefix = " ";
                }
                if (attr_segments[index].includes(prefix + "class=")) {
                    tag_class = attr_segments[index + 1];
                }
                else if (attr_segments[index].includes(prefix + "id=")) {
                    tag_id = attr_segments[index + 1];
                }
                else if (attr_segments[index].includes(prefix + "type=")) {
                    tag_type = attr_segments[index + 1];
                }
                index++;
            }
        }

        let tag_data = {
            tag_html: content,
            tag_name: tag_name,
            tag_class: tag_class,
            tag_id: tag_id,
            tag_type: tag_type,
            tag_location: tag_location,
        }

        // send tag data to renderer
        window.webContents.send('element_data', tag_data);
    });


    WindowManager.windows.add(window);
    window.loadFile("./html/anyscrape_reader.html");
    // window.webContents.toggleDevTools();
}
module.exports = { mainWindow }
