const {ipcRenderer} = require('electron')
const { $ } = require('./helper')
const path  = require('path')

let musicTracks = []

$('select-music').addEventListener('click', () => {
    ipcRenderer.send('open-music-file')
})

$('add-music').addEventListener('click', () => {
    ipcRenderer.send('add-tracks', musicTracks)
})

const renderListHtml = (pathes) => {
    const musicList = $('music-list')
    const musicItemsList = pathes.reduce((html, music) => {
        html += `<li class="list-group-item">${path.basename(music)}</li>`
        return html
    }, '')

    musicList.innerHTML = `<ul class="list-group">${musicItemsList}</ul>`
}

ipcRenderer.on('selected-file', (event, pathes) => {
    if (Array.isArray(pathes)) {
        musicTracks = pathes
        renderListHtml(pathes)
    }
})

