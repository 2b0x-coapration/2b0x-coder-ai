// Intentionally minimal. contextIsolation is on and nodeIntegration is off,
// so the page loaded from app-eoi646r6nls1.appmedo.com has no access to
// Node.js or Electron internals. Add contextBridge.exposeInMainWorld(...)
// calls here only if the app later needs to talk to native desktop APIs.
