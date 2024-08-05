/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
import { Preferences, Timers } from '../global.d';
import './index.css';
class Time {
  private remainingMilliSeconds: number;
  private milliSeconds: number;
  constructor(seconds: number, minutes = 0, hours = 0) {
    this.milliSeconds = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
    this.remainingMilliSeconds = this.milliSeconds;
  }
  setRemainingTime(milliSeconds: number): void {
    if(milliSeconds > 0)
      this.remainingMilliSeconds = milliSeconds;
  }
  subtract(milliSeconds: number): number {
    if(this.remainingMilliSeconds - milliSeconds < 0){
      this.remainingMilliSeconds = 0
      return this.remainingMilliSeconds;
    }
    this.remainingMilliSeconds -= milliSeconds;
    return this.remainingMilliSeconds;
  }
  getHours(): number {
    return Math.floor(this.milliSeconds / (60 * 60 * 1000));
  }
  getRemainingHours(): number {
    return Math.floor(this.remainingMilliSeconds / (60 * 60 * 1000));
  }
  getRemainingMinutes(): number {
    return Math.floor(this.remainingMilliSeconds / (60 * 1000)) - (Math.floor(this.remainingMilliSeconds / (1000 * 60 * 60))) * 60;
  }
  getRemainingSeconds(): number {
    return Math.round(this.remainingMilliSeconds / 1000 - (Math.floor(this.remainingMilliSeconds / (1000 * 60))) * 60);
  }
  getRemainingPercentage(): number {
    return Math.round((this.remainingMilliSeconds / this.milliSeconds) * 10000) / 100
  }
  getMilliSeconds(): number {
    return this.milliSeconds;
  }
  getFormattedRemainingTime(): string {
    let result = '';
    const hours = this.getRemainingHours();
    const minutes = this.getRemainingMinutes();
    const seconds = this.getRemainingSeconds();
    if(hours > 9)
      result = result + hours + ':';
    else if(this.getHours() > 0)
      result = result + '0' + hours + ':';

    if(minutes > 9)
      result = result + minutes + ':';
    else
      result = result + '0' + minutes + ':';

    if(seconds > 9)
      result = result + seconds;
    else
      result = result + '0' + seconds;

    return result;
  }
}
console.log('👋 This message is being logged by "renderer.js", included via webpack');
class ProgressBarRenderer {
  private bar: HTMLElement;
  private text: HTMLElement;
  private totalTime: Time;
  private intervalId: NodeJS.Timeout;

  constructor(name: string, totalTime: Time){
    this.bar = document.querySelector('#'+name+'-progress-bar');
    this.text = document.querySelector('#'+name+'-inner-progress-text');
    this.totalTime = totalTime;
  }

  setRemainingTime(milliSeconds: number): void {
    this.totalTime.setRemainingTime(milliSeconds);
  }

  continueContingDown(): void{
    this.pauseCountingDown();
    this.intervalId = setInterval(() => {
      this.text.innerText = this.totalTime.getFormattedRemainingTime();
      this.bar.style.width = `${this.totalTime.getRemainingPercentage()}%`; 
      this.totalTime.subtract(1000);
    }, 1000);
  }

  startContingDown(): void {
    this.continueContingDown();
  }

  pauseCountingDown(): void {
    clearInterval(this.intervalId);
  }

}

function initTimers(preferences: Preferences) {
  const shortBreakRenderer = new ProgressBarRenderer('short-break', new Time(0, preferences.shortBreakInterval.minutes));
  const longBreakRenderer = new ProgressBarRenderer('long-break', new Time(0, preferences.longBreakInterval.minutes, preferences.longBreakInterval.hours))
  const renderers = [shortBreakRenderer, longBreakRenderer];
  renderers.forEach(renderer => {
    renderer.startContingDown();
  })

  async function refresh(): Promise<void> {
    const timers: Timers = await window.electronAPI.getTimersRemainingTime();
    shortBreakRenderer.pauseCountingDown();
    longBreakRenderer.pauseCountingDown();
    shortBreakRenderer.setRemainingTime(timers.shortTimerRemainingTime);
    longBreakRenderer.setRemainingTime(timers.longTimerRemainingTime);
    if(timers.isTakingBreak == false){
      shortBreakRenderer.continueContingDown();
      longBreakRenderer.continueContingDown();
    }
  }
  refresh();
  window.addEventListener('focus', refresh);
  window.electronAPI.onTimersReset(() => {
    console.log('refreshing after receiving an event!')
    refresh();
  });
  return refresh;
}

async function init() {
  const preferences = await window.electronAPI.getPreferences();
  return initTimers(preferences);
}

init()