import { app, BrowserWindow, ipcMain, shell, screen } from 'electron'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// 保持窗口对象的全局引用，防止垃圾回收
let mainWindow: BrowserWindow | null = null

// 窗口配置
const WINDOW_CONFIG: Electron.BrowserWindowConstructorOptions = {
  minWidth: 1200,
  minHeight: 800,
  width: 1400,
  height: 900,
  title: 'Bilibili Desktop',
  icon: join(__dirname, '../public/icon.png'),
  webPreferences: {
    preload: join(__dirname, 'preload.js'),
    contextIsolation: true, // 启用上下文隔离
    nodeIntegration: false, // 禁用 Node 集成（安全）
    webSecurity: true,
    allowRunningInsecureContent: false,
    sandbox: false,
  },
  show: false, // 先隐藏，加载完成后再显示
  backgroundColor: '#1a1a1a',
  titleBarStyle: 'hidden', // macOS 隐藏标题栏
  frame: process.platform !== 'win32', // Windows 使用自定义标题栏
}

function createWindow(): void {
  // 获取屏幕尺寸，让窗口居中
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize
  
  const windowWidth = Math.min(WINDOW_CONFIG.width ?? 1400, screenWidth - 100)
  const windowHeight = Math.min(WINDOW_CONFIG.height ?? 900, screenHeight - 100)
  
  mainWindow = new BrowserWindow({
    ...WINDOW_CONFIG,
    width: windowWidth,
    height: windowHeight,
    x: Math.round((screenWidth - windowWidth) / 2),
    y: Math.round((screenHeight - windowHeight) / 2),
  })

  // 加载应用
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    // 开发环境打开开发者工具
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  // 窗口加载完成后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })

  // 处理窗口关闭
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 拦截新窗口打开，使用系统浏览器
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // 处理导航，外部链接用系统浏览器打开
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url !== mainWindow?.webContents.getURL()) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })
}

// 应用生命周期管理
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // macOS 点击 dock 图标时重新创建窗口
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  // macOS 通常不会退出应用
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC 通信处理
// 窗口控制
ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize()
})

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.handle('window:close', () => {
  mainWindow?.close()
})

ipcMain.handle('window:isMaximized', () => {
  return mainWindow?.isMaximized() ?? false
})

// 应用信息
ipcMain.handle('app:getVersion', () => {
  return app.getVersion()
})

ipcMain.handle('app:getPlatform', () => {
  return process.platform
})

// 系统功能
ipcMain.handle('shell:openExternal', async (_, url: string) => {
  await shell.openExternal(url)
})

// 存储管理（使用 Electron 的 safeStorage 加密敏感数据）
ipcMain.handle('storage:encrypt', async (_, data: string) => {
  const { safeStorage } = await import('electron')
  if (safeStorage.isEncryptionAvailable()) {
    return safeStorage.encryptString(data).toString('base64')
  }
  return data
})

ipcMain.handle('storage:decrypt', async (_, encryptedData: string) => {
  const { safeStorage } = await import('electron')
  if (safeStorage.isEncryptionAvailable()) {
    return safeStorage.decryptString(Buffer.from(encryptedData, 'base64'))
  }
  return encryptedData
})

// 日志记录
ipcMain.on('log:write', (_, level: string, message: string) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`)
})

// 防止多开
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // 当尝试运行第二个实例时，聚焦到第一个实例的窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}
