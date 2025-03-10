let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let snake = [];
let food = {};
let direction = 'right';
let gameLoop;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameSpeed = 100;
let gameStartTime;
let isGameRunning = false;

// Initialize game
function initGame() {
    // Initial snake
    snake = [
        { x: 200, y: 200 },
        { x: 190, y: 200 },
        { x: 180, y: 200 },
    ];
    
    // Generate initial food
    generateFood();
    
    // Reset score
    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('highScore').textContent = highScore;
    
    // Reset direction
    direction = 'right';
    
    // Clear any existing game loop
    if (gameLoop) clearInterval(gameLoop);
}

// Generate food at random position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / 10)) * 10,
        y: Math.floor(Math.random() * (canvas.height / 10)) * 10
    };
    
    // Check if food spawned on snake
    let foodOnSnake = snake.some(segment => segment.x === food.x && segment.y === food.y);
    if (foodOnSnake) generateFood();
}

// Draw snake and food
function draw() {
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
        let gradient = ctx.createLinearGradient(segment.x, segment.y, segment.x + 10, segment.y + 10);
        if (index === 0) {
            // Head
            gradient.addColorStop(0, '#64ffda');
            gradient.addColorStop(1, '#00acc1');
        } else {
            // Body
            gradient.addColorStop(0, '#4CAF50');
            gradient.addColorStop(1, '#388E3C');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(segment.x, segment.y, 10, 10);
        
        // Add eyes to head
        if (index === 0) {
            ctx.fillStyle = '#000';
            switch(direction) {
                case 'up':
                    ctx.fillRect(segment.x + 2, segment.y + 2, 2, 2);
                    ctx.fillRect(segment.x + 6, segment.y + 2, 2, 2);
                    break;
                case 'down':
                    ctx.fillRect(segment.x + 2, segment.y + 6, 2, 2);
                    ctx.fillRect(segment.x + 6, segment.y + 6, 2, 2);
                    break;
                case 'left':
                    ctx.fillRect(segment.x + 2, segment.y + 2, 2, 2);
                    ctx.fillRect(segment.x + 2, segment.y + 6, 2, 2);
                    break;
                case 'right':
                    ctx.fillRect(segment.x + 6, segment.y + 2, 2, 2);
                    ctx.fillRect(segment.x + 6, segment.y + 6, 2, 2);
                    break;
            }
        }
    });
    
    // Draw food with glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#f44336';
    ctx.fillStyle = '#f44336';
    ctx.beginPath();
    ctx.arc(food.x + 5, food.y + 5, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

// Move snake
function move() {
    // Create new head
    let newHead = { x: snake[0].x, y: snake[0].y };
    
    // Move head
    switch(direction) {
        case 'up': newHead.y -= 10; break;
        case 'down': newHead.y += 10; break;
        case 'left': newHead.x -= 10; break;
        case 'right': newHead.x += 10; break;
    }
    
    // Check for collisions
    if (checkCollision(newHead)) {
        gameOver();
        return;
    }
    
    // Add new head
    snake.unshift(newHead);
    
    // Check if food eaten
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            document.getElementById('highScore').textContent = highScore;
        }
        generateFood();
        // Increase speed slightly
        if (gameLoop) {
            clearInterval(gameLoop);
            gameSpeed = Math.max(gameSpeed * 0.95, 50);
            gameLoop = setInterval(move, gameSpeed);
        }
    } else {
        // Remove tail
        snake.pop();
    }
    
    // Draw updated game state
    draw();
}

// Check for collisions
function checkCollision(head) {
    // Wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    
    // Self collision
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// Game over
function gameOver() {
    clearInterval(gameLoop);
    isGameRunning = false;
    
    // Calculate time played
    let timePlayedSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
    let minutes = Math.floor(timePlayedSeconds / 60);
    let seconds = timePlayedSeconds % 60;
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalHighScore').textContent = highScore;
    document.getElementById('timePlayed').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('gameOver').style.display = 'block';
}

// Start game
function startGame() {
    initGame();
    isGameRunning = true;
    gameStartTime = Date.now();
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('startBtn').style.display = 'none';
    gameLoop = setInterval(move, gameSpeed);
}

// Restart game
function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('startBtn').style.display = 'inline-block';
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;
    
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault(); // Prevent scrolling
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            e.preventDefault(); // Prevent scrolling
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            e.preventDefault(); // Prevent scrolling
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            e.preventDefault(); // Prevent scrolling
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Mobile controls
document.getElementById('upBtn').addEventListener('click', () => {
    if (isGameRunning && direction !== 'down') direction = 'up';
});
document.getElementById('downBtn').addEventListener('click', () => {
    if (isGameRunning && direction !== 'up') direction = 'down';
});
document.getElementById('leftBtn').addEventListener('click', () => {
    if (isGameRunning && direction !== 'right') direction = 'left';
});
document.getElementById('rightBtn').addEventListener('click', () => {
    if (isGameRunning && direction !== 'left') direction = 'right';
});

// Difficulty buttons
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (isGameRunning) return;
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameSpeed = parseInt(btn.dataset.speed);
    });
});

// Start button
document.getElementById('startBtn').addEventListener('click', startGame);

// Initial draw
draw(); 