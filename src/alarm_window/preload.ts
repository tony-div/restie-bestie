import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getCurrentBreak: () => ipcRenderer.invoke('get-current-break')
})
