import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getPreferences: () => ipcRenderer.invoke('get-preferences'),
  getTimersRemainingTime: () => ipcRenderer.invoke('get-timers-remaining-time'),
  onTimersReset: (callback: () => void) => ipcRenderer.on('timers-reset', callback)
})
