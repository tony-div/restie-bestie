export interface Break {
  breakType: string;
  minutes: number;
  hours: number;
}

export interface Timers {
  shortTimerRemainingTime: number,
  longTimerRemainingTime: number,
  isTakingBreak: boolean
}

export interface Preferences {
  shortBreakInterval: {
    minutes: number,
    hours: number
  },
  longBreakInterval: {
    minutes: number,
    hours: number
  },
  shortBreakTime: {
    minutes: number
  },
  longBreakTime: {
    minutes: number,
    hours: number
  }
}

export interface ElectronAPI {
  getCurrentBreak: () => promise<Break>;
  getPreferences: () => Promise<any>;
  getTimersRemainingTime: () => promise<Timers>;
  onTimersReset: (callback: () => void) => Electron.IpcRenderer;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}