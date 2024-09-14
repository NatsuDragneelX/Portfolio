const easyValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'];
const mediumValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F'];
const hardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];

let cardValues = easyValues; // Default is easy
let theme = 'letters';
let timer;
let seconds = 0;
let flipCount = 0;
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function setDifficulty(level) {
    if (level === 'easy') {
        cardValues = easyValues;
    } else if (level === 'medium') {
        cardValues = mediumValues;
    } else if (level === 'hard') {
        cardValues = hardValues;
    }
    createCardGrid();
    startTimer(); // Start the timer once difficulty is selected
}

function createCardGrid() {
    const cardGrid = document.getElementById('card-grid');
    cardGrid.innerHTML = ''; 
    shuffle(cardValues);

    cardValues.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-value', value);

        if (theme === 'letters') {
            card.innerText = '?';
        } else if (theme === 'numbers') {
            card.innerText = value.charCodeAt(0) - 64; // Convert A to 1, B to 2, etc.
        } else if (theme === 'images') {
            card.style.backgroundImage = `url('path-to-images/${value}.jpg')`; // Add images for matching
        }

        card.addEventListener('click', flipCard);
        cardGrid.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    flipCount++;
    this.innerText = this.getAttribute('data-value');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    if (firstCard.getAttribute('data-value') === secondCard.getAttribute('data-value')) {
        disableCards();
        if (document.querySelectorAll('.card:not([data-matched])').length === 0) {
            stopTimer();
            alert(`Congrats! You finished the game in ${seconds} seconds with ${flipCount} flips!`);
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.setAttribute('data-matched', 'true');
    secondCard.setAttribute('data-matched', 'true');
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.innerText = '?';
        secondCard.innerText = '?';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function startTimer() {
    seconds = 0;
    flipCount = 0;
    document.getElementById('timer').innerText = `Time: ${seconds} seconds`;
    timer = setInterval(() => {
        seconds++;
        document.getElementById('timer').innerText = `Time: ${seconds} seconds`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

document.getElementById('easyDifficulty').addEventListener('click', () => setDifficulty('easy'));
document.getElementById('mediumDifficulty').addEventListener('click', () => setDifficulty('medium'));
document.getElementById('hardDifficulty').addEventListener('click', () => setDifficulty('hard'));

document.getElementById('themeSelect').addEventListener('change', function() {
    theme = this.value;
    createCardGrid(); // Restart the game with the new theme
});

document.getElementById('hintButton').addEventListener('click', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.innerText = card.getAttribute('data-value'));
    setTimeout(() => {
        cards.forEach(card => {
            if (!card.classList.contains('matched')) {
                card.innerText = '?';
            }
        });
    }, 1000); // Show hint for 1 second
});
