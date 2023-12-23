// Set up the canvas and its context
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

// Set up the audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
document.addEventListener('click', () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
});

// Load C5 file
let c5Buffer = null;
fetch('https://blodsvorr.github.io/SONIFORMS/C5.mp3')
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
        c5Buffer = audioBuffer;
    })
    .catch(error => console.error('Error loading audio file:', error));

// Orb data with 12 orbs
const orbData = [];
const baseFrequency = 523.25; // Frequency of C5
for (let i = 0; i < 12; i++) {
    const playbackRate = Math.pow(2, i / 12);
    // Gradient from indigo to purple
    const color = `hsl(${360 - i * 15}, 100%, 50%)`;
    orbData.push({
        color,
        orbitRadius: 75 + i * 10,
        period: 1 + i,
        playbackRate,
        angle: Math.PI / 2,
        lastRevolution: 0
    });
}

// Function to play the C5 sample at a specific playback rate
function playTone(playbackRate) {
    if (c5Buffer) {
        const source = audioContext.createBufferSource();
        source.buffer = c5Buffer;
        source.playbackRate.setValueAtTime(playbackRate, audioContext.currentTime);
        source.connect(audioContext.destination);
        source.start();
    } else {
        console.log('Audio buffer is not loaded yet.');
    }
}

// Function to start the animation and sound
function startAnimation() {
    if (!animationStarted) {
        animationStarted = true;
        animate();
    }
}

// Flag to prevent multiple initializations
let animationStarted = false;

// Function to animate orbs
function animate() {
    requestAnimationFrame(animate);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    orbData.forEach((data, index) => {
        // Update orb position
        data.angle -= 2 * Math.PI / data.period * 0.01;

        const x = canvas.width / 2 + data.orbitRadius * Math.cos(data.angle);
        const y = canvas.height / 2 + data.orbitRadius * Math.sin(data.angle);

        // Draw orb
        ctx.fillStyle = data.color;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Play tone on revolution completion
        const revolutions = Math.floor((2 * Math.PI - data.angle) / (2 * Math.PI));
        if (revolutions > data.lastRevolution) {
            playTone(data.playbackRate);
            data.lastRevolution = revolutions;
        }
    });
}

// Add event listeners to the canvas
canvas.addEventListener('click', startAnimation);
canvas.addEventListener('touchstart', startAnimation);


// LAST CODE REV, PRODUCED PREVIOUSLY BY CHAT GPT 4
//    WAS USED WITHT HE FOLLOWING PROMPT TO PRODUCE THE ABOVE REVISED CODE;
/*
Why is the sound not working in this code? 

// Set up the canvas and its context
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

// Set up the audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
if (audioContext.state === 'suspended') {
    audioContext.resume();
}

// Load C5 file
let c5Buffer = null;
fetch('https://blodsvorr.github.io/SONIFORMS/C5.mp3') // Replace with the actual path to your C5 WAV file
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
        c5Buffer = audioBuffer;
    });

// Orb data with 12 orbs
const orbData = [];
const baseFrequency = 523.25; // Frequency of C5
for (let i = 0; i < 12; i++) {
    const playbackRate = Math.pow(2, i / 12);
    const color = `hsl(${360 - i * 15}, 100%, 50%)`; // Gradient from indigo to purple
    orbData.push({ color, orbitRadius: 75 + i * 10, period: i, playbackRate, angle: Math.PI / 2 });
}

// Function to play the C5 sample at a specific playback rate
function playTone(playbackRate) {
    if (c5Buffer) {
        const source = audioContext.createBufferSource();
        source.buffer = c5Buffer;
        source.playbackRate.setValueAtTime(playbackRate, audioContext.currentTime);
        source.connect(audioContext.destination);
        source.start();
    }
}

// Function to start the animation and sound
function startAnimation() {
    if (animationStarted) return; // Prevent multiple initializations
    animationStarted = true;


// Function to animate orbs
function animate() {
    requestAnimationFrame(animate);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    orbData.forEach((data, index) => {
        // Update orb position
        data.angle -= 2 * Math.PI / data.period * 0.01; // Update angle for anticlockwise motion

        const x = canvas.width / 2 + data.orbitRadius * Math.cos(data.angle);
        const y = canvas.height / 2 + data.orbitRadius * Math.sin(data.angle);

        // Draw orb
        ctx.fillStyle = data.color;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Play tone on revolution completion
        const revolutions = Math.floor((2 * Math.PI - data.angle) / (2 * Math.PI));
        if (revolutions > data.lastRevolution) {
            playTone(data.playbackRate); // Play tone at specific playback rate
            data.lastRevolution = revolutions;
        }
    });
}
    animate();
}

// Add event listeners to the canvas
canvas.addEventListener('click', startAnimation);
canvas.addEventListener('touchstart', startAnimation);

// Flag to prevent multiple initializations
let animationStarted = false;

*/
