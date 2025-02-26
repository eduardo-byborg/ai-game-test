const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Game variables
let score = 0;
let gameRunning = true;

// Load images
const playerImage = new Image();
playerImage.src = 'runner.png';
const chaserImage = new Image();
chaserImage.src = 'badguy.png';

// Player
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 50,
    speed: 5
};

// Chasers array
const chasers = [];
const CHASER_COUNT = 4;
const CHASER_SPEED = 2;

// Controls
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Event listeners
window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

// Initialize chasers
function initChasers() {
    for (let i = 0; i < CHASER_COUNT; i++) {
        spawnChaser();
    }
}

// Spawn a new chaser at a random position
function spawnChaser() {
    let x, y;
    const side = Math.floor(Math.random() * 4);
    
    switch(side) {
        case 0: // top
            x = Math.random() * canvas.width;
            y = -50;
            break;
        case 1: // right
            x = canvas.width + 50;
            y = Math.random() * canvas.height;
            break;
        case 2: // bottom
            x = Math.random() * canvas.width;
            y = canvas.height + 50;
            break;
        case 3: // left
            x = -50;
            y = Math.random() * canvas.height;
            break;
    }
    
    chasers.push({ x, y, size: 50 });
}

// Update player position
function updatePlayer() {
    if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
    if (keys.ArrowDown && player.y < canvas.height - player.size) player.y += player.speed;
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x < canvas.width - player.size) player.x += player.speed;
}

// Update chasers
function updateChasers() {
    chasers.forEach(chaser => {
        const dx = player.x - chaser.x;
        const dy = player.y - chaser.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        chaser.x += (dx / distance) * CHASER_SPEED;
        chaser.y += (dy / distance) * CHASER_SPEED;
        
        // Check collision
        if (checkCollision(player, chaser)) {
            gameOver();
        }
    });
}

// Check collision between two objects
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.size &&
           obj1.x + obj1.size > obj2.x &&
           obj1.y < obj2.y + obj2.size &&
           obj1.y + obj1.size > obj2.y;
}

// Draw functions
function drawPlayer() {
    ctx.save();
    ctx.drawImage(playerImage, player.x, player.y, player.size, player.size);
    ctx.restore();
}

function drawChasers() {
    chasers.forEach(chaser => {
        ctx.save();
        ctx.drawImage(chaserImage, chaser.x, chaser.y, chaser.size, chaser.size);
        ctx.restore();
    });
}

// Game over
function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = Math.floor(score);
    gameOverScreen.style.display = 'block';
}

// Restart game
function restartGame() {
    gameRunning = true;
    score = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    chasers.length = 0;
    initChasers();
    gameOverScreen.style.display = 'none';
    gameLoop();
}

// Main game loop
function gameLoop() {
    if (!gameRunning) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update game objects
    updatePlayer();
    updateChasers();
    
    // Draw game objects
    drawPlayer();
    drawChasers();
    
    // Update score
    score += 0.1;
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${Math.floor(score)}`, 10, 30);
    
    // Random chance to spawn new chaser
    if (Math.random() < 0.002) {
        spawnChaser();
    }
    
    requestAnimationFrame(gameLoop);
}

// Start the game
initChasers();
gameLoop();
