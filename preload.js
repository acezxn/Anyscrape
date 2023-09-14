const { contextBridge, ipcRenderer } = require('electron')
const { webFrame } = require('electron')

webFrame.setZoomFactor(1);

contextBridge.exposeInMainWorld('electronAPI', {
    // get html from webpage
    sendHTML: (content) => ipcRenderer.send('html-response', content)
});