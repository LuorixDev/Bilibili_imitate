import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'node:path';

const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);

let mainWindow: BrowserWindow | null = null;
const videoWindows = new Map<string, BrowserWindow>();
const liveWindows = new Map<string, BrowserWindow>();

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: '#ffffff',
    frame: false,
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    const indexHtml = path.join(__dirname, '../dist/index.html');
    mainWindow.loadFile(indexHtml);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('app:getInfo', () => {
  return {
    version: app.getVersion(),
    platform: process.platform,
  };
});

ipcMain.handle('app:openExternal', async (_event, url: string) => {
  if (typeof url !== 'string' || !url.startsWith('http')) {
    return { ok: false };
  }
  await shell.openExternal(url);
  return { ok: true };
});

ipcMain.handle('window:minimize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win?.minimize();
});

ipcMain.handle('window:toggleMaximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return false;
  if (win.isMaximized()) {
    win.unmaximize();
    return false;
  }
  win.maximize();
  return true;
});

ipcMain.handle('window:isMaximized', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return win?.isMaximized() ?? false;
});

ipcMain.handle('window:close', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win?.close();
});

const openContentWindow = (
  id: string,
  targetMap: Map<string, BrowserWindow>,
  route: string,
  background = '#000000',
) => {
  if (!id) return;
  const existing = targetMap.get(id);
  if (existing && !existing.isDestroyed()) {
    existing.focus();
    return;
  }
  const win = new BrowserWindow({
    width: 1200,
    height: 760,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: background,
    frame: false,
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(`${process.env.VITE_DEV_SERVER_URL}/#/${route}/${id}`);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    const indexHtml = path.join(__dirname, '../dist/index.html');
    win.loadFile(indexHtml, { hash: `/${route}/${id}` });
  }

  win.on('closed', () => {
    targetMap.delete(id);
  });

  targetMap.set(id, win);
};

const createVideoWindow = (videoId: string) => {
  openContentWindow(videoId, videoWindows, 'video', '#000000');
};

const createLiveWindow = (liveId: string) => {
  openContentWindow(liveId, liveWindows, 'live');
};

ipcMain.handle('window:openVideo', (_event, videoId: string) => {
  createVideoWindow(videoId);
});

ipcMain.handle('window:openLive', (_event, liveId: string) => {
  createLiveWindow(liveId);
});
