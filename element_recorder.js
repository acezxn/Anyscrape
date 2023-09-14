const electron = require('electron')
const { WindowManager } = require('./window_manager');
const parser = require('node-html-parser');
var ipc = electron.ipcMain;

const elementRecorderWindow = () => {
    var window = new electron.BrowserWindow({
        width: 800,
        height: 600,
        nodeIntegration: true
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
}

ipc.on('html-response', (event, content) => {
    raw_html = content;
    parsed_html = parser.parse(raw_html);
    console.log(parsed_html);
});

module.exports = { elementRecorderWindow }
