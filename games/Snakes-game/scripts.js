const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20; // Size of each grid square
let snake = [{ x: 160, y: 160 }]; // Initial position of the snake
let food = { x: 80, y: 80 }; // Initial position of the food
let dx = gridSize; // Move snake by one grid size in x direction
let dy = 0; // No movement in the y direction initially
let score = 0;
let gameOver = false;
let speed = 100; // Speed of the game (ms between movements)
let level = 1; // Start at level 1
let borderEnabled = true; // Enable borders by default
let lastRenderTime = 0;
const levelUpPoints = 5; // Points required to level up

// Increase difficulty by speeding up the game
function increaseDifficulty() {
    level++;
    speed -= 10; // Increase speed (reduce delay)
    document.getElementById('level').innerText = `Level: ${level}`;
}

// Game loop using requestAnimationFrame
function drawGame(currentTime) {
    if (gameOver) return;

    window.requestAnimationFrame(drawGame);

    const secondsSinceLastRender = (currentTime - lastRenderTime) / speed;
    if (secondsSinceLastRender < 1) return;

    lastRenderTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the snake
    snake.forEach(part => {
        ctx.fillStyle = '#00acc1';
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Move the snake
    moveSnake();

    // Check for collisions
    checkCollisions();
}

// Move the snake in the current direction
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // If the snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').innerText = `Score: ${score}`;

        // Level up every 5 points
        if (score % levelUpPoints === 0) {
            increaseDifficulty();
        }

        generateFood();
    } else {
        snake.pop(); // Remove the tail
    }
}

// Listen for key presses to change direction
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -gridSize;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -gridSize;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = gridSize;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = gridSize;
    }
}

// Toggle borders
document.getElementById('border-toggle').addEventListener('change', (event) => {
    borderEnabled = event.target.checked;
});

// Check for collisions with the wall or self
function checkCollisions() {
    const head = snake[0];

    if (borderEnabled) {
        // Check if the snake hits the wall
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            endGame();
        }
    } else {
        // Wrap around if borders are disabled
        if (head.x < 0) head.x = canvas.width - gridSize;
        if (head.x >= canvas.width) head.x = 0;
        if (head.y < 0) head.y = canvas.height - gridSize;
        if (head.y >= canvas.height) head.y = 0;
    }

    // Check if the snake collides with itself
    for (let i = 4; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

// Generate food at a random position
function generateFood() {
    food.x = Math.floor((Math.random() * canvas.width) / gridSize) * gridSize;
    food.y = Math.floor((Math.random() * canvas.height) / gridSize) * gridSize;
}

// End the game and show the game-over menu
function endGame() {
    gameOver = true;
    document.getElementById('final-score').innerText = score;
    const gameOverMenu = document.getElementById('game-over-menu');
    gameOverMenu.classList.add('visible');
}

// Restart the game
document.getElementById('restart-btn').addEventListener('click', () => {
    snake = [{ x: 160, y: 160 }];
    dx = gridSize;
    dy = 0;
    score = 0;
    level = 1;
    speed = 100;
    document.getElementById('score').innerText = 'Score: 0';
    document.getElementById('level').innerText = 'Level: 1';
    gameOver = false;
    generateFood();
    document.getElementById('game-over-menu').classList.remove('visible');
    window.requestAnimationFrame(drawGame);
});

// Start the game
window.requestAnimationFrame(drawGame);
