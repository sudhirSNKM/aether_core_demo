import './style.css'
import Experience from './Experience/Experience.js'

const experience = new Experience(document.querySelector('canvas#webgl'))

// Countdown Timer Logic
const countdownEl = document.getElementById('countdown')
let time = 4 * 60 * 60 + 23 * 60 + 15 // 4h 23m 15s in seconds

setInterval(() => {
    time--
    if (time < 0) time = 0

    const h = Math.floor(time / 3600).toString().padStart(2, '0')
    const m = Math.floor((time % 3600) / 60).toString().padStart(2, '0')
    const s = (time % 60).toString().padStart(2, '0')

    countdownEl.innerText = `${h}:${m}:${s}`
}, 1000)
