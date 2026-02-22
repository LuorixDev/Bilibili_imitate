// 全局类型声明

declare module 'lucide-vue-next' {
  import type { DefineComponent } from 'vue'
  
  export const PlayIcon: DefineComponent<{}, {}, any>
  export const PauseIcon: DefineComponent<{}, {}, any>
  export const PlayCircleIcon: DefineComponent<{}, {}, any>
  export const UserIcon: DefineComponent<{}, {}, any>
  export const MessageSquareIcon: DefineComponent<{}, {}, any>
  export const ClockIcon: DefineComponent<{}, {}, any>
  export const ThumbsUpIcon: DefineComponent<{}, {}, any>
  export const StarIcon: DefineComponent<{}, {}, any>
  export const CoinsIcon: DefineComponent<{}, {}, any>
  export const Share2Icon: DefineComponent<{}, {}, any>
  export const Volume2Icon: DefineComponent<{}, {}, any>
  export const VolumeXIcon: DefineComponent<{}, {}, any>
  export const MaximizeIcon: DefineComponent<{}, {}, any>
  export const MinimizeIcon: DefineComponent<{}, {}, any>
}

// Electron API 声明
declare global {
  interface Window {
    electronAPI?: {
      window: {
        minimize: () => Promise<void>
        maximize: () => Promise<void>
        close: () => Promise<void>
        isMaximized: () => Promise<boolean>
        onMaximizeChange: (callback: (isMaximized: boolean) => void) => void
        removeMaximizeListener: () => void
      }
      app: {
        getVersion: () => Promise<string>
        getPlatform: () => Promise<string>
      }
      shell: {
        openExternal: (url: string) => Promise<void>
      }
      storage: {
        encrypt: (data: string) => Promise<string>
        decrypt: (encryptedData: string) => Promise<string>
        setItem: (key: string, value: string) => Promise<void>
        getItem: (key: string) => Promise<string | null>
        removeItem: (key: string) => Promise<void>
      }
      log: {
        info: (message: string) => void
        warn: (message: string) => void
        error: (message: string) => void
        debug: (message: string) => void
      }
    }
  }
}

export {}