import { Menu, app, BrowserWindow, MenuItem } from 'electron';
import { defaultTabOptions } from '~/constants/tabs';
import { viewSource, saveAs, printPage } from './common-actions';
import { WEBUI_BASE_URL, WEBUI_URL_SUFFIX } from '~/constants/files';
import { AppWindow } from '../windows';
import { Application } from '../application';
import { showMenuDialog } from '../dialogs/menu';
import { getWebUIURL } from '~/common/webui';
import { resolve, join } from 'path';

const isWin = process.platform === 'win32';
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

export const getMainMenu = () => {
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
        ...createMenuItem(
          ['CmdOrCtrl+N'],
          () => {
            Application.instance.windows.open();
          },
          'New window',
        ),
        ...createMenuItem(
          ['CmdOrCtrl+Shift+N'],
          () => {
            Application.instance.windows.open(true);
          },
          'New incognito window',
        ),
        ...createMenuItem(
          ['CmdOrCtrl+T'],
          (window) => {
            window.viewManager.create(defaultTabOptions);
          },
          'New tab',
        ),
        ...createMenuItem(
          ['CmdOrCtrl+Shift+T'],
          (window) => {
            window.send('revert-closed-tab');
          },
          'Revert closed tab',
        ),
        {
          type: 'separator',
        },
        ...createMenuItem(
          ['CmdOrCtrl+Shift+W'],
          (window) => {
            window.win.close();
          },
          'Close window',
        ),
        ...createMenuItem(
          ['CmdOrCtrl+W', 'CmdOrCtrl+F4'],
          (window) => {
            window.send('remove-tab', window.viewManager.selectedId);
          },
          'Close tab',
        ),
        {
          type: 'separator',
        },
        ...createMenuItem(
          ['CmdOrCtrl+S'],
          async () => {
            await saveAs();
          },
          'Save webpage as...',
        ),
        {
          type: 'separator',
        },
        ...createMenuItem(
          ['CmdOrCtrl+P'],
          () => {
            printPage();
          },
          'Print',
        ),
        ...createMenuItem(
          ['CmdOrCtrl+Shift+Q'],
          (window) => {
            app.quit();
          },
          'Quit Wexond',
        ),

        // ...(!isMac ? [{ role: 'quit' }] : [{}]),

        // Hidden items

        // Focus address bar
        ...createMenuItem(
          ['Ctrl+Space', 'CmdOrCtrl+L', 'Alt+D', 'F6'],
          async () => {
            await Application.instance.dialogs
              .getPersistent('search')
              .show(Application.instance.windows.current.win);
          },
        ),

        // Toggle menu
        ...createMenuItem(['Alt+F', 'Alt+E'], () => {
          Application.instance.windows.current.send('show-menu-dialog');
        }),
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'delete' },
              { role: 'selectAll' },
              { type: 'separator' },
              {
                label: 'Speech',
                submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }],
              },
            ]
          : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
        { type: 'separator' },
        ...createMenuItem(
          ['CmdOrCtrl+F'],
          () => {
            Application.instance.windows.current.send('find');
          },
          'Find in page',
        ),
      ],
    },
    {
      label: 'View',
      submenu: [
        ...createMenuItem(
          ['CmdOrCtrl+R', 'F5'],
          (window) => {
            window.win.webContents.reload();
          },
          'Reload',
        ),
        ...createMenuItem(
          ['CmdOrCtrl+Shift+R', 'Shift+F5'],
          (window) => {
            window.win.webContents.reloadIgnoringCache();
          },
          'Reload ignoring cache',
        ),
      ],
    },
    // Other menu items...
  ];

  return Menu.buildFromTemplate(template);
};