const {app, Menu, BrowserWindow} = require('electron')
let win

function createWindow(){
    win = new BrowserWindow({
        width: 1000, 
        height: 600,
        titleBarStyle: 'hiddenInset', 
        frame : true, 
        resizable: false
    });
    win.loadFile("src/index.html");
    win.on('closed',() => {
        win == null;
        app.quit();
    })
win.webContents.openDevTools();

}
//zoomIn
app.on('ready', () =>{
    createWindow();
    createMenu();
//
});
app.on('window-all-closed', () =>{
    if(process.platform !== "darwin"){
        app.quit()
    }
})

app.on('activate', () =>{
    if(win == true){
        createWindow();
    }
})


//Menu
function createMenu(){
    var menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                {label:'About Popers'},
                {type : "separator"},
                {
                    label:'Preferences',
                    click(){
                       win.webContents.send("showPrefs");
                    },
                    accelerator : "CmdOrCtrl+P",
                },
                {type : "separator"},
                { 
                    label:'Exit',
                    click(){
                        app.quit();
                    },
                    accelerator : "Cmd+Q"
                }
            ],
        },
         {   label : "View",
            submenu:[
                { 
                    label : "Reload",
                    accelerator : "CmdOrCtrl+R",
                    click(){
                        win.webContents.send("reloadMenu");
                     }
                },
                {type : "separator"},
                {role : "minimize"},
                {role : "togglefullscreen"}
            ]
        },
        {
            label : "Edit",
            submenu:[
                { 
                    label : "Add",
                    accelerator : "CmdOrCtrl+N",
                    click(){
                        win.webContents.send("addMenu");
                     }
                },
                { 
                    label : "Edit",
                    accelerator : "CmdOrCtrl+E",
                    click(){
                        win.webContents.send("editMenu");
                     }
                },
                { 
                    label : "Delete",
                    accelerator : "CmdOrCtrl+Backspace",
                    click(){
                        win.webContents.send("deleteMenus");
                     }
                },
                {type : "separator"},
                {
                    label : "About",
                    accelerator : "CmdOrCtrl+I",
                    click(){
                        win.webContents.send("infoMenu");
                     }
                }
            ]
        }
    ])
    Menu.setApplicationMenu(menu);
}


