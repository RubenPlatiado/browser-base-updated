import { app, ipcMain, WebContents, WebContentsView, BrowserWindow, screen } from 'electron';
import { parse as parseUrl } from 'url';
import { IBookmark, IHistoryItem } from '~/interfaces';
import { ERROR_PROTOCOL, NETWORK_ERROR_HOST, NEWTAB_URL, WEBUI_BASE_URL } from '~/constants/files';
import { ZOOM_FACTOR_MIN, ZOOM_FACTOR_MAX, ZOOM_FACTOR_INCREMENT } from '~/constants/web-contents';
import { TabEvent } from '~/interfaces/tabs';
import { Queue } from '~/utils/queue';
import { Application } from './application';
import { getUserAgentForURL } from './user-agent';
import { getViewMenu } from './menus/view';
import { AppWindow } from './windows';

interface IAuthInfo {
  url: string;
}

export class View {
  public isDestroyed = false;
  public webContentsView: WebContentsView;

  public isNewTab = false;
  public homeUrl: string;
  public favicon = '';
  public incognito = false;

  public errorURL = '';

  private hasError = false;

  private window: AppWindow;

  public bounds: any;

  public lastHistoryId: string;

  public bookmark: IBookmark;

  public findInfo = {
    occurrences: '0/0',
    text: '',
  };

  public requestedAuth: IAuthInfo;
  public requestedPermission: any;

  private historyQueue = new Queue();

  private lastUrl = '';

  public constructor(window: AppWindow, url: string, incognito: boolean) {
    this.webContentsView = new WebContentsView({
      webPreferences: {
        preload: `${app.getAppPath()}/build/view-preload.bundle.js`,
        nodeIntegration: true,
        contextIsolation: false,
        sandbox: true,
        partition: incognito ? 'view_incognito' : 'persist:view',
        plugins: true,
        webSecurity: true,
        javascript: true,
      },
    });

    this.incognito = incognito;

    const webContents = this.webContentsView.webContents;

    webContents.userAgent = getUserAgentForURL(
      webContents.userAgent,
      '',
    );

    (webContents as any).windowId = window.win.id;

    this.window = window;
    this.homeUrl = url;

    webContents.session.webRequest.onBeforeSendHeaders(
      (details, callback) => {
        const { object: settings } = Application.instance.settings;
        if (settings.doNotTrack) details.requestHeaders['DNT'] = '1';
        callback({ requestHeaders: details.requestHeaders });
      },
    );

    ipcMain.handle(`get-error-url-${webContents.id}`, async (e) => {
      return this.errorURL;
    });

    webContents.on('context-menu', (e, params) => {
      const menu = getViewMenu(this.window, params, webContents);
      menu.popup();
    });

    webContents.addListener('found-in-page', (e, result) => {
      Application.instance.dialogs
        .getDynamic('find')
        .webContents.send('found-in-page', result);
    });

    webContents.addListener('page-title-updated', (e, title) => {
      this.window.updateTitle();
      this.updateData();

      this.emitEvent('title-updated', title);
      this.updateURL(webContents.getURL());
    });

    webContents.addListener('did-navigate', async (e, url) => {
      this.emitEvent('did-navigate', url);

      await this.addHistoryItem(url);
      this.updateURL(url);
    });

    webContents.addListener(
      'did-navigate-in-page',
      async (e: any, url: string, isMainFrame: any) => {
        if (isMainFrame) {
          this.emitEvent('did-navigate', url);

          await this.addHistoryItem(url, true);
          this.updateURL(url);
        }
      },
    );
    
    this.webContents.addListener('did-stop-loading', () => {
      this.updateNavigationState();
      this.emitEvent('loading', false);
      this.updateURL(this.webContents.getURL());
    });

    this.webContents.addListener('did-start-loading', () => {
      this.hasError = false;
      this.updateNavigationState();
      this.emitEvent('loading', true);
      this.updateURL(this.webContents.getURL());
    });

    this.webContents.addListener('did-start-navigation', async (e, ...args) => {
      this.updateNavigationState();

      this.favicon = '';

      this.emitEvent('load-commit', ...args);
      this.updateURL(this.webContents.getURL());
    });

    this.webContents.on(
      'did-start-navigation',
      (e: any, url: string, _isInPlace: any, isMainFrame: any) => {
        if (!isMainFrame) return;
        const newUA = getUserAgentForURL(this.webContents.userAgent, url);
        if (this.webContents.userAgent !== newUA) {
          this.webContents.userAgent = newUA;
        }
      },
    );

    this.webContents.setWindowOpenHandler(({ url, frameName, disposition }) => {
      if (disposition === 'new-window') {
        this.window.viewManager.create({ url, active: true }, true);
        return { action: 'deny' };
      } else if (disposition === 'foreground-tab') {
        this.window.viewManager.create({ url, active: true }, true);
        return { action: 'deny' };
      } else if (disposition === 'background-tab') {
        this.window.viewManager.create({ url, active: false }, true);
        return { action: 'deny' };
      }
      return { action: 'allow' };
    });

    this.webContents.addListener(
      'did-fail-load',
      (e: any, errorCode: number, errorDescription: any, validatedURL: string, isMainFrame: any) => {
        // ignore -3 (ABORTED) - An operation was aborted (due to user action).
        if (isMainFrame && errorCode !== -3) {
          this.errorURL = validatedURL;

          this.hasError = true;

          this.webContents.loadURL(
            `${ERROR_PROTOCOL}://${NETWORK_ERROR_HOST}/${errorCode}`,
          );
        }
      },
    );

    this.webContents.addListener(
      'page-favicon-updated',
      async (e: any, favicons: string[]) => {
        this.favicon = favicons[0];

        await this.updateData();

        try {
          let fav = this.favicon;

          if (fav.startsWith('http')) {
            fav = await Application.instance.storage.addFavicon(fav);
          }

          this.emitEvent('favicon-updated', fav);
        } catch (e) {
          this.favicon = '';
          // console.error(e);
        }
      },
    );

    this.webContents.addListener('zoom-changed', (e, zoomDirection) => {
      const newZoomFactor =
        this.webContents.zoomFactor +
        (zoomDirection === 'in'
          ? ZOOM_FACTOR_INCREMENT
          : -ZOOM_FACTOR_INCREMENT);

      if (
        newZoomFactor <= ZOOM_FACTOR_MAX &&
        newZoomFactor >= ZOOM_FACTOR_MIN
      ) {
        this.webContents.zoomFactor = newZoomFactor;
        this.emitEvent('zoom-updated', this.webContents.zoomFactor);
        window.viewManager.emitZoomUpdate();
      } else {
        e.preventDefault();
      }
    });

    this.webContents.addListener(
      'certificate-error',
      (
        event: Electron.Event,
        url: string,
        error: string,
        certificate: Electron.Certificate,
        callback: Function,
      ) => {
        console.log(certificate, error, url);
        // TODO: properly handle insecure websites.
        event.preventDefault();
        callback(true);
      },
    );

    this.webContents.addListener('media-started-playing', () => {
      this.emitEvent('media-playing', true);
    });

    this.webContents.addListener('media-paused', () => {
      this.emitEvent('media-paused', true);
    });

    if (url.startsWith(NEWTAB_URL)) this.isNewTab = true;

    this.webContents.loadURL(url);

    app.on('ready', () => {
      const { width, height } = screen.getPrimaryDisplay().workAreaSize;
      const mainWindow = new BrowserWindow({ width, height });
      const view = new WebContentsView();
      mainWindow.setContentView(view);
    
      const setBounds = () => {
        const [width, height] = mainWindow.getContentSize();
        view.setBounds({ x: 0, y: 0, width, height });
      };
      setBounds();
      mainWindow.on('resize', setBounds);
    });
  }

  public get webContents() {
    return this.webContentsView.webContents;
  }

  public get url() {
    return this.webContents.getURL();
  }

  public get title() {
    return this.webContents.getTitle();
  }

  public get id() {
    return this.webContents.id;
  }

  public get isSelected() {
    return this.id === this.window.viewManager.selectedId;
  }

  public updateNavigationState() {
    if (this.webContentsView.webContents.isDestroyed()) return;

    if (this.window.viewManager.selectedId === this.id) {
      this.window.send('update-navigation-state', {
        canGoBack: this.webContents.canGoBack(),
        canGoForward: this.webContents.canGoForward(),
      });
    }
  }

  public destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
  
    if (this.webContentsView && !this.webContentsView.webContents.isDestroyed()) {
      (this.webContentsView.webContents as any).destroy();
      this.webContentsView = null;
    }
  }   

  public async updateCredentials() {
    if (
      !process.env.ENABLE_AUTOFILL ||
      this.webContentsView.webContents.isDestroyed()
    )
      return;

    const item = await Application.instance.storage.findOne<any>({
      scope: 'formfill',
      query: {
        url: this.hostname,
      },
    });

    this.emitEvent('credentials', item != null);
  }

  public async addHistoryItem(url: string, inPage = false) {
    if (
      url !== this.lastUrl &&
      !url.startsWith(WEBUI_BASE_URL) &&
      !url.startsWith(`${ERROR_PROTOCOL}://`) &&
      !this.incognito
    ) {
      const historyItem: IHistoryItem = {
        title: this.title,
        url,
        favicon: this.favicon,
        date: new Date().getTime(),
      };

      await this.historyQueue.enqueue(async () => {
        this.lastHistoryId = (
          await Application.instance.storage.insert<IHistoryItem>({
            scope: 'history',
            item: historyItem,
          })
        )._id;

        historyItem._id = this.lastHistoryId;

        Application.instance.storage.history.push(historyItem);
      });
    } else if (!inPage) {
      await this.historyQueue.enqueue(async () => {
        this.lastHistoryId = '';
      });
    }
  }

  public updateURL = (url: string) => {
    if (this.lastUrl === url) return;

    this.emitEvent('url-updated', this.hasError ? this.errorURL : url);

    this.lastUrl = url;

    this.isNewTab = url.startsWith(NEWTAB_URL);

    this.updateData();

    if (process.env.ENABLE_AUTOFILL) this.updateCredentials();

    this.updateBookmark();
  };

  public updateBookmark() {
    this.bookmark = Application.instance.storage.bookmarks.find(
      (x) => x.url === this.url,
    );

    if (!this.isSelected) return;

    this.window.send('is-bookmarked', !!this.bookmark);
  }

  public async updateData() {
    if (!this.incognito) {
      const id = this.lastHistoryId;
      if (id) {
        const { title, url, favicon } = this;

        this.historyQueue.enqueue(async () => {
          await Application.instance.storage.update({
            scope: 'history',
            query: {
              _id: id,
            },
            value: {
              title,
              url,
              favicon,
            },
            multi: false,
          });

          const item = Application.instance.storage.history.find(
            (x) => x._id === id,
          );

          if (item) {
            item.title = title;
            item.url = url;
            item.favicon = favicon;
          }
        });
      }
    }
  }

  public send(channel: string, ...args: any[]) {
    this.webContents.send(channel, ...args);
  }

  public get hostname() {
    return parseUrl(this.url).hostname;
  }

  public emitEvent(event: TabEvent, ...args: any[]) {
    if (this.window && this.window.send) {
      this.window.send('tab-event', event, this.id, args);
    }
  }
}