/// <reference types="vite/client" />

// Define the shape of the API exposed by the preload script
export interface IElectronAPI {
  // Currently empty, but we can add function signatures here
  // e.g., getAppName: () => Promise<string>
}

// Extend the global Window interface
declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
