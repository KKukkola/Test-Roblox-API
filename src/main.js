// Noqk

const electron = require('electron');
const url = require('url');
const path = require('path');
const { cwd } = require('process');

// from electron
const {app, BrowserWindow, Menu, ipcMain} = electron;

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
})

// Catch app:minimize
ipcMain.on('app:close', (event, arg) => {
    app.quit();
})

ipcMain.on('app:minimize', (event, arg) => {
    mainWindow.minimize();
})

// Create menu template
// In Electron, menu is just an array
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
        {
            label: 'Add Item',
            accelerator: "Shift+A",
            click(){
                mainWindow.webContents.send('user:add');
                //createAddWindow();
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
