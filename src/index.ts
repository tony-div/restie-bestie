import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import { setupTitlebar } from "custom-electron-titlebar/main";
import { Preferences } from './preferences';
import { EventEmitter } from 'node:events';
import { Breaker } from './Breaker';
import { windowManager } from './windowManager';
import { Break } from './Break';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const ALARM_WINDOW_WEBPACK_ENTRY: string;
declare const ALARM_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
Preferences.init();
setupTitlebar();
const breaker = new Breaker();
let currentBreak: Break;
const eventEmitter = new EventEmitter();
nativeTheme.themeSource = "dark";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

ipcMain.handle('get-preferences', Preferences.getPreferences);
ipcMain.handle('get-current-break', () => currentBreak);
ipcMain.handle('get-timers-remaining-time', () => breaker.getTimersRemainingTime());

eventEmitter.on('short-break', () => {
  currentBreak = new Break('short', Preferences.getShortBreakTime().getMinutes(), Preferences.getShortBreakTime().getHours());
  windowManager.createAlarmWindow('short', ALARM_WINDOW_WEBPACK_ENTRY, ALARM_WINDOW_PRELOAD_WEBPACK_ENTRY);
  windowManager.resetMainTimers();

})

eventEmitter.on('long-break', () => {
  currentBreak = new Break('long', Preferences.getLongBreakTime().getMinutes(), Preferences.getLongBreakTime().getHours());
  windowManager.createAlarmWindow('long', ALARM_WINDOW_WEBPACK_ENTRY, ALARM_WINDOW_PRELOAD_WEBPACK_ENTRY);
  windowManager.resetMainTimers();
})

eventEmitter.on('break-ended', () => {
  windowManager.closeAlarmWindow();
  windowManager.resetMainTimers();
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  windowManager.createMainWindow(MAIN_WINDOW_WEBPACK_ENTRY, MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY);
  breaker.init();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    windowManager.createMainWindow(MAIN_WINDOW_WEBPACK_ENTRY, MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY);
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
export { eventEmitter };
