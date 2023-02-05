const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb= $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const volume = $('#volume')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn= $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isMuted: false,
    songs: [
        {
            name: 'Hayya Hayya',
            singer: 'Trinidad Cardona, Davido, Aisha',
            path: './assets/music/Hayya Hayya Better Together.mp3',
            image: './assets/img/hayya hayya.jpg'
        },
        {
            name: 'Light The Sky',
            singer: 'Nora Fatehi, Balqees, Rahma Riad, Manal & RedOne',
            path: './assets/music/Light The Sky.mp3',
            image:'./assets/img/Light the sky.jpg'
        },
        {
            name: 'Arhbo',
            singer: 'Ozuna & GIMS',
            path: './assets/music/Arhbo.mp3',
            image: './assets/img/arhbo.jpg'
        },
        {
            name: 'Dreamers',
            singer: '정국 Jung Kook (of BTS), Fahad Al Kubaisi',
            path: './assets/music/Dreamers.mp3',
            image: './assets/img/dreamers.jpg'
        },
        {
            name: 'Magic In The Air',
            singer: 'Magic System & Chawki',
            path: './assets/music/Magic In The Air.mp3',
            image: './assets/img/magic in the air.jpg'
        },
        {
            name: 'La La La',
            singer: 'Shakira',
            path: './assets/music/La La La.mp3',
            image: './assets/img/lalala.jpg'
        },
        {
            name: 'Waka Waka',
            singer: 'Shakira',
            path: './assets/music/wakawaka.mp3',
            image: './assets/img/wakawaka.jpg'
        },
        
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return  `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('\n')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        _this = this
        const cdWidth = cd.offsetWidth

        const cdThumbAnimated = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimated.pause()
        document.onscroll = function(){
            const scrollTop = document.documentElement.scrollTop || window.scrollY
            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0
            cd.style.opacity = newCdWidth / cdWidth
        }


        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()

            }
        }
        audio.onplay = function() { 
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimated.play()
        }
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimated.pause()
        }

        audio.ontimeupdate = function() { 
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        
        progress.onchange = function(e) {
            const seekTime = e.target.value/100 * audio.duration
            audio.currentTime = seekTime
        }

        volume.onchange = function(e) {
            const volumeAmount = e.target.value/100
            audio.volume = volumeAmount  
        }

        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else{
                _this.nextSong();
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        prevBtn.onclick = function() {
            if(_this.isRandom) {
            _this.playRandomSong()                
            }else{
            _this.prevSong();
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                if(e.target.closest('.option')) {

                }
            }
        }
    },
    scrollToActiveSong: function() {
        if(this.currentIndex == 0) {
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }, 300)      
        } else {
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                })
            }, 300) 
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() { 
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() { 
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        
        this.loadCurrentSong()
    },
    start: function() {
        this.defineProperties()

        this.handleEvent()

        this.loadCurrentSong()

        this.render()
    }
}
app.start()