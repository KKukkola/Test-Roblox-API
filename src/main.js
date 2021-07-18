// Noqk

const electron = require('electron');
const url = require('url');
const path = require('path');
const storage = require("electron-json-storage");
const { cwd } = require('process');

const DB = require('./modules/DB');
//import * as DB from './modules/DB';

// ***************************************************** //

const {app, BrowserWindow, Menu, ipcMain} = electron;

// SET DB
DB.SetPath(app.getPath('userData'));

// SET ENV
// process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Listen for the app to be ready
app.on('ready', function(){
    // Create new window
    mainWindow = new BrowserWindow({
        frame:false,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation: false,
        }
    }); // pass empty object
    // Load html into window
    // Basically just passing in path to loadURL
    // Like so: file://dirname/mainWindow.html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:', 
        slashes: true,
    }))
    // Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    })

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);

    /*
    // so i need what time it is 00:00 - 23:59
    // and what the date is MM:DD
    
    id = {
        July: {
            15: {
                {time:0,presence},{time:0,presence}
            }
            16: {

            }
            17: {

            }
            18: {

            }
            19: {

            }
        }
    }
    */
})

function createAddWindow(){
    // Create new window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add a user:',
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    // Load html into window
    // Basically just passing in path to loadURL
    // Like so: file://dirname/mainWindow.html
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol:'file:', 
        slashes: true,
    }));
    // Garbage collection handle
    addWindow.on('closed', function(){
        addWindow = null;
    });
}

// ***************************************************** //

ipcMain.on('user:add', (event, arg) => {
    mainWindow.webContents.send('user:add', arg);
    addWindow.close();
})

ipcMain.on('app:close', (event, arg) => {
    app.quit();
})

ipcMain.on('app:minimize', (event, arg) => {
    mainWindow.minimize();
})

// ***************************************************** //

ipcMain.handle('DB:InsertID', async (e, id) => {
    const result = await DB.InsertID(id);
    return result;
})

ipcMain.handle('DB:RemoveID', async (e, id) => {
    const result = await DB.RemoveID(id);
    return result;
})

ipcMain.handle('DB:HasID', async (e, id) => {
    const result = await DB.HasID(id);
    return result;
})

ipcMain.handle('DB:GetIDs', async (e, id) => {
    const result = await DB.GetIDs();
    return result;
})

// ***************************************************** //

ipcMain.handle('storage:LogDate', async (e, obj) => {
    cData = storage.getSync(obj.id);
    console.log("got key: ", obj.id);
    console.log("current data:", cData);
    
    if (!cData[obj.month])
        cData[obj.month] = {};
    if (!cData[obj.month][obj.day])
        cData[obj.month][obj.day] = [];
    
    cData[obj.month][obj.day].push({
        curr_presence:obj.curr_presence,
        curr_seconds:obj.curr_seconds,
        last_presence:obj.last_presence, 
        diff_seconds:obj.diff_seconds
    })

    storage.set(obj.id, cData);

    return true;
})

ipcMain.handle('storage:Clear', async (e, obj) => {
    storage.clear();
})

// ***************************************************** //
// Create menu template - just an array

const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
        {
            label: 'Add Item',
            accelerator: "Shift+A",
            click(){
                //mainWindow.webContents.send('user:add');
                createAddWindow();
            }
        },
        {
            label: 'update',
            accelerator: "Shift+B",
            click(){
                mainWindow.webContents.send('update');
            }
        },
        {
            label: 'Clear Items',
            click(){
                mainWindow.webContents.send('item:clear');
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : "Ctrl+Q",
            click(){
                app.quit(); // quits app
            }
        }
        ]
    }
];

// If mac, add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({}); // unshift is array method adding to begin of array
}

// Add developer tools item if not in prod
if (process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'devtools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload',
            }
        ]
    })
}
