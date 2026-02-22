import { contextBridge, ipcRenderer } from "electron";
const windowAPI = {
  minimize: () => ipcRenderer.invoke("window:minimize"),
  maximize: () => ipcRenderer.invoke("window:maximize"),
  close: () => ipcRenderer.invoke("window:close"),
  isMaximized: () => ipcRenderer.invoke("window:isMaximized"),
  // 监听窗口最大化状态变化
  onMaximizeChange: (callback) => {
    ipcRenderer.on("window:maximize-change", (_, isMaximized) => callback(isMaximized));
  },
  removeMaximizeListener: () => {
    ipcRenderer.removeAllListeners("window:maximize-change");
  }
};
const appAPI = {
  getVersion: () => ipcRenderer.invoke("app:getVersion"),
  getPlatform: () => ipcRenderer.invoke("app:getPlatform")
};
const shellAPI = {
  openExternal: (url) => ipcRenderer.invoke("shell:openExternal", url)
};
const storageAPI = {
  encrypt: (data) => ipcRenderer.invoke("storage:encrypt", data),
  decrypt: (encryptedData) => ipcRenderer.invoke("storage:decrypt", encryptedData)
};
const logAPI = {
  info: (message) => ipcRenderer.send("log:write", "info", message),
  warn: (message) => ipcRenderer.send("log:write", "warn", message),
  error: (message) => ipcRenderer.send("log:write", "error", message),
  debug: (message) => ipcRenderer.send("log:write", "debug", message)
};
contextBridge.exposeInMainWorld("electronAPI", {
  window: windowAPI,
  app: appAPI,
  shell: shellAPI,
  storage: storageAPI,
  log: logAPI
});
//# sourceMappingURL=preload.js.map
