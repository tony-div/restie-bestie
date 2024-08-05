import fs from 'fs';
import path from 'node:path';
import { Time } from './Time';

export class Preferences {
  public static APP_PREFERENCES: any;

  public static init() {
    Preferences.APP_PREFERENCES = JSON.parse(fs.readFileSync(path.join(__dirname, 'preferences.app.json'), {encoding: 'utf-8'}));
  }
  public static getPreferences(): object {
    return structuredClone(Preferences.APP_PREFERENCES)
  }

  public static getShortBreakInterval(): Time {
    const preferences = Preferences.APP_PREFERENCES['shortBreakInterval'];
    const time = new Time(0, preferences.minutes, preferences.hours);
    return time;
  }

  public static getLongBreakInterval(): Time {
    const preferences = Preferences.APP_PREFERENCES['longBreakInterval'];
    const time = new Time(0, preferences.minutes, preferences.hours);
    return time;
  }

  public static getShortBreakTime(): Time {
    const preferences = Preferences.APP_PREFERENCES['shortBreakTime'];
    const time = new Time(0, preferences.minutes);
    return time;
  }

  public static getLongBreakTime(): Time {
    const preferences = Preferences.APP_PREFERENCES['longBreakTime'];
    const time = new Time(0, preferences.minutes, preferences.hours);
    return time;
  }
}