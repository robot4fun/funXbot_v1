const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const cp = require('child_process');
const {autoUpdater} = require("electron-updater");
const isDev = require('electron-is-dev');
const os = require('os');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let splash;
let win;

let mainFrameLoaded = false;
let forceQuit = false;
let initFile = null;

function randomInt(minInclusive, maxInclusive) {
    if (minInclusive > maxInclusive) {
        const tmp = minInclusive;
        minInclusive = maxInclusive;
        maxInclusive = tmp;
    }
    return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
}

//app.commandLine.appendSwitch('ignore-gpu-blacklist', 'true');
//app.commandLine.appendSwitch('enable-zero-copy', 'true');
//app.commandLine.appendSwitch('disable-software-rasterizer', 'false');
//app.commandLine.appendSwitch('enable-native-gpu-memory-buffers', 'true');
    
autoUpdater.autoDownload = false;
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  console.log('Update available.');
  win.webContents.send('updatevalid', info.version);
})
autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available.');
})
autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater.');
})
autoUpdater.on('download-progress', (progressObj) => {
  win.webContents.send('updateprogress', progressObj.percent);
})
autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded');
  setTimeout(function() {
    forceQuit = true;
    autoUpdater.quitAndInstall();  
  }, 3000)
});

let closeWd = false;

ipcMain.on('update', (event, msg) => {
    if(msg == 'downloadupdate'){
        autoUpdater.downloadUpdate();
    }else if(msg == 'quitandinstall'){
        autoUpdater.quitAndInstall();
    }
});

ipcMain.on('quitapp', (event, msg) => {
    app.exit(0);
});
ipcMain.on('savecookie', (event, sessionStr) => {
    const cookie = JSON.parse(sessionStr);
    win.webContents.session.cookies.set(cookie, err => {
        console.log("cookie set", err);
    })
});
ipcMain.on('removecookie', (event) => {
    win.webContents.session.cookies.remove('http://kittenbot.cn', 'connect.sid', err => {
        console.log("cookie remove", err);
    })
});
ipcMain.on('restartapp', (event) => {
    app.relaunch();
    app.exit(0)
});
ipcMain.on('close-wd', (event) => {
    closeWd = false;
});

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit() // quit on second instance
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (commandLine.length > 1){
            win.webContents.send('opensb3', commandLine[1]);
        }
        if (win) {
          if (win.isMinimized()) win.restore()
          win.focus()
        }
    });

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    //app.on('ready', createWindow);
    app.whenReady().then(() => {
      createWindow()
      
      /*app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })*/
    });
}


function sendStartConfig(){
    const startConfig = {
    };
    win.webContents.send("start", startConfig);
}

function createWindow () {
  console.log("cwd", app.getAppPath());
  splash = new BrowserWindow({
      width: 726,
      height: 360,
      resizable: false,
      backgroundColor: '#000',
      frame: false
  })
  splash.loadURL(url.format({
    pathname: path.join(__dirname, 'loading.html'),
    protocol: 'file:',
    slashes: true
  }))
  
  // Create the browser window.
  win = new BrowserWindow({
      width: 1400,
      height: 775,
      minWidth: 1200,
      minHeight: 775,
      backgroundColor: '#31C7D5',
      show: false
  })

  // and load the index.html of the app.
  let indexPath = isDev ? "E:\\KittenblockV3\\scratch-gui\\build\\index.html" : path.join(__dirname, 'index.html');
  console.log("index path", indexPath);
  
  // powerSaveBlocker.start('prevent-app-suspension'); // will trig rod?
  
  win.loadURL(url.format({
    pathname: indexPath,
    protocol: 'file:',
    slashes: true
  }))
 
  win.setMenu(null);
  
  win.webContents.on("did-stop-loading", () => {
    if(!mainFrameLoaded){ // fix for frame switching
        sendStartConfig();
        if (isDev) {
            win.webContents.openDevTools({ mode: "detach" });
        }
        mainFrameLoaded = true;
    if (initFile){
      win.webContents.send('opensb3', initFile);
    }
    }
  });
  
  win.once('ready-to-show', () => {
    win.show()
    splash.close();
    if(!isDev){
      //autoUpdater.checkForUpdates();
    }
  });

  win.on('close', function(e){
    console.log("close notify");
    closeWd = true;
    e.preventDefault();
    win.webContents.send('closeapp', '');
    setTimeout(() => {
        if (closeWd) app.exit(0);
    }, 2000);
  });

  // Emitted when the window is closed
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
  
  
}

app.on('will-finish-launching', ()=>{
  app.on('open-file', (event, path)=>{
    event.preventDefault(); 
    initFile = path;
    if (win) {
      win.webContents.send('opensb3', path);
    }
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  
  //if (process.platform !== 'darwin') {
  app.quit()
  //}
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
