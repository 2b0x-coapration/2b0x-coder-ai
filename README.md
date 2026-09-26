# 2B0X Coder Desktop (Unofficial)

An open-source Electron desktop wrapper for [2B0X Coder](https://app-eoi646r6nls1.appmedo.com/),
a browser-based AI coding assistant. This app loads the live site in a native
window — it does not bundle or modify the site's frontend, database, or APIs,
so everything stays connected to the real backend exactly as it works in a browser.

## Features
- Native desktop window, icon, and menu (Linux `.deb` package)
- External links open in your default browser instead of inside the app
- Simple offline/retry screen if the connection drops
- Reload, force-reload, zoom, and DevTools shortcuts via the View menu

## Requirements to build
- [Node.js](https://nodejs.org/) 18 or newer
- npm (comes with Node.js)

This repo does **not** include `node_modules` or the built `.deb` — those are
generated on your machine so the GitHub repo stays small. Building requires an
internet connection so npm can download Electron itself (~200 MB).

## Run in development
```bash
npm install
npm start
```

## Build the .deb package
```bash
npm install
npm run dist
```
The finished installer will be at `release/2b0x-coder-desktop_1.0.0_amd64.deb`.

Install it with:
```bash
sudo dpkg -i release/2b0x-coder-desktop_1.0.0_amd64.deb
```
(If it complains about missing dependencies, run `sudo apt --fix-broken install` afterward.)

## Build an AppImage instead (no install needed)
```bash
npm run dist:appimage
```

## Project structure
```
main.js         Electron main process (window, menu, external-link handling)
preload.js      Minimal preload script (contextIsolation stays on)
offline.html    Shown if the app can't reach the site
build/icon.png  App icon (512x512)
package.json    App metadata + electron-builder config for the .deb target
```

## Notes
- To point this at a different URL later, change `APP_URL` at the top of `main.js`.
- This is an unofficial wrapper, not affiliated with the 2B0X Coder team.
