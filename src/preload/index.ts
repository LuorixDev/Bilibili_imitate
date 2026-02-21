import { contextBridge } from 'electron'

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// @see https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// Define a securely exposed API for the renderer process
const electronAPI = {
  // We can define necessary functions here that the renderer process can invoke
  // For example:
  // getAppName: () => ipcRenderer.invoke('get-app-name'),
}

// Expose the defined API to the renderer process
// This makes `window.electronAPI` available in the renderer, but ONLY with the functions defined above.
contextBridge.exposeInMainWorld('electronAPI', electronAPI)
