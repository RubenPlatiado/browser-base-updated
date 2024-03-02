import { AppWindow } from '../windows';
import { clipboard, Menu } from 'electron';
import { isURL, prefixHttp } from '~/utils';
import { saveAs, viewSource, printPage } from './common-actions';

export const getViewMenu = (
  appWindow: AppWindow,
  params: Electron.ContextMenuParams,
  webContents: Electron.WebContents,
) => {
  const menuItems: Electron.MenuItemConstructorOptions[] = [];

  const addItem = (label: string, click: () => void) => {
    menuItems.push({ label, click });
  };

  const addSeparator = () => {
    menuItems.push({ type: 'separator' });
  };

  if (params.linkURL !== '') {
    addItem('Open link in new tab', () => {
      appWindow.viewManager.create({ url: params.linkURL, active: false }, true);
    });
    addSeparator();
    addItem('Copy link address', () => {
      clipboard.clear();
      clipboard.writeText(params.linkURL);
    });
    addSeparator();
  }

  if (params.hasImageContents) {
    addItem('Open image in new tab', () => {
      appWindow.viewManager.create({ url: params.srcURL, active: false }, true);
    });
    addItem('Copy image', () => webContents.copyImageAt(params.x, params.y));
    addItem('Copy image address', () => {
      clipboard.clear();
      clipboard.writeText(params.srcURL);
    });
    addItem('Save image as...', () => {
      appWindow.webContents.downloadURL(params.srcURL);
    });
    addSeparator();
  }

  if (params.isEditable) {
    menuItems.push(
      { role: 'undo', accelerator: 'CmdOrCtrl+Z' },
      { role: 'redo', accelerator: 'CmdOrCtrl+Shift+Z' },
      { type: 'separator' },
      { role: 'cut', accelerator: 'CmdOrCtrl+X' },
      { role: 'copy', accelerator: 'CmdOrCtrl+C' },
      {
        role: 'pasteAndMatchStyle',
        accelerator: 'CmdOrCtrl+V',
        label: 'Paste',
      },
      {
        role: 'paste',
        accelerator: 'CmdOrCtrl+Shift+V',
        label: 'Paste as plain text',
      },
      { role: 'selectAll', accelerator: 'CmdOrCtrl+A' },
      { type: 'separator' }
    );
  }

  if (!params.isEditable && params.selectionText !== '') {
    addItem('Copy', () => {});
    addSeparator();
  }

  if (params.selectionText !== '') {
    const trimmedText = params.selectionText.trim();

    if (isURL(trimmedText)) {
      addItem('Go to ' + trimmedText, () => {
        appWindow.viewManager.create({ url: prefixHttp(trimmedText), active: true }, true);
      });
      addSeparator();
    }
  }

  if (!params.hasImageContents && params.linkURL === '' && params.selectionText === '' && !params.isEditable) {
    addItem('Go back', () => {
      webContents.goBack();
    });
    addItem('Go forward', () => {
      webContents.goForward();
    });
    addItem('Reload', () => {
      webContents.reload();
    });
    addSeparator();
    addItem('Save as...', () => {
      saveAs();
    });
    addItem('Print', () => {
      printPage();
    });
    addSeparator();
    addItem('View page source', () => {
      viewSource();
    });
  }

  addItem('Inspect', () => {
    webContents.inspectElement(params.x, params.y);

    if (webContents.isDevToolsOpened()) {
      webContents.devToolsWebContents.focus();
    }
  });

  return Menu.buildFromTemplate(menuItems);
};