import { contextBridge, ipcRenderer } from 'electron'

// 窗口控制 API
const windowAPI = {
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  // 监听窗口最大化状态变化
  onMaximizeChange: (callback: (isMaximized: boolean) => void) => {
    ipcRenderer.on('window:maximize-change', (_, isMaximized) => callback(isMaximized))
  },
  removeMaximizeListener: () => {
    ipcRenderer.removeAllListeners('window:maximize-change')
  },
} as const

// 应用信息 API
const appAPI = {
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
} as const

// 系统功能 API
const shellAPI = {
  openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url),
} as const

// 存储加密 API（用于敏感数据）
const storageAPI = {
  encrypt: (data: string) => ipcRenderer.invoke('storage:encrypt', data),
  decrypt: (encryptedData: string) => ipcRenderer.invoke('storage:decrypt', encryptedData),
} as const

// 日志 API
const logAPI = {
  info: (message: string) => ipcRenderer.send('log:write', 'info', message),
  warn: (message: string) => ipcRenderer.send('log:write', 'warn', message),
  error: (message: string) => ipcRenderer.send('log:write', 'error', message),
  debug: (message: string) => ipcRenderer.send('log:write', 'debug', message),
} as const

// 暴露 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  window: windowAPI,
  app: appAPI,
  shell: shellAPI,
  storage: storageAPI,
  log: logAPI,
} as const)

