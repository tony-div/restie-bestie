import { Preferences } from './preferences';
import { eventEmitter } from './index';
import { Timers } from './global.d';
import { Time } from './Time';

export class Breaker {
  private shortBreakInterval = Preferences.getShortBreakInterval();
  private longBreakInterval = Preferences.getLongBreakInterval();
  private shortBreakTime = Preferences.getShortBreakTime();
  private longBreakTime = Preferences.getLongBreakTime();
  private isTakingBreak = false;
  private timerInterval: NodeJS.Timeout;

  public getTimersRemainingTime(): Timers {
    return {
      longTimerRemainingTime: this.longBreakInterval.getRemaining(),
      shortTimerRemainingTime: this.shortBreakInterval.getRemaining(),
      isTakingBreak: this.isTakingBreak
    }
  }

  private pause(): void {
    clearInterval(this.timerInterval);
  }

  private continue(): void {
    this.pause();
    this.shortBreakInterval.continue();
    this.longBreakInterval.continue();

    this.timerInterval = setInterval(() => {
      if(this.longBreakInterval.isFinished()){
        this.longBreak();
        this.shortBreakInterval.reset();
        this.longBreakInterval.reset();
        this.pause();
      }
      else if(this.shortBreakInterval.isFinished()){
        this.shortBreak();
        this.shortBreakInterval.reset();
        this.pause();
      }
      else {
        this.shortBreakInterval.countDown(1000);
        this.longBreakInterval.countDown(1000);
      }
    }, 1000);
  }

  public init(): void {
    this.continue();
  }

  private shortBreak(): void {
    if(this.isTakingBreak)
      return;
    this.isTakingBreak = true;
    this.shortBreakInterval.pause();
    eventEmitter.emit('short-break');
    setTimeout(() => {
      this.isTakingBreak = false;
      eventEmitter.emit('break-ended');
      this.continue();
    }, this.shortBreakTime.getMilliSeconds());
  }

  private longBreak(): void {
    if(this.isTakingBreak)
      return;
    this.isTakingBreak = true;
    this.longBreakInterval.pause();
    eventEmitter.emit('long-break');
    setTimeout(() => {
      this.isTakingBreak = false;
      eventEmitter.emit('break-ended');
      this.continue();
    }, this.longBreakTime.getMilliSeconds());
  }
}