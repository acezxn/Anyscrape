const { contextBridge, ipcRenderer } = require('electron')
const { webFrame } = require('electron')

webFrame.setZoomFactor(1);

contextBridge.exposeInMainWorld('electronAPI', {
    // get html from webpage
    sendPageHTML: (content) => ipcRenderer.send('page-html', content),
    sendSelectedHTML: (content) => ipcRenderer.send('selected-html', content),
    handleElementData: (callback) => ipcRenderer.on('element_data', callback)
});
