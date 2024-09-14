const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerWidth = 50;
const playerHeight = 50;
let playerX = (canvas.width - playerWidth) / 2;
let playerY = canvas.height - playerHeight - 10;
let playerSpeed = 5;

let fallingObjects = [];
let isGameRunning = false;
let gameLoop;

function createFallingObject() {
    const size = Math.random() * 30 + 20;
    const x = Math.random() * (canvas.width - size);
    fallingObjects.push({ x, y: -size, size });
}

function movePlayer(event) {
    if (event.key === 'ArrowLeft' && playerX > 0) {
        playerX -= playerSpeed;
    } else if (event.key === 'ArrowRight' && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    }
}

function updateObjects() {
    for (let i = 0; i < fallingObjects.length; i++) {
        const obj = fallingObjects[i];
        obj.y += 3;

        // Check if the player collides with a falling object
        if (obj.y + obj.size >= playerY && obj.x < playerX + playerWidth && obj.x + obj.size > playerX) {
            endGame();
            return;
        }

        // Remove object if it goes out of bounds
        if (obj.y > canvas.height) {
            fallingObjects.splice(i, 1);
        }
    }
}

function drawObjects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = '#00bcd4';
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

    // Draw falling objects
    ctx.fillStyle = '#ff4081';
    fallingObjects.forEach(obj => {
        ctx.fillRect(obj.x, obj.y, obj.size, obj.size);
    });
}

function gameLoopFunc() {
    updateObjects();
    drawObjects();

    if (isGameRunning) {
        requestAnimationFrame(gameLoopFunc);
    }
}

function startGame() {
    fallingObjects = [];
    isGameRunning = true;
    document.getElementById('gameMessage').innerText = 'Avoid the falling objects!';
    createFallingObject();

    gameLoop = setInterval(createFallingObject, 1000);
    gameLoopFunc();
}

function endGame() {
    isGameRunning = false;
    clearInterval(gameLoop);
    document.getElementById('gameMessage').innerText = 'Game Over! Press Start to play again.';
}

document.addEventListener('keydown', movePlayer);
document.getElementById('startGameButton').addEventListener('click', () => {
    if (!isGameRunning) {
        startGame();
    }
});
