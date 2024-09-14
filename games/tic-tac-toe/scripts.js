let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
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

function handleCellClick(e) {
    const index = e.target.getAttribute("data-index");

    if (board[index] === "" && isGameActive) {
        board[index] = currentPlayer;
        e.target.innerText = currentPlayer;
        checkWinner();
        switchPlayer();
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

cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

document.getElementById("resetGameButton").addEventListener("click", resetGame);
