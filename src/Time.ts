export class Time {
  private milliSeconds: number;
  private remaining: number;
  private paused: boolean;

  constructor(seconds: number, minutes = 0, hours = 0) {
    this.milliSeconds = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
    this.remaining = this.milliSeconds;
  }
  
  public getMilliSeconds():number {
    return this.milliSeconds;
  }

  public getRemaining(): number {
    return this.remaining;
  }
  
  public getMinutes(): number {
    return Math.floor(this.milliSeconds / (60 * 1000));
  }

  public getHours(): number {
    return Math.floor(this.milliSeconds / (60 * 60 * 1000));
  }

  public countDown(milliSeconds: number): void {
    if(this.paused == false)
      this.remaining -= milliSeconds;
  }

  public reset(): void {
    this.remaining = this.milliSeconds;
    this.paused = false;
  }

  public pause(): void {
    this.paused = true;
  }

  public continue(): void {
    this.paused = false;
  }

  public isFinished(): boolean {
    return this.remaining <= 0;
  }
}