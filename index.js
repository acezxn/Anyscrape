const electron = require('electron')
const { mainWindow } = require("./mainwindow") 
const { elementRecorderWindow } = require('./element_recorder')

electron.app.whenReady().then(() => {
    // mainWindow();
    elementRecorderWindow();
})