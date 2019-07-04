const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const DataStore = require('./renderer/MusicDataStore')
const path = require('path')

const myStore = new DataStore({'name': path.join(path.resolve('.'), 'renderer/music_data')})

class AppWindow extends BrowserWindow {
  constructor(config, fileLocation) {
    const basicConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    }
    // const finalConfig = Object.assign(basicConfig, config)
    const finalConfig = {...basicConfig, ...config}
    super(finalConfig)
    this.loadFile(fileLocation)
    // 加载页面，渲染进程第一次完成时，会发出 ready-to-show
    this.once('ready-to-show', () => {
      this.show()   
    })
  }
}

app.on('ready', () => {
  // console.log("hello, electron")
  // const mainWindow = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  //   webPreferences: {
  //     nodeIntegration: true
  //   }
  // })
  // mainWindow.loadFile('./renderer/index.html')

  const mainWindow = new AppWindow({}, './renderer/index.html')

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.send('getTracks', myStore.getTracks())
  })
  
  ipcMain.on('add-music-window', (event, arg) => {
    // const addWindow = new BrowserWindow({
    //   width: 500,
    //   height: 400,
    //   webPreferences: {
    //     nodeIntegration: true
    //   },
    //   parent: mainWindow
    // })
    // addWindow.loadFile('./renderer/add.html')

    const addWindow = new AppWindow({
        width: 500,
        height: 400,
        parent: mainWindow
    }, './renderer/add.html')
  })

  ipcMain.on('add-tracks', (event, tracks) => {
    const updatedTracks = myStore.addTracks(tracks).getTracks()
    // 
    mainWindow.send('getTracks', updatedTracks)
  })

  ipcMain.on('delete-track', (event, id) => {
    const updateTracks = myStore.deleteTrack(id).getTracks()
    mainWindow.send('getTracks', updatedTracks)
  })

  ipcMain.on('open-music-file', (event) => {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{name: 'Music', extensions: ['mp3']}]
    }, (files) => {
      if (files) {
        event.sender.send('selected-file', files)
      }
    })
  })
  
})