const { contextBridge, ipcRenderer } = require("electron")
const { webFrame } = require("electron")

webFrame.setZoomFactor(1);

contextBridge.exposeInMainWorld('electronAPI', {
    openManual: () => ipcRenderer.send('open_manual'),
    // send search url
    searchURL: (url) => ipcRenderer.send('search_url', url),
    // get html from webpage
    sendPageHTML: (content) => ipcRenderer.send('page_html', content),
    // get selected html
    sendSelectedHTML: (content) => ipcRenderer.send('selected_html', content),
    // handle element data in json
    handleElementData: (callback) => ipcRenderer.on('element_data', callback),
    // send scrape test request to main process
    sendTestContent: (content, url) => ipcRenderer.send('test_content', content, url),
    // handle scrape test result
    handleTestResult: (callback) => ipcRenderer.on('test_result', callback),
});
