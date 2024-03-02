export const lazyLoadMainMenu = () => {
  let _getMainMenu: () => Electron.Menu;

  const loadMainMenu = async () => {
    const { Menu, webContents, app, BrowserWindow, MenuItem } = await import('electron');
    const { defaultTabOptions } = await import('~/constants/tabs');
    const { viewSource, saveAs, printPage } = await import('./common-actions');
    const { WEBUI_BASE_URL, WEBUI_URL_SUFFIX } = await import('~/constants/files');
    const { AppWindow } = await import('../windows');
    const { Application } = await import('../application');
    const { showMenuDialog } = await import('../dialogs/menu');
    const { getWebUIURL } = await import('~/common/webui');

    const isMac = process.platform === 'darwin';

    const createMenuItem = (
      shortcuts: string[],
      action: (
        window: AppWindow,
        menuItem: MenuItem,
        shortcutIndex: number,
      ) => void,
      label: string = null,
    ) => {
      const result: any = shortcuts.map((shortcut, key) => ({
        accelerator: shortcut,
        visible: label != null && key === 0,
        label: label != null && key === 0 ? label : '',
        click: (menuItem: MenuItem, browserWindow: BrowserWindow) =>
          action(
            Application.instance.windows.list.find(
              (x) => x.win.id === browserWindow.id,
            ),
            menuItem,
            key,
          ),
      }));

      return result;
    };

    const getMainMenu = () => {
      const template: any = [
        ...(isMac
          ? [
              {
                label: app.name,
                submenu: [
                  { role: 'about' },
                  { type: 'separator' },
                  { role: 'services' },
                  { type: 'separator' },
                  { role: 'hide' },
                  { role: 'hideothers' },
                  { role: 'unhide' },
                  { type: 'separator' },
                  { role: 'quit' },
                ],
              },
            ]
          : []),
        {
          label: 'File',
          submenu: [
            // File submenu items...
          ],
        },
        {
          label: 'Edit',
          submenu: [
            // Edit submenu items...
          ],
        },
        {
          label: 'View',
          submenu: [
            // View submenu items...
          ],
        },
        {
          label: 'History',
          submenu: [
            // History submenu items...
          ],
        },
        {
          label: 'Bookmarks',
          submenu: [
            // Bookmarks submenu items...
          ],
        },
        {
          label: 'Tools',
          submenu: [
            // Tools submenu items...
          ],
        },
        {
          label: 'Tab',
          submenu: [
            // Tab submenu items...
          ],
        },
        {
          label: 'Window',
          submenu: [
            // Window submenu items...
          ],
        },
      ];

      // Additional configuration...

      return Menu.buildFromTemplate(template);
    };

    _getMainMenu = () => {
      return getMainMenu();
    };
  };

  return async () => {
    if (!_getMainMenu) {
      await loadMainMenu();
    }
    return _getMainMenu();
  };
};