export class Break {
  breakType: string;
  minutes: number;
  hours: number;

  constructor(breakType: string, minutes: number, hours: number){
    this.breakType = breakType;
    this.minutes = minutes;
    this.hours = hours;
  }
}