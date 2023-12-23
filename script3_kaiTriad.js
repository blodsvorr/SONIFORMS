// ... (Previous code)

// Function to draw orbs with tails
function drawOrbsWithTails() {
    requestAnimationFrame(drawOrbsWithTails);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    orbData.forEach((data, index) => {
        // Update orb position and tail
        data.angle -= 1.5 * (2 * Math.PI / data.period * 0.01);

        const x = canvas.width / 2 + data.orbitRadius * Math.cos(data.angle);
        const y = canvas.height / 2 + data.orbitRadius * Math.sin(data.angle);

        // Draw orb with fading tail
        for (let i = data.tail.length - 1; i >= 0; i--) {
            const tailOpacity = 1 - (i / data.tail.length) * 0.7; // Gradual tail opacity
            ctx.fillStyle = `rgba(${data.color},${tailOpacity})`;
            ctx.beginPath();
            ctx.arc(data.tail[i].x, data.tail[i].y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Play tone on revolution completion
        const revolutions = Math.floor((2 * Math.PI - data.angle) / (2 * Math.PI));
        if (revolutions > data.lastRevolution) {
            playTone(data.playbackRate);
            data.lastRevolution = revolutions;

            // Temporarily increase size and brightness
            data.size = 10;
            data.brightness = 100;
        } else {
            // Gradually reduce size and brightness
            data.size *= 0.95;
            data.brightness *= 0.95;
        }

        // Draw the current orb
        ctx.fillStyle = `hsl(${data.color},${data.brightness}%,50%)`;
        ctx.beginPath();
        ctx.arc(x, y, data.size, 0, 2 * Math.PI);
        ctx.fill();

        // Update tail positions
        data.tail.push({ x, y });
        if (data.tail.length > 30) {
            data.tail.shift(); // Remove the oldest tail position
        }
    });
}

// Initialize tail arrays for orbs
orbData.forEach((data) => {
    data.tail = [];
});

// Add event listeners to the canvas
canvas.addEventListener('click', startAnimation);
canvas.addEventListener('touchstart', startAnimation);

// Start the modified animation
drawOrbsWithTails();