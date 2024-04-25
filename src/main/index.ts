import { ipcMain, app, webContents, crashReporter } from 'electron';
import { setIpcMain } from '@wexond/rpc-electron';
import { ElectronBlocker } from '@cliqz/adblocker-electron';
import fetch from 'cross-fetch';
const path = require('path');

// main process code

setIpcMain(ipcMain);

require('@electron/remote/main').initialize();

if (process.env.NODE_ENV === 'development') {
  require('source-map-support').install();
}

import { platform } from 'os';
import { Application } from './application';

export const isNightly = app.name === 'wexond-nightly';

app.name = isNightly ? 'Wexond Nightly' : 'Wexond';

app.commandLine.appendSwitch('new-canvas-2d-api');
app.commandLine.appendSwitch('enable-local-file-accesses');
app.commandLine.appendSwitch('enable-quic');
app.commandLine.appendSwitch('enable-ui-devtools');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('enable-webgl-draft-extensions');
app.commandLine.appendSwitch('enable-transparent-visuals');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('enable-browser-side-compositing');
app.commandLine.appendSwitch('enable-smooth-scrolling');
app.commandLine.appendSwitch('enable-experimental-web-platform-features');
app.commandLine.appendSwitch('fast-tab-windows-close');
app.commandLine.appendSwitch('enable-tab-discarding');
app.commandLine.appendSwitch('enable-use-zoom-for-dsf');
app.commandLine.appendSwitch('disable-gpu-vsync');
app.commandLine.appendSwitch('enable-begin-frame-scheduling');
app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('enable-oop-rasterization');
app.commandLine.appendSwitch('enable-native-gpu-memory-buffers');
app.commandLine.appendSwitch('enable-gpu-sandbox');
app.commandLine.appendSwitch('enable-accelerated-video-decoding');

const widevineCdmPath = path.join(__dirname, 'src', 'main', 'services', 'widevine', '_platform_specific', 'win_x64');
app.commandLine.appendSwitch('widevine-cdm-path', widevineCdmPath);
app.commandLine.appendSwitch('widevine-cdm-version', '4.10.2710.0');
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

require('events').EventEmitter.defaultMaxListeners = 15;

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
    
    if (wc && typeof (wc as any)[method] === 'function') {
      const result = await (wc as any)[method](...args);

      return result;
    } else {
      console.error(`Method ${method} does not exist on webContents`);
      return null;
    }
  }
);

const backgroundPages: Electron.WebContents[] = [];

app.on('web-contents-created', (e, webContents) => {
  if (webContents.getType() === 'backgroundPage') {
    backgroundPages.push(webContents);

    const MAX_BACKGROUND_PAGES = 10;
    if (backgroundPages.length > MAX_BACKGROUND_PAGES) {
      const removedPage = backgroundPages.shift();
    }
  }
});

app.on('ready', async () => {
  try {
    await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch);
  } catch (error) {
    console.error('Error initializing adblocker:', error);
  }
});

setInterval(() => {
  const webContentsIds = webContents.getAllWebContents().map((wc) => wc.id);
  for (const id of webContentsIds) {
    if (ipcMain.listenerCount(`get-cosmetic-filters-first-${id}`) === 0) {
      webContents.fromId(id).send('get-cosmetic-filters-first');
    }
  }
}, 1000);

ipcMain.on('get-cosmetic-filters-first', (event) => {
  event.returnValue = 'Response to the cosmetic filters request';
});

for (let i = 0; i < 10; i++) {
  ipcMain.on(`get-cosmetic-filters-first-${i}`, (event) => {
    event.returnValue = 'Response to the cosmetic filters request';
  });
}