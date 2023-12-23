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
        playTone(1); // Play tone at the start of the animation
    })
    .catch(error => console.error('Error loading audio file:', error));

// Orb data with 12 orbs
const orbData = [];
for (let i = 0; i < 12; i++) {
    const playbackRate = Math.pow(2, i / 12);
    // Gradient from indigo to purple
    const color = `hsl(${360 - i * 15}, 100%, 50%)`;
    orbData.push({
        color,
        orbitRadius: 75 + i * 10,
        period: 1 + i,
        playbackRate,
        angle: 0,
        lastRevolution: 0,
        direction: 1, // 1 for counterclockwise, -1 for clockwise
        transitionProgress: 0
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
        data.transitionProgress += 0.01;
        if (data.transitionProgress > 1) {
            data.transitionProgress = 1;
        }

        let angleIncrement = 2 * Math.PI / data.period * 0.01 * data.direction;
        angleIncrement *= (1 - Math.cos(Math.PI * data.transitionProgress)) / 2; // Ease in and out

        data.angle += angleIncrement;

        if (data.angle >= Math.PI || data.angle <= 0) {
            if (data.transitionProgress === 1) {
                data.angle = data.angle >= Math.PI ? Math.PI : 0;
                data.direction *= -1;
                playTone(data.playbackRate);
                data.transitionProgress = 0;
            }
        }

        const x = canvas.width / 2 + data.orbitRadius * Math.cos(data.angle);
        const y = canvas.height / 2 + data.orbitRadius * Math.sin(data.angle);

        // Draw orb
        ctx.fillStyle = data.color;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Add event listeners to the canvas
canvas.addEventListener('click', startAnimation);
canvas.addEventListener('touchstart', startAnimation);
