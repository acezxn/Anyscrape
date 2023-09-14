const electron = require('electron')
const { mainWindow } = require("./windows/mainwindow") 
const { elementRecorderWindow } = require('./windows/element_recorder')

electron.app.whenReady().then(() => {
    mainWindow();
    elementRecorderWindow();
})