const { contextBridge, ipcRenderer } = require("electron")
const { webFrame } = require("electron")

webFrame.setZoomFactor(1);

contextBridge.exposeInMainWorld('electronAPI', {
    openManual: () => ipcRenderer.send('open_manual'),
    // send search url
    sendSearchURLToMain: (url) => ipcRenderer.send('search_url', url),
    // get html from webpage
    sendPageHTMLToMain: (content) => ipcRenderer.send('page_html', content),
    // get selected html
    sendSelectedHTMLToMain: (content) => ipcRenderer.send('selected_html', content),
    // handle element data in json
    sendElementDataToRenderer: (callback) => ipcRenderer.on('element_data', callback),
    // handle cookie data in json
    sendCookieDataToMain: (cookies) => ipcRenderer.send('cookie_data', cookies),
    // handle cookie data in json
    sendCookieDataToRenderer: (callback) => ipcRenderer.on('cookie_data', callback),
    // send scrape test request to main process
    sendTestContentToMain: (content, url) => ipcRenderer.send('test_content', content, url),
    // handle scrape test result
    sendTestResultToRenderer: (callback) => ipcRenderer.on('test_result', callback),
});
