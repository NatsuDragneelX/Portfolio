let score = 0;
let timeLeft = 30;
let activeMole;
let activeMoles = [];  // For multiple active moles in Ultimate Mode
let gameTimer;
let moleTimer;
let moleAppearanceSpeed = 1000;  // Start with 1 second for normal mode
let combo = 0;
let multiplier = 1;

function startGame() {
    // Reset game state
    score = 0;
    timeLeft = 30;
    moleAppearanceSpeed = 1000;  // Reset speed
    combo = 0;
    multiplier = 1;
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('timeRemaining').innerText = `Time Left: ${timeLeft}s`;

    // Start mole popping up at random intervals
    moleTimer = setInterval(randomMole, moleAppearanceSpeed);
    
    // Start countdown timer
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeRemaining').innerText = `Time Left: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            clearInterval(moleTimer);
            endGame();
        }
    }, 1000);
}

function startUltimateMode() {
    // Reset game state
    score = 0;
    timeLeft = 15;  // Shorter time for Ultimate Mode
    moleAppearanceSpeed = 600;  // Faster speed
    combo = 0;
    multiplier = 1;
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('timeRemaining').innerText = `Time Left: ${timeLeft}s`;

    // Start multiple moles popping up at random intervals
    moleTimer = setInterval(() => {
        for (let i = 0; i < 2; i++) {  // Show 2 moles at once
            randomMole();
        }
    }, moleAppearanceSpeed);
    
    // Start countdown timer
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeRemaining').innerText = `Time Left: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            clearInterval(moleTimer);
            endGame();
        }
    }, 1000);
}

function startTimerMode() {
    // Reset game state
    score = 0;
    timeLeft = 60;  // 60 seconds for Timer Mode
    moleAppearanceSpeed = 1000;  // Regular speed
    combo = 0;
    multiplier = 1;
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('timeRemaining').innerText = `Time Left: ${timeLeft}s`;

    // Start mole popping up at random intervals
    moleTimer = setInterval(randomMole, moleAppearanceSpeed);
    
    // Start countdown timer
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeRemaining').innerText = `Time Left: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            clearInterval(moleTimer);
            endGame();
        }
    }, 1000);
}

function randomMole() {
    if (activeMole) {
        activeMole.classList.remove('active');
    }

    const holes = document.querySelectorAll('.hole');
    const randomIndex = Math.floor(Math.random() * holes.length);
    activeMole = holes[randomIndex];
    activeMole.classList.add('active');
    
    // Level up: Increase speed every 10 points
    if (score % 10 === 0 && score !== 0) {
        moleAppearanceSpeed = Math.max(300, moleAppearanceSpeed - 100);  // Minimum speed of 300ms
        clearInterval(moleTimer);
        moleTimer = setInterval(randomMole, moleAppearanceSpeed);
    }
}

function hitMole(e) {
    if (e.target.classList.contains('active')) {
        combo++;
        multiplier = Math.min(3, Math.floor(combo / 5) + 1);  // Max multiplier of 3x
        score += 1 * multiplier;
        document.getElementById('score').innerText = `Score: ${score} (x${multiplier})`;
        e.target.classList.remove('active');
    } else {
        combo = 0;  // Reset combo on miss
        multiplier = 1;
    }
}

function endGame() {
    document.getElementById('timeRemaining').innerText = `Time's up! Your final score is ${score}.`;
    clearInterval(moleTimer);
    clearInterval(gameTimer);
}

// Event listeners for buttons and mole clicks
document.querySelectorAll('.hole').forEach(hole => {
    hole.addEventListener('click', hitMole);
});

document.getElementById('startGameButton').addEventListener('click', startGame);
document.getElementById('ultimateModeButton').addEventListener('click', startUltimateMode);
document.getElementById('timerModeButton').addEventListener('click', startTimerMode);
