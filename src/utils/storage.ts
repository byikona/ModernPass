// Types for the electron API exposed in preload.ts
declare global {
    interface Window {
        electronAPI: {
            readData: () => Promise<string | null>;
            writeData: (data: string) => Promise<boolean>;
            getDbPath: () => Promise<string>;
            changeDbPath: () => Promise<string | null>;
            getProfiles: () => Promise<{ name: string, path: string }[]>;
            createProfile: (name: string) => Promise<{ success: boolean, path?: string, error?: string }>;
            setActiveProfile: (filePath: string) => Promise<boolean>;
        };
    }
}

export const loadEncryptedFile = async (): Promise<string | null> => {
    if (window.electronAPI?.readData) {
        return await window.electronAPI.readData();
    }
    console.warn("Secure file system is not available in browser mode.");
    return null;
};

export const saveEncryptedFile = async (data: string): Promise<boolean> => {
    if (window.electronAPI?.writeData) {
        return await window.electronAPI.writeData(data);
    }
    console.warn("Secure file system is not available in browser mode. Data is NOT saved.");
    return false;
};
