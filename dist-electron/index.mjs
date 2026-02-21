"use strict";
const electron = require("electron");
const electronAPI = {
  // We can define necessary functions here that the renderer process can invoke
  // For example:
  // getAppName: () => ipcRenderer.invoke('get-app-name'),
};
electron.contextBridge.exposeInMainWorld("electronAPI", electronAPI);
