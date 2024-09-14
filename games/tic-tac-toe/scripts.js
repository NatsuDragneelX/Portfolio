let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let gameMode = "twoPlayer"; // Default to two-player mode

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const gameMessage = document.getElementById("gameMessage");
const cells = document.querySelectorAll(".cell");

document.getElementById("twoPlayerMode").addEventListener("click", () => {
    gameMode = "twoPlayer";
    resetGame();
});

document.getElementById("computerEasyMode").addEventListener("click", () => {
    gameMode = "computerEasy";
    resetGame();
});

document.getElementById("computerHardMode").addEventListener("click", () => {
    gameMode = "computerHard";
    resetGame();
});

function handleCellClick(e) {
    const index = e.target.getAttribute("data-index");

    // Check if the clicked cell is empty and the game is active
    if (board[index] === "" && isGameActive && currentPlayer === "X") {
        board[index] = currentPlayer;
        e.target.innerText = currentPlayer;
        checkWinner();

        // If it's computer mode and the game is still active, trigger the AI move
        if (gameMode.startsWith("computer") && isGameActive) {
            switchPlayer();  // Switch to 'O' for the computer's turn
            setTimeout(() => {
                computerMove(gameMode);
            }, 500); // Small delay to make it feel more natural
        } else {
            switchPlayer();
        }
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    gameMessage.innerText = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const winCondition = winConditions[i];
        const a = board[winCondition[0]];
        const b = board[winCondition[1]];
        const c = board[winCondition[2]];

        if (a === "" || b === "" || c === "") {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameMessage.innerText = `Player ${currentPlayer} wins!`;
        isGameActive = false;
    } else if (!board.includes("")) {
        gameMessage.innerText = "It's a tie!";
        isGameActive = false;
    }
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    currentPlayer = "X";
    gameMessage.innerText = `Player X's turn`;

    cells.forEach(cell => {
        cell.innerText = "";
    });
}

function computerMove(difficulty) {
    let index;

    if (difficulty === "computerEasy") {
        // Easy AI: Random move
        do {
            index = Math.floor(Math.random() * 9);
        } while (board[index] !== "");
    } else if (difficulty === "computerHard") {
        // Hard AI: Use Minimax algorithm or strategic move
        index = findBestMove();
    }

    // Apply computer move if the game is still active
    if (isGameActive && board[index] === "") {
        board[index] = "O";
        cells[index].innerText = "O";
        checkWinner();
        if (isGameActive) {
            switchPlayer();  // Switch back to the human player's turn
        }
    }
}

function findBestMove() {
    // Simple placeholder for AI move (returns the first available spot)
    // You can implement a Minimax algorithm here for better AI.
    return board.findIndex(cell => cell === "");
}

cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

document.getElementById("resetGameButton").addEventListener("click", resetGame);
