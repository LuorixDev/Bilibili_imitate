"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/main/index.ts
var import_electron = require("electron");
var import_node_path = __toESM(require("node:path"));
var isDev = Boolean(process.env.VITE_DEV_SERVER_URL);
var mainWindow = null;
var videoWindows = /* @__PURE__ */ new Map();
var liveWindows = /* @__PURE__ */ new Map();
var createMainWindow = () => {
  mainWindow = new import_electron.BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#ffffff",
    frame: false,
    titleBarStyle: process.platform === "darwin" ? "hidden" : void 0,
    webPreferences: {
      preload: import_node_path.default.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });
  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    const indexHtml = import_node_path.default.join(__dirname, "../dist/index.html");
    mainWindow.loadFile(indexHtml);
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};
import_electron.app.whenReady().then(() => {
  createMainWindow();
  import_electron.app.on("activate", () => {
    if (import_electron.BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});
import_electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    import_electron.app.quit();
  }
});
import_electron.ipcMain.handle("app:getInfo", () => {
  return {
    version: import_electron.app.getVersion(),
    platform: process.platform
  };
});
import_electron.ipcMain.handle("app:openExternal", async (_event, url) => {
  if (typeof url !== "string" || !url.startsWith("http")) {
    return { ok: false };
  }
  await import_electron.shell.openExternal(url);
  return { ok: true };
});
import_electron.ipcMain.handle("window:minimize", (event) => {
  const win = import_electron.BrowserWindow.fromWebContents(event.sender);
  win?.minimize();
});
import_electron.ipcMain.handle("window:toggleMaximize", (event) => {
  const win = import_electron.BrowserWindow.fromWebContents(event.sender);
  if (!win) return false;
  if (win.isMaximized()) {
    win.unmaximize();
    return false;
  }
  win.maximize();
  return true;
});
import_electron.ipcMain.handle("window:isMaximized", (event) => {
  const win = import_electron.BrowserWindow.fromWebContents(event.sender);
  return win?.isMaximized() ?? false;
});
import_electron.ipcMain.handle("window:close", (event) => {
  const win = import_electron.BrowserWindow.fromWebContents(event.sender);
  win?.close();
});
var openContentWindow = (id, targetMap, route, background = "#000000") => {
  if (!id) return;
  const existing = targetMap.get(id);
  if (existing && !existing.isDestroyed()) {
    existing.focus();
    return;
  }
  const win = new import_electron.BrowserWindow({
    width: 1200,
    height: 760,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: background,
    frame: false,
    titleBarStyle: process.platform === "darwin" ? "hidden" : void 0,
    webPreferences: {
      preload: import_node_path.default.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });
  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(`${process.env.VITE_DEV_SERVER_URL}/#/${route}/${id}`);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    const indexHtml = import_node_path.default.join(__dirname, "../dist/index.html");
    win.loadFile(indexHtml, { hash: `/${route}/${id}` });
  }
  win.on("closed", () => {
    targetMap.delete(id);
  });
  targetMap.set(id, win);
};
var createVideoWindow = (videoId) => {
  openContentWindow(videoId, videoWindows, "video", "#000000");
};
var createLiveWindow = (liveId) => {
  openContentWindow(liveId, liveWindows, "live");
};
import_electron.ipcMain.handle("window:openVideo", (_event, videoId) => {
  createVideoWindow(videoId);
});
import_electron.ipcMain.handle("window:openLive", (_event, liveId) => {
  createLiveWindow(liveId);
});
//# sourceMappingURL=main.js.map
