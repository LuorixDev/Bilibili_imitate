export {};

declare global {
  interface ElectronAPI {
    getAppInfo: () => Promise<{ version: string; platform: string }>;
    openExternal: (url: string) => Promise<{ ok: boolean }>;
    windowMinimize: () => Promise<void>;
    windowToggleMaximize: () => Promise<boolean>;
    windowIsMaximized: () => Promise<boolean>;
    windowClose: () => Promise<void>;
    openVideoWindow: (id: string) => Promise<void>;
    openLiveWindow: (id: string) => Promise<void>;
  }

  interface Window {
    electronAPI?: ElectronAPI;
  }
}
