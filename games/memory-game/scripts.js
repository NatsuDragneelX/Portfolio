const cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'];
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createCardGrid() {
    const cardGrid = document.getElementById('card-grid');
    cardGrid.innerHTML = ''; 
    shuffle(cardValues);

    cardValues.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-value', value);
        card.innerText = '?'; 
        card.addEventListener('click', flipCard);
        cardGrid.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
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
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
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

document.getElementById('startMemoryGame').addEventListener('click', createCardGrid);
