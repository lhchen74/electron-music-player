const {ipcRenderer} = require('electron')
const { $, converDuration } = require('./helper')

// document.getElementById('add-music-button').addEventListener('click', () => {
//     ipcRenderer.send('add-music-window')
// })

let musicAudio = new Audio()
let allTracks
let currentTrack

$('add-music-button').addEventListener('click', () => {
    ipcRenderer.send('add-music-window')
})


const renderListHtml = (tracks) => {
    const tracksList = $('tracksList')
    const tracksListHtml = tracks.reduce((html, track) => {
        html += `<li class="row music-track list-group-item d-flex justify-content-between align-items-center">
            <div class="col-10">
                <i class="fas fa-music mr-2 text-secondary"></i>
                <b>${track.fileName}</b>
            </div>
            <div class="col-2">
                <i class="fas fa-play mr-3" data-id="${track.id}"></i>
                <i class="fas fa-trash-alt" data-id="${track.id}"></i>
            </div>
        </li>`
        return html
    }, '')

    const emptyTrackHtml = '<div class="alert alert-primary">还没有添加任何音乐</div>'
    tracksList.innerHTML = tracks.length ?  `<ul class="list-group">${tracksListHtml}</ul>` : emptyTrackHtml
}


ipcRenderer.on('getTracks', (event, tracks) => {
    allTracks = tracks
    renderListHtml(tracks)
})

$('tracksList').addEventListener('click', (event) => {
    event.preventDefault()
    // The dataset property on the HTMLElement interface provides read/write access to all the custom data attributes (data-*) set on the element. 
    // The Element.classList is a read-only property that returns a live DOMTokenList collection of the class attributes of the element.
    const {dataset, classList} = event.target
    const id = dataset && dataset.id
    if (id && classList.contains('fa-play')) {
        // 播放音乐
        if (currentTrack && currentTrack.id === id) { // currentTrack 不为空并且 id 等于点击 play 的 id
            // 继续播放音乐
            musicAudio.play()
        } else {
            // 播放新的音乐
            currentTrack = allTracks.find(track => track.id === id)
            musicAudio.src = currentTrack.path
            musicAudio.play()
            // 重置之前在播放的音乐状态
            const resetIconEle = document.querySelector('.fa-pause')
            if (resetIconEle) {
                resetIconEle.classList.replace('fa-pause', 'fa-play')
            }
        }
        classList.replace('fa-play', 'fa-pause')
    } else if (id && classList.contains('fa-pause')) {
        musicAudio.pause()
        classList.replace('fa-pause', 'fa-play')
    } else if (id && classList.contains('fa-trash-alt')) {
        // 删除音乐
        ipcRenderer.send('delete-track', id)
    }
})


const renderPlayHtml = (name, duration) => {
    const player = $('player-status') 
    const html = `<div class="col font-weight-bold">
                    正在播放: ${name} 
                  </div>
                  <div class="col">
                    <span id="current-seeker">00:00</span> / ${converDuration(duration)}
                  </div>`
    player.innerHTML = html
}

const updateProgressHtml = (currentTime,  duration) => {
    const currentSeeker = $('current-seeker')
    currentSeeker.innerHTML = converDuration(currentTime)
    // progress bar
    const progress = Math.floor(currentTime / duration * 100) + "%"
    const progressBar = $('progress-status')
    progressBar.innerHTML = progress 
    // progressBar.style = `width: ${pregress}`
    progressBar.style.width = progress
}

musicAudio.addEventListener('loadedmetadata', () => {
    // 渲染播放器状态
    renderPlayHtml(currentTrack.fileName, musicAudio.duration)
})

musicAudio.addEventListener('timeupdate', () => {
    // 更新播放器状态
    updateProgressHtml(musicAudio.currentTime, musicAudio.duration)
})