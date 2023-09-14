const electron = require('electron')
const { webViewer } = require("./windows/web_viewer") 
const { mainWindow } = require('./windows/mainwindow')

electron.app.whenReady().then(() => {
    webViewer();
    mainWindow();
})