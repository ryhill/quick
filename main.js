// npm packages
const {app, BrowserWindow, Menu, protocol, ipcMain,dialog} = require('electron');
const {autoUpdater} = require('electron-updater');
const log = require('electron-log');

// configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


const isOnline = require('is-online');
// console.log(await isOnline());


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  // mainWindow.loadURL(
  //   url.format({
  //     pathname: path.join(__dirname, 'index.html'),
  //     protocol: 'file:',
  //     slashes: true,
  //   })
  // );

  (async () => {
    console.log(await isOnline());
    if(await isOnline()){
  
      mainWindow.loadFile('index.html')
    }else{
  
      mainWindow.loadFile('no_connection.html')
    }
    //=> true
  })();





  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // trigger autoupdate check
  
}

app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify();
});




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

//-------------------------------------------------------------------
// Auto updates
//-------------------------------------------------------------------
const sendStatusToWindow = (text) => {
  log.info(text);
  if (mainWindow) {
    mainWindow.webContents.send('message', text);
  }
};

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', info => {
  sendStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', info => {
  sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', err => {
  sendStatusToWindow(`Error in auto-updater: ${err.toString()}`);
});
autoUpdater.on('download-progress', progressObj => {
  sendStatusToWindow(
    `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total} + )`
  );
});

autoUpdater.on('update-downloaded', info => {
  sendStatusToWindow('Update downloaded; will install now');
});


// autoUpdater.on(
//   'update-downloaded',
//   (event, releaseNotes, releaseName) => {
//     console.log('Update downloaded')
//     dialog.showMessageBox({
//       type: 'question',
//       buttons: ['Update', 'Cancel'],
//       defaultId: 0,
//       message: `Version ${releaseName} is available, do you want to install it now?`,
//       title: 'Update available'
//     }, response => {
//       if (response === 0) {
//         electron.autoUpdater.quitAndInstall()
//       }
//     })
//   }
// )




autoUpdater.on('update-downloaded', info => {
  sendStatusToWindow('Update downloaded; will install now');
});

// autoUpdater.on('update-downloaded', info => {
//   setTimeout(() => {
//     autoUpdater.quitAndInstall();
//   }, 3500);
// });