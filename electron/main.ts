import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import type { IpcMainInvokeEvent } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { pathToFileURL } from 'url';

let mainWindow: BrowserWindow | null = null;

// Default boot path
const CONFIG_FILE = path.join(app.getPath('userData'), 'user-config.json');



function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        // Make the background transparent or use a specific color for iOS feel
        backgroundColor: '#00000000',
        show: false,
        autoHideMenuBar: true,
    });

    Menu.setApplicationMenu(null);

    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });

    if (!app.isPackaged) {
        mainWindow.loadURL('http://localhost:5173');
    } else {
        mainWindow.loadURL(pathToFileURL(path.join(__dirname, '../dist/index.html')).href);
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

const PROFILES_DIR = path.join(app.getPath('userData'), 'Profiles');

if (!fs.existsSync(PROFILES_DIR)) {
    fs.mkdirSync(PROFILES_DIR, { recursive: true });
}

// Keep track of the currently active profile
let activeProfilePath: string | null = null;

const getActiveDbPath = () => {
    if (activeProfilePath) return activeProfilePath;

    // Fallback to config if active profile not set in memory
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
            if (config.dbPath && fs.existsSync(config.dbPath)) {
                activeProfilePath = config.dbPath;
                return config.dbPath;
            }
        }
    } catch (e) {
        console.error('Could not read config', e);
    }
    return null;
};

// IPC handlers for Profiles
ipcMain.handle('get-profiles', async () => {
    try {
        if (!fs.existsSync(PROFILES_DIR)) return [];
        const files = fs.readdirSync(PROFILES_DIR);
        return files.filter(f => f.endsWith('.mkpsx')).map(f => ({
            name: f.replace('.mkpsx', ''),
            path: path.join(PROFILES_DIR, f)
        }));
    } catch (e) {
        console.error('Failed to get profiles:', e);
        return [];
    }
});

ipcMain.handle('create-profile', async (_, name: string) => {
    try {
        const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
        const newPath = path.join(PROFILES_DIR, `${safeName}.mkpsx`);
        if (fs.existsSync(newPath)) {
            return { success: false, error: 'Profile already exists' };
        }
        // Create an empty file placeholder to reserve the name
        fs.writeFileSync(newPath, '', 'utf-8');
        return { success: true, path: newPath };
    } catch (error) {
        console.error('Failed to create profile:', error);
        return { success: false, error: 'Failed to create file' };
    }
});

ipcMain.handle('set-active-profile', async (_, filePath: string) => {
    try {
        if (fs.existsSync(filePath)) {
            activeProfilePath = filePath;
            fs.writeFileSync(CONFIG_FILE, JSON.stringify({ dbPath: filePath }), 'utf-8');
            return true;
        }
    } catch (error) {
        console.error('Failed to set active profile:', error);
    }
    return false;
});

// IPC handlers for data storage
ipcMain.handle('read-data', async () => {
    const dbPath = getActiveDbPath();
    if (!dbPath) return null;
    try {
        // Let it handle empty new files
        if (fs.existsSync(dbPath)) {
            const content = fs.readFileSync(dbPath, 'utf-8');
            return content || null;
        }
    } catch (error) {
        console.error('Failed to read data:', error);
    }
    return null;
});

ipcMain.handle('write-data', async (_: IpcMainInvokeEvent, data: string) => {
    const dbPath = getActiveDbPath();
    if (!dbPath) return false;
    try {
        fs.writeFileSync(dbPath, data, 'utf-8');
        return true;
    } catch (error) {
        console.error('Failed to write data:', error);
        return false;
    }
});

ipcMain.handle('get-db-path', async () => {
    return getActiveDbPath();
});

ipcMain.handle('change-db-path', async () => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow!, {
        title: 'Select Password Database Location',
        defaultPath: 'passwords.mkpsx',
        filters: [{ name: 'Encrypted Vault', extensions: ['mkpsx'] }]
    });

    if (!canceled && filePath) {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify({ dbPath: filePath }), 'utf-8');
        activeProfilePath = filePath;

        // Move old file to new location if it exists
        const oldPath = getActiveDbPath();
        if (oldPath && oldPath !== filePath && fs.existsSync(oldPath)) {
            try {
                fs.copyFileSync(oldPath, filePath);
            } catch (e) {
                console.error('Could not copy db', e);
            }
        }
        return filePath;
    }
    return null;
});
