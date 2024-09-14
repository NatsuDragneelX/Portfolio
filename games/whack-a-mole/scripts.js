let score = 0;
let timeLeft = 30;
let activeMole;
let gameTimer;
let moleTimer;

function startGame() {
    // Reset game state
    score = 0;
    timeLeft = 30;
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('timeRemaining').innerText = `Time Left: ${timeLeft}s`;

    // Start mole popping up at random intervals
    moleTimer = setInterval(randomMole, 1000);
    
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
}

function hitMole(e) {
    if (e.target.classList.contains('active')) {
        score++;
        document.getElementById('score').innerText = `Score: ${score}`;
        e.target.classList.remove('active');
    }
}

function endGame() {
    document.getElementById('timeRemaining').innerText = `Time's up! Your final score is ${score}.`;
}

document.querySelectorAll('.hole').forEach(hole => {
    hole.addEventListener('click', hitMole);
});

document.getElementById('startGameButton').addEventListener('click', startGame);
