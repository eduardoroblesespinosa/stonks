const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sounds = {};

async function loadSound(name, url) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        sounds[name] = audioBuffer;
    } catch (error) {
        console.error(`Failed to load sound: ${name}`, error);
    }
}

export function initAudio() {
    // Preload all sounds
    loadSound('spin', './spin.mp3');
    loadSound('win', './win.mp3');
    loadSound('lose', './lose.mp3');
    loadSound('purchase', './purchase.mp3');
}

export function playSound(name) {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    if (sounds[name]) {
        const source = audioContext.createBufferSource();
        source.buffer = sounds[name];
        source.connect(audioContext.destination);
        source.start(0);
    }
}

