const electron = require('electron')
const { WindowManager } = require('../window_manager');
const parser = require('node-html-parser');
const path = require('node:path');

var ipc = electron.ipcMain;

const elementRecorderWindow = () => {
    var window = new electron.BrowserWindow({
        width: 400,
        height: 600,
        nodeIntegration: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    });
    var debug = null;
    var raw_html = "";
    var parsed_html = null;

    window.on("closed", () => {
        WindowManager.windows.delete(window);
        window = null;
    });
    WindowManager.windows.add(window);
    window.loadFile("./html/element_recorder.html");
    // window.webContents.toggleDevTools();

    ipc.on('page-html', (event, content) => {
        raw_html = content;
        parsed_html = parser.parse(raw_html);
        console.log(parsed_html);
    });
    ipc.on('selected-html', (event, content) => {
        let parsed_content = parser.parse(content);
        let tag_name = parsed_content.childNodes[0].rawTagName;
        let attributes = parsed_content.childNodes[0].rawAttrs;
        let tag_class = "";
        let tag_id = "";
        let tag_type = "";

        let attr_segments = attributes.split("\"");
        for (let index = 0; index + 1 < attr_segments.length; index++) {
            if (attr_segments[index].includes("class")) {
                tag_class = attr_segments[index + 1];
            }
            else if (attr_segments[index].includes("id")) {
                tag_id = attr_segments[index + 1];
            }
            else if (attr_segments[index].includes("type")) {
                tag_type = attr_segments[index + 1];
            }
            index++;
        }

        let tag_data = {
            tag_html: content,
            tag_name: tag_name,
            tag_class: tag_class,
            tag_id: tag_id,
            tag_type: tag_type
        }
        
        window.webContents.send('element_data', tag_data);
    });
    
}
module.exports = { elementRecorderWindow }
