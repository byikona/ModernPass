import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    readData: () => ipcRenderer.invoke('read-data'),
    writeData: (data: string) => ipcRenderer.invoke('write-data', data),
    getDbPath: () => ipcRenderer.invoke('get-db-path'),
    changeDbPath: () => ipcRenderer.invoke('change-db-path'),

    // Profiles API
    getProfiles: () => ipcRenderer.invoke('get-profiles'),
    createProfile: (name: string) => ipcRenderer.invoke('create-profile', name),
    setActiveProfile: (filePath: string) => ipcRenderer.invoke('set-active-profile', filePath)
});
