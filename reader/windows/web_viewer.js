const electron = require("electron");
const electronLocalshortcut = require("electron-localshortcut");
const path = require("node:path");
const { WindowManager } = require("../window_manager");
const { menu_template } = require("../constants/menu_template");
const { get_domain_name } = require("../utils/utils");

var ipc = electron.ipcMain;

/**
 * The web viewer UI
 *
 */
const webViewer = (url) => {
    var current_url = "";
    var current_domain_name = "";
    if (WindowManager.web_viewer_window !== null) {
        if (url !== undefined) {
            WindowManager.web_viewer_window.loadURL(url);
            current_url = url;
            current_domain_name = get_domain_name(current_url);
        } else {
            WindowManager.web_viewer_window.loadFile("./html/manual.html");
            current_url = "";
            current_domain_name = "";
        }
        return;
    }
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

    async function get_selected_html(x, y) {
        await reattach_debugger();
        await window.webContents.executeJavaScript("document.documentElement.scrollTop");
        let scrollTop = await window.webContents.executeJavaScript("document.documentElement.scrollTop");
        let backend_node = await debug.sendCommand("DOM.getNodeForLocation", { x: x, y: y + Math.floor(scrollTop) });
        let backend_node_id = backend_node.backendNodeId;
        let resolved_node = await debug.sendCommand("DOM.resolveNode", { backendNodeId: backend_node_id });
        let html = await debug.sendCommand("DOM.getOuterHTML", { backendNodeId: backend_node_id });
        send_page_html();
        window.webContents.executeJavaScript("window.electronAPI.sendSelectedHTMLToMain(\`" + html.outerHTML + "\`);")
            .catch(function (e) {
                console.log("Test error", e);
            });
    }

    function send_page_html() {
        window.webContents.executeJavaScript("window.electronAPI.sendPageHTMLToMain(document.body.innerHTML);")
            .catch(function (e) {
                console.log("HTML Read error", e);
            });
    }

    // disable open new window
    window.webContents.setWindowOpenHandler(() => {
        return { action: "deny" };
    });
    // delete window when closed
    window.on("closed", () => {
        WindowManager.web_viewer_window = null;
        window = null;
    });

    // shortcut to select html element
    electronLocalshortcut.register(window, 'F12', () => {
        window.webContents.session.cookies.get({})
        .then((cookies) => {
            window.webContents.executeJavaScript(`window.electronAPI.sendCookieDataToMain(${JSON.stringify(cookies)});`);
        });
        let mouse_position = electron.screen.getCursorScreenPoint();
        let bounds = window.getContentBounds();
        let x = mouse_position.x - bounds.x;
        let y = mouse_position.y - bounds.y;
        get_selected_html(x, y)
            .catch(function (e) {
                console.log("Promise Rejected: ", e);
            });
    });

    electron.Menu.setApplicationMenu(menu);
    if (url !== undefined) {
        window.loadURL(url);
        current_url = url;
        current_domain_name = get_domain_name(current_url);
    } else {
        window.loadFile("./html/manual.html");
        current_url = "";
        current_domain_name = "";
    }
    window.webContents.session.clearStorageData();
    WindowManager.web_viewer_window = window;
    window.webContents.toggleDevTools();
}


module.exports = { webViewer }