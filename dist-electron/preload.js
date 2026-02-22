"use strict";

// src/preload/index.ts
var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("electronAPI", {
  getAppInfo: () => import_electron.ipcRenderer.invoke("app:getInfo"),
  openExternal: (url) => import_electron.ipcRenderer.invoke("app:openExternal", url),
  windowMinimize: () => import_electron.ipcRenderer.invoke("window:minimize"),
  windowToggleMaximize: () => import_electron.ipcRenderer.invoke("window:toggleMaximize"),
  windowIsMaximized: () => import_electron.ipcRenderer.invoke("window:isMaximized"),
  windowClose: () => import_electron.ipcRenderer.invoke("window:close"),
  openVideoWindow: (id) => import_electron.ipcRenderer.invoke("window:openVideo", id),
  openLiveWindow: (id) => import_electron.ipcRenderer.invoke("window:openLive", id)
});
//# sourceMappingURL=preload.js.map
