const electron = require('electron');
const electronLocalshortcut = require('electron-localshortcut');
const path = require('node:path');
const { WindowManager } = require('../window_manager');
const { menu_template } = require("../constants/menu_template")

const mainWindow = () => {
    var menu = electron.Menu.buildFromTemplate([
        menu_template
    ]);

    var window = new electron.BrowserWindow({
        width: 1200,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        nodeIntegration: true
    });

    var debug = null;

    async function reattach_debugger() {
        if (debug !== null) {
            debug.detach();
            debug = null;
        }
        debug = window.webContents.debugger;
        debug.attach();
    }

    async function dev_tools_func(x, y) {
        await reattach_debugger();
        await window.webContents.executeJavaScript("document.documentElement.scrollTop");
        let scrollTop = await window.webContents.executeJavaScript("document.documentElement.scrollTop");
        let backend_node = await debug.sendCommand("DOM.getNodeForLocation", { x: x, y: y + Math.floor(scrollTop) });
        let backend_node_id = backend_node.backendNodeId;
        let resolved_node = await debug.sendCommand("DOM.resolveNode", { backendNodeId: backend_node_id });
        let html = await debug.sendCommand("DOM.getOuterHTML", { backendNodeId: backend_node_id });

        window.webContents.executeJavaScript("window.electronAPI.sendSelectedHTML(\`" + html.outerHTML + "\`);")
            .catch(function (e) {
                console.log("Test error", e);
            });
    }

    function send_page_html() {
        window.webContents.executeJavaScript("window.electronAPI.sendPageHTML(document.body.innerHTML);")
            .catch(function (e) {
                console.log("HTML Read error", e);
            });
    }

    electronLocalshortcut.register(window, 'F12', () => {
        let mouse_position = electron.screen.getCursorScreenPoint();
        let bounds = window.getContentBounds();
        let x = mouse_position.x - bounds.x;
        let y = mouse_position.y - bounds.y;
        dev_tools_func(x, y)
            .catch(function (e) {
                console.log("Promise Rejected: ", e);
            });
    });

    window.webContents.on('did-stop-loading', (e) => {
        send_page_html();
    });
    
    window.webContents.setWindowOpenHandler(() => {
        return { action: "deny" };
    });

    electron.Menu.setApplicationMenu(menu);
    // window.loadURL('https://www.facebook.com/profile.php?id=100029072525833');
    window.loadURL('https://acezxn.github.io/Pathtracker-online/#/about');
    // window.loadFile("test.html");

    // window.webContents.toggleDevTools();
    window.on("closed", () => {
        WindowManager.windows.delete(window);
        window = null;
    });
    WindowManager.windows.add(window);
}


module.exports = { mainWindow }