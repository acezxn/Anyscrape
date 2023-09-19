const electron = require('electron');
const { mainWindow } = require('./windows/mainwindow');

electron.app.whenReady().then(() => {
    mainWindow();
});