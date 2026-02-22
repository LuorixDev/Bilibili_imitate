import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getAppInfo: () => ipcRenderer.invoke('app:getInfo'),
  openExternal: (url: string) => ipcRenderer.invoke('app:openExternal', url),
  windowMinimize: () => ipcRenderer.invoke('window:minimize'),
  windowToggleMaximize: () => ipcRenderer.invoke('window:toggleMaximize'),
  windowIsMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  windowClose: () => ipcRenderer.invoke('window:close'),
  openVideoWindow: (id: string) => ipcRenderer.invoke('window:openVideo', id),
  openLiveWindow: (id: string) => ipcRenderer.invoke('window:openLive', id),
});
