import { remote, ipcRenderer } from 'electron';
import { resolve } from 'path';

const app = document.getElementById('app');
const container = document.getElementById('container');

let webview: Electron.WebviewTag;
let visible = false;

const removeWebview = () => {
  if (webview) {
    container.removeChild(webview);
    container.style.width = '0px';
    container.style.height = '0px';
  }
};

const _hide = () => {
  app.classList.remove('visible');
  removeWebview();
};

const hide = () => {
  visible = false;
  _hide();
  setTimeout(() => {
    ipcRenderer.send(`hide-${getWebContentsId()}`);
  });
};

const show = () => {
  app.classList.add('visible');
  visible = true;
};

const createWebview = (url: string, inspect: boolean) => {
  webview = document.createElement('webview');

  webview.setAttribute('partition', 'persist:view');
  webview.setAttribute('src', url);
  webview.setAttribute(
    'preload',
    `file:///${resolve(
      remote.app.getAppPath(),
      'build',
      'popup-preload.bundle.js',
    )}`,
  );

  webview.style.width = '100%';
  webview.style.height = '100%';

  webview.addEventListener('dom-ready', () => {
    if (inspect) {
      webview.openDevTools();
    }
  });

  webview.addEventListener('ipc-message', (e) => {
    if (e.channel === 'webview-size') {
      let [width, height] = e.args;

      width = width === 0 ? 1 : width;
      height = height === 0 ? 1 : height;

      container.style.width = width + 'px';
      container.style.height = height + 'px';

      ipcRenderer.send(`bounds-${getWebContentsId()}`, width + 32, height + 40);

      show();

      webview.focus();
    } else if (e.channel === 'webview-blur') {
      if (visible && !webview.isDevToolsOpened()) {
        hide();
      }
    }
  });

  container.appendChild(webview);
};

ipcRenderer.on('data', (e, data) => {
  const { url, inspect } = data;
  createWebview(url, inspect);
});

ipcRenderer.send(`loaded-${getWebContentsId()}`);

// Helper function to get the webContents id
const getWebContentsId = () => ipcRenderer.sendSync('get-webcontents-id');