import './index.css'
import { Break } from '../global.d';

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

class ProgressBarRenderer {
  private bar: HTMLElement;
  private text: HTMLElement;
  private totalTime: Time;
  private startTimeStamp = Date.now();
  private intervalId: NodeJS.Timeout;

  constructor(name: string, totalTime: Time){
    this.bar = document.querySelector('#'+name+'-progress-bar');
    this.text = document.querySelector('#'+name+'-inner-progress-text');
    this.totalTime = totalTime;
  }

  continueContingDown(): void{
    this.totalTime.setRemainingTime(this.totalTime.getMilliSeconds() - (Date.now() - this.startTimeStamp));
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

function initTimer(currentBreak: Break): void {
  const breakRenderer = new ProgressBarRenderer('break', new Time(0, currentBreak.minutes, currentBreak.hours));
  breakRenderer.startContingDown();

  window.addEventListener('focus', () => {
      breakRenderer.pauseCountingDown();
      breakRenderer.continueContingDown();
  })
}

async function init() {
  const currentBreak = await window.electronAPI.getCurrentBreak();
  document.getElementById('break-type').innerText = currentBreak.breakType;
  initTimer(currentBreak);
}

init();