import { app, BrowserWindow, ipcMain, globalShortcut, screen } from 'electron';
import path from 'path';

let mainWindow;
let examWindow;
let authData = {};

app.on('ready', () => {
  const { width, height } = screen.getPrimaryDisplay().bounds;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      preload: path.join(process.cwd(), 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
    },
  });

  mainWindow.maximize();
  
  const startUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/auth/signin'
    : `file://${path.join(process.cwd(), 'dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Disable right-click and copy/paste
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(`
      document.addEventListener('contextmenu', (e) => e.preventDefault());
      document.addEventListener('copy', (e) => e.preventDefault());
      document.addEventListener('paste', (e) => e.preventDefault());
    `);
  });

  mainWindow.on('resize', () => {
    const { width, height } = screen.getPrimaryDisplay().bounds;
    mainWindow.setSize(width, height);
  });
});

// Handle Exam Window
ipcMain.on('start-exam', (event, examUrl) => {
  if (examWindow) {
    examWindow.focus();
    return;
  }

  const { width, height } = screen.getPrimaryDisplay().bounds;

  examWindow = new BrowserWindow({
    width,
    height,
    fullscreen: true,
    kiosk: true,
    autoHideMenuBar: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(process.cwd(), 'preload.js'),
      contextIsolation: true,
      webSecurity: true,
    },
  });

  examWindow.maximize();
  examWindow.setFullScreen(true);
  
  // Pass token and email as query parameters if they exist
  if (store.token && store.email) {
    const separator = examUrl.includes('?') ? '&' : '?';
    examUrl = `${examUrl}${separator}token=${encodeURIComponent(store.token)}&email=${encodeURIComponent(store.email)}`;
    alert("Exam url:",examUrl.value)
  }
  
  examWindow.loadURL(examUrl);

  // Disable shortcuts
  globalShortcut.register('Alt+Tab', () => {});
  globalShortcut.register('Ctrl+Tab', () => {});
  globalShortcut.register('Ctrl+W', () => {});
  globalShortcut.register('F11', () => {});

  examWindow.on('closed', () => {
    examWindow = null;
    globalShortcut.unregisterAll();
  });
});
ipcMain.on('save-auth', (event, { token, email }) => {
  authData.token = token;
  authData.email = email;
});

// Retrieve stored auth data
ipcMain.handle('get-auth', () => authData);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) app.emit('ready');
});