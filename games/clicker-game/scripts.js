let clickCount = 0;
let timeLeft = 10;
let level = 1;
let round = 1;
let timer;
let roundHistory = [];

function startGame() {
    clickCount = 0;
    document.getElementById('clickCount').innerText = `Clicks: ${clickCount}`;
    document.getElementById('level').innerText = `Level: ${level}`;
    timeLeft = Math.max(5, 10 - level); // Minimum 5 seconds
    document.getElementById('timeRemaining').innerText = `Time Left: ${timeLeft}s`;

    document.getElementById('clickButton').disabled = false;
    document.getElementById('performance-summary').style.display = 'none'; // Hide performance summary during the game
    document.getElementById('startGameButton').style.display = 'none'; // Hide the start button
    document.getElementById('restartGameButton').style.display = 'none'; // Hide the restart button during the game

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeRemaining').innerText = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function endGame() {
    document.getElementById('clickButton').disabled = true;
    document.getElementById('timeRemaining').innerText = `Time's up! You clicked ${clickCount} times.`;

    // Store the round's click count
    roundHistory.push(clickCount);
    
    // Every 5 rounds, show the performance summary
    if (round % 5 === 0) {
        showPerformanceSummary();
    }

    // Show the restart button after the game ends
    document.getElementById('restartGameButton').style.display = 'block';

    // Increase the level for the next round
    level++;
    round++;
    document.getElementById('level').innerText = `Level: ${level}`;
}

function showPerformanceSummary() {
    const totalClicks = roundHistory.reduce((acc, clicks) => acc + clicks, 0);
    const averageClicks = totalClicks / roundHistory.length;

    // Update the summary on the page
    document.getElementById('roundResults').innerText = `Rounds: ${roundHistory.join(", ")}`;
    document.getElementById('averageClicks').innerText = `Average Clicks: ${averageClicks.toFixed(2)}`;

    // Show the performance summary
    document.getElementById('performance-summary').style.display = 'block';

    // Reset round history every 5 rounds
    roundHistory = [];
}

function restartGame() {
    // Reset all game variables to initial values
    clickCount = 0;
    timeLeft = 10;
    level = 1;
    round = 1;
    roundHistory = [];
    
    document.getElementById('clickCount').innerText = `Clicks: ${clickCount}`;
    document.getElementById('timeRemaining').innerText = `Time Left: ${timeLeft}s`;
    document.getElementById('level').innerText = `Level: ${level}`;
    document.getElementById('performance-summary').style.display = 'none'; // Hide performance summary
    document.getElementById('restartGameButton').style.display = 'none'; // Hide the restart button
    document.getElementById('startGameButton').style.display = 'block'; // Show the start button to restart the game
}

// Handle button click
document.getElementById('clickButton').addEventListener('click', () => {
    clickCount++;
    document.getElementById('clickCount').innerText = `Clicks: ${clickCount}`;

    // Make the button move randomly at levels greater than 2
    if (level > 2) {
        moveButtonRandomly();
    }
});

function moveButtonRandomly() {
    const button = document.getElementById('clickButton');
    const gameContainer = document.getElementById('game-container');

    // Calculate random position within the game container
    const maxX = gameContainer.offsetWidth - button.offsetWidth;
    const maxY = gameContainer.offsetHeight - button.offsetHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    // Set the button to the new random position
    button.style.position = 'absolute';
    button.style.left = `${randomX}px`;
    button.style.top = `${randomY}px`;
}

// Event listeners for the start and restart buttons
document.getElementById('startGameButton').addEventListener('click', startGame);
document.getElementById('restartGameButton').addEventListener('click', restartGame);
