const { app, BrowserWindow, Menu, shell, session, globalShortcut } = require('electron');
const path = require('path');

const APP_URL = 'https://app-eoi646r6nls1.appmedo.com/';
const APP_NAME = '2B0X Coder';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: APP_NAME,
    icon: path.join(__dirname, 'build', 'icon.png'),
    backgroundColor: '#0b0d12',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: true
    }
  });

  mainWindow.loadURL(APP_URL);

  // Open any link that points away from the app's own domain in the
  // system's default browser instead of inside the app window.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isExternal(url)) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (isExternal(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // Show a simple offline/retry page if the app can't be reached.
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    if (errorCode === -3) return; // ignore aborted loads (e.g. redirects)
    mainWindow.loadFile(path.join(__dirname, 'offline.html'));
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle(APP_NAME);
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

function isExternal(url) {
  try {
    const target = new URL(url);
    const home = new URL(APP_URL);
    return target.host !== home.host;
  } catch (e) {
    return true;
  }
}

function buildMenu() {
  const template = [
    {
      label: APP_NAME,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' }, { role: 'redo' }, { type: 'separator' },
        { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow.loadURL(APP_URL)
        },
        {
          label: 'Force Reload',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => { mainWindow.webContents.reloadIgnoringCache(); }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => mainWindow.webContents.toggleDevTools()
        },
        { type: 'separator' },
        { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [{ role: 'minimize' }, { role: 'close' }]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  buildMenu();
  createWindow();

  // Alt key temporarily reveals the menu bar even though it's auto-hidden.
  mainWindow.on('focus', () => {
    globalShortcut.register('Alt', () => {
      mainWindow.setMenuBarVisibility(!mainWindow.isMenuBarVisible());
    });
  });
  mainWindow.on('blur', () => {
    globalShortcut.unregister('Alt');
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
