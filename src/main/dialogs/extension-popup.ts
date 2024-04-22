import { BrowserWindow } from 'electron';
import { Application } from '../application';
import { DIALOG_MARGIN_TOP, DIALOG_MARGIN } from '~/constants/design';

export const showExtensionDialog = (
  browserWindow: BrowserWindow,
  x: number,
  y: number,
  url: string,
  inspect = false,
) => {
  if (!process.env.ENABLE_EXTENSIONS) {
    console.error('Extensions are not enabled.');
    return;
  }

  let height = 512;
  let width = 512;

  const dialog = Application.instance.dialogs.show({
    name: 'extension-popup',
    browserWindow,
    getBounds: () => ({
      x: x - width + DIALOG_MARGIN,
      y: y - DIALOG_MARGIN_TOP,
      height: Math.min(1024, height),
      width: Math.min(1024, width),
    }),
    // Comment out the onWindowBoundsUpdate to prevent the dialog from hiding
    // onWindowBoundsUpdate: () => dialog.hide(),
  });

  if (!dialog) {
    console.error('Failed to create the dialog.');
    return;
  }

  dialog.on('bounds', (e, w, h) => {
    width = w;
    height = h;
    dialog.rearrange();
  });

  dialog.webContentsView.on(
    'will-attach-webview',
    (e: any, webPreferences: { sandbox: boolean; nodeIntegration: boolean; contextIsolation: boolean; }, params: any) => {
      webPreferences.sandbox = true;
      webPreferences.nodeIntegration = false;
      webPreferences.contextIsolation = true;
    },
  );

  dialog.on('loaded', (e) => {
    e.reply('data', { url, inspect });
  });
};