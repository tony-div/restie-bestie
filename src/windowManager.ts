import { BrowserWindow } from 'electron';
import { attachTitlebarToWindow } from "custom-electron-titlebar/main";
import path from 'node:path';

export class windowManager {
  private static mainWindow: BrowserWindow;
  private static alarmWindow: BrowserWindow;

  static createMainWindow(WINDOW_WEBPACK_ENTRY: string, WINDOW_PRELOAD_WEBPACK_ENTRY: string): void {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      width: 700,
      height: 398,
      icon: path.join(__dirname, 'icon.png'),
      webPreferences: {
        preload: WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: '#1f1f1f',
        symbolColor: '#e8eaed'
      }
    });
  
    // and load the index.html of the app.
    mainWindow.loadURL(WINDOW_WEBPACK_ENTRY);
    attachTitlebarToWindow(mainWindow);
    windowManager.mainWindow = mainWindow;
  }

  static resetMainTimers() {
    this.mainWindow.webContents.send('timers-reset')
  }

  static createAlarmWindow(breakType: string, WINDOW_WEBPACK_ENTRY: string, WINDOW_PRELOAD_WEBPACK_ENTRY: string): void {
    const alarmWindow = new BrowserWindow({
      width: 332,
      height: 150,
      icon: path.join(__dirname, 'icon.png'),
      webPreferences: {
        preload: WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
      titleBarStyle: 'hidden',
    });
  
    // and load the index.html of the app.
    alarmWindow.loadURL(WINDOW_WEBPACK_ENTRY);
    alarmWindow.setAlwaysOnTop(true);
    alarmWindow.setMovable(false);
    alarmWindow.setResizable(false);
    alarmWindow.setClosable(false);
    alarmWindow.on('ready-to-show', () => alarmWindow.webContents.send('break-type', breakType))
    windowManager.alarmWindow = alarmWindow;
  }

  static closeAlarmWindow(): void {
    const alarmWindow = windowManager.alarmWindow;
    if(alarmWindow.isDestroyed() == false) {
      alarmWindow.setClosable(true);
      alarmWindow.close();
    }
  }
}