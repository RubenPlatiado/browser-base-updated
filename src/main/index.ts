import { ipcMain, app, webContents } from 'electron';
import { setIpcMain } from '@wexond/rpc-electron';
setIpcMain(ipcMain);

// Disable hardware acceleration
// if you wish to keep this enabled you can but if you wanna use hardware exel you can do so by just removing this line
// Reason being is because i added a bunch of optimizations but i keep it on because hardware acceleration dosent make the app run smooth.
app.disableHardwareAcceleration();

require('@electron/remote/main').initialize();

if (process.env.NODE_ENV === 'development') {
  require('source-map-support').install();
}

import { platform } from 'os';
import { Application } from './application';

export const isNightly = app.name === 'wexond-nightly';

app.allowRendererProcessReuse = true;
app.name = isNightly ? 'Wexond Nightly' : 'Wexond';

// the following code is flags to provide a different use of the app

// Including new Canvas2D APIs
app.commandLine.appendSwitch('new-canvas-2d-api');
// Enable local DOM to access all resources in a tree
app.commandLine.appendSwitch('enable-local-file-accesses');
// Enable QUIC for faster handshakes
app.commandLine.appendSwitch('enable-quic');
// Enable inspecting ALL layers
app.commandLine.appendSwitch('enable-ui-devtools');
// Force enable GPU acceleration
app.commandLine.appendSwitch('ignore-gpu-blocklist');
// Force enable GPU rasterization
app.commandLine.appendSwitch('enable-gpu-rasterization');
// Enable Zero Copy for GPU memory associated with Tiles
app.commandLine.appendSwitch('enable-zero-copy');
// Enable all WebGL Features
app.commandLine.appendSwitch('enable-webgl-draft-extensions');
// Transparent overlays for Wexond UI
app.commandLine.appendSwitch('enable-transparent-visuals');
// Enable background throttling
// app.commandLine.appendSwitch('disable-background-timer-throttling');
// Enable display compositing in the browser process
// app.commandLine.appendSwitch('enable-browser-side-compositing');
// Enable smooth scrolling
app.commandLine.appendSwitch('enable-smooth-scrolling');
// Enable experimental features to reduce memory usage
app.commandLine.appendSwitch('enable-experimental-web-platform-features');
// Enable fast tab/window close
app.commandLine.appendSwitch('fast-tab-windows-close');
// Enable tab discarding
app.commandLine.appendSwitch('enable-tab-discarding');
// Enable composited render layer borders
// app.commandLine.appendSwitch('show-composited-layer-borders');

// Optimize GPU performance
app.commandLine.appendSwitch('max-active-webgl-contexts', '16');
app.commandLine.appendSwitch('disable-blur-effect');

(process.env as any)['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

app.commandLine.appendSwitch('--enable-transparent-visuals');
app.commandLine.appendSwitch(
  'enable-features',
  'CSSColorSchemeUARendering, ImpulseScrollAnimations, ParallelDownloading',
);

if (process.env.NODE_ENV === 'development') {
  app.commandLine.appendSwitch('remote-debugging-port', '9222');
}

ipcMain.setMaxListeners(0);

// app.setAsDefaultProtocolClient('http');
// app.setAsDefaultProtocolClient('https');

const application = Application.instance;
application.start();

process.on('uncaughtException', (error) => {
  console.error(error);
});

app.on('window-all-closed', () => {
  if (platform() !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('get-webcontents-id', (e) => {
  e.returnValue = e.sender.id;
});

ipcMain.on('get-window-id', (e) => {
  e.returnValue = (e.sender as any).windowId;
});

ipcMain.handle(
  `web-contents-call`,
  async (e, { webContentsId, method, args = [] }) => {
    const wc = webContents.fromId(webContentsId);
    const result = (wc as any)[method](...args);

    if (result) {
      if (result instanceof Promise) {
        return await result;
      }

      return result;
    }
  },
);

// Prevent extension background pages from being garbage collected
const backgroundPages: Electron.WebContents[] = [];

app.on('web-contents-created', (e, webContents) => {
  if (webContents.getType() === 'backgroundPage') {
    backgroundPages.push(webContents);

    // Limit the number of stored background pages if needed
    if (backgroundPages.length > MAX_BACKGROUND_PAGES) {
      // Remove the oldest background page from the array
      const removedPage = backgroundPages.shift();
      // Clean up resources related to the removed page if necessary
    }
  }
});

// Check for listeners before sending synchronous messages
setInterval(() => {
  const webContentsIds = webContents.getAllWebContents().map((wc) => wc.id);
  for (const id of webContentsIds) {
    if (ipcMain.listenerCount(`get-cosmetic-filters-first-${id}`) === 0) {
      webContents.fromId(id).send('get-cosmetic-filters-first');
    }
  }
}, 1000);

// Add listeners for the 'get-cosmetic-filters-first' channel
ipcMain.on('get-cosmetic-filters-first', (event) => {
  event.returnValue = 'Response to the cosmetic filters request';
});

// Add additional listeners for the 'get-cosmetic-filters-first' channel
for (let i = 0; i < 10; i++) {
  ipcMain.on(`get-cosmetic-filters-first-${i}`, (event) => {
    event.returnValue = 'Response to the cosmetic filters request';
  });
}