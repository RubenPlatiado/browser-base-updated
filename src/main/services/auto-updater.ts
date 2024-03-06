import { ipcMain } from 'electron';
import { Application } from '../application';

export const runAutoUpdaterService = () => {
  let updateAvailable = false;
  let autoUpdaterInitialized = false;

  const initializeAutoUpdater = () => {
    autoUpdaterInitialized = true;
    const { autoUpdater } = require('electron-updater');

    ipcMain.on('install-update', () => {
      if (process.env.NODE_ENV !== 'development') {
        autoUpdater.quitAndInstall(true, true);
      }
    });

    ipcMain.handle('is-update-available', () => {
      return updateAvailable;
    });

    ipcMain.on('update-check', () => {
      autoUpdater.checkForUpdates();
    });

    autoUpdater.on('update-downloaded', () => {
      updateAvailable = true;

      for (const window of Application.instance.windows.list) {
        window.send('update-available');
        Application.instance.dialogs
          .getDynamic('menu')
          ?.browserView?.webContents?.send('update-available');
      }
    });
  };

  ipcMain.on('initialize-auto-updater', () => {
    if (!autoUpdaterInitialized) {
      initializeAutoUpdater();
    }
  });
};