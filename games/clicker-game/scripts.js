let clickCount = 0;
let timeLeft = 10;
let timer;

function startGame() {
    // Reset the game state
    clickCount = 0;
    timeLeft = 10;
    document.getElementById('clickCount').innerText = `Clicks: ${clickCount}`;
    document.getElementById('timeRemaining').innerText = `Time Left: ${timeLeft}s`;

    // Enable the click button
    document.getElementById('clickButton').disabled = false;

    // Start the countdown timer
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeRemaining').innerText = `Time Left: ${timeLeft}s`;

        // End the game when time runs out
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function endGame() {
    // Disable the click button
    document.getElementById('clickButton').disabled = true;
    document.getElementById('timeRemaining').innerText = `Time's up! You clicked ${clickCount} times.`;
}

document.getElementById('clickButton').addEventListener('click', () => {
    clickCount++;
    document.getElementById('clickCount').innerText = `Clicks: ${clickCount}`;
});

document.getElementById('startGameButton').addEventListener('click', startGame);
