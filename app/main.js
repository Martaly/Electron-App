const { app, BrowserWindow } = require('electron');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    minWidth:500,
    minHeight:300,
  });

  mainWindow.webContents.loadURL(`file://${__dirname}/index.html`)
});

