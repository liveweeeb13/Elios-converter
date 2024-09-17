const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const https = require('https');

const IMAGE_PATH = path.join(__dirname, 'logo.png');

let DiscordRPC = null;
let mainWindow = null; 
const clientId = '1285554898645291079';
const startTimestamp = Date.now();
const versionUrl = 'https://liveweeeb13.github.io/none/convert.json';
const currentVersion = 'BETA v1.0'; 

async function loadDiscordRPC() {
    try {
        DiscordRPC = require('discord-rpc');
    } catch (error) {
        console.error('Impossible de charger discord-rpc');
        DiscordRPC = null;
    }
}

function checkForUpdates() {
    https.get(versionUrl, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            try {
                if (data.trim().startsWith('{') && data.trim().endsWith('}')) {
                    const { version: serverVersion, message, updateLink } = JSON.parse(data);

                    if (serverVersion !== currentVersion) {
                        dialog.showMessageBox(mainWindow, {
                            type: 'warning',
                            buttons: ['Mettre à jour', 'Annuler'],
                            title: 'Mise à jour requise',
                            message: `${message}\nVersion actuelle: ${currentVersion}\nNouvelle version: ${serverVersion}`,
                            detail: `Cliquez sur "Mettre à jour" pour télécharger la nouvelle version.`,
                            noLink: true
                        }).then(result => {
                            if (result.response === 0) {
                                shell.openExternal(updateLink);
                            }
                        });
                    }
                } else {
                    console.error('Le serveur ne renvoie pas des données JSON valides.');
                }
            } catch (error) {
                console.error('Erreur lors de l\'analyse des données de version:', error);
            }
        });

    }).on('error', (err) => {
        console.error('Erreur lors de la vérification de la version:', err);
    });
}

async function setActivity() {
    if (!DiscordRPC || !mainWindow) {
        return;
    }

    const url = mainWindow.webContents.getURL();
    let details = `Elios Converter ${currentVersion}`;
    let state = 'In the app';

    const rpc = new DiscordRPC.Client({ transport: 'ipc' });
    try {
        await rpc.login({ clientId });
        await rpc.setActivity({
            details, 
            startTimestamp,
            largeImageKey: 'logo',
            largeImageText: 'Elios Converter',
            smallImageKey: 'small_image',
            smallImageText: 'Status',
            instance: false,
        });
    } catch (err) {
        console.error('Erreur lors de la définition de l\'activité Discord:', err);
    }
}

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: IMAGE_PATH, 
        titleBarStyle: 'hiddenInset', // 'hidden' ou 'hiddenInset'
    });

    mainWindow.loadFile('index.html');

    const menu = Menu.buildFromTemplate([]);
    Menu.setApplicationMenu(menu);

    await loadDiscordRPC();
    setActivity();

    checkForUpdates();
}
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
