class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.aiMode = false;
        this.aiDifficulty = 'easy';
        this.scores = {
            X: parseInt(localStorage.getItem('tictactoeScoreX')) || 0,
            O: parseInt(localStorage.getItem('tictactoeScoreO')) || 0
        };

        // DOM Elements
        this.cells = document.querySelectorAll('[data-cell]');
        this.statusDisplay = document.getElementById('status');
        this.restartButton = document.getElementById('restartBtn');
        this.aiModeButton = document.getElementById('aiModeBtn');
        this.aiControls = document.getElementById('aiControls');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
        this.scoreXDisplay = document.getElementById('scoreX');
        this.scoreODisplay = document.getElementById('scoreO');

        // Event Listeners
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });

        this.restartButton.addEventListener('click', () => this.restartGame());
        this.aiModeButton.addEventListener('click', () => this.toggleAIMode());
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.gameActive) {
                    this.difficultyBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.aiDifficulty = btn.dataset.difficulty;
                }
            });
        });

        // Initialize game
        this.updateScoreDisplay();
        this.updateStatus();
    }

    handleCellClick(index) {
        if (!this.gameActive || this.board[index] !== '') return;

        this.makeMove(index);

        if (this.gameActive && this.aiMode && this.currentPlayer === 'O') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;
        this.cells[index].classList.add(this.currentPlayer.toLowerCase());

        if (this.checkWin()) {
            this.handleWin();
            return;
        }

        if (this.checkDraw()) {
            this.handleDraw();
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
    }

    makeAIMove() {
        if (!this.gameActive) return;
        
        let move;
        switch(this.aiDifficulty) {
            case 'hard':
                move = this.getBestMove();
                break;
            case 'medium':
                move = Math.random() < 0.7 ? this.getBestMove() : this.getRandomMove();
                break;
            default: // easy
                move = this.getRandomMove();
        }
        
        if (move !== null) {
            setTimeout(() => {
                this.makeMove(move);
                if (this.checkWin()) {
                    this.handleWin();
                } else if (this.checkDraw()) {
                    this.handleDraw();
                } else {
                    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                    this.updateStatus();
                }
            }, 200);
        }
    }

    getRandomMove() {
        const availableMoves = this.board.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);
        
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    getBestMove() {
        let bestScore = -Infinity;
        let bestMove = null;
        
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                let score = this.minimax(this.board, 0, false);
                this.board[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }

    minimax(board, depth, isMaximizing) {
        const scores = {
            O: 1,
            X: -1,
            draw: 0
        };
        
        let result = this.checkGameResult();
        if (result !== null) {
            return scores[result];
        }
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    checkGameResult() {
        for (let player of ['X', 'O']) {
            if (this.checkWin()) {
                return player;
            }
        }
        
        if (this.board.every(cell => cell !== '')) {
            return 'draw';
        }
        
        return null;
    }

    checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return this.board[a] !== '' &&
                   this.board[a] === this.board[b] &&
                   this.board[a] === this.board[c];
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    handleWin() {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        this.updateScoreDisplay();
        this.updateStatus(`Player ${this.currentPlayer} wins!`);
        this.highlightWinner();
    }

    handleDraw() {
        this.gameActive = false;
        this.updateStatus("It's a draw!");
    }

    highlightWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] !== '' &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]) {
                this.cells[a].classList.add('winner');
                this.cells[b].classList.add('winner');
                this.cells[c].classList.add('winner');
                break;
            }
        }
    }

    updateStatus(message) {
        this.statusDisplay.textContent = message || `Player ${this.currentPlayer}'s turn`;
    }

    updateScoreDisplay() {
        this.scoreXDisplay.textContent = this.scores.X;
        this.scoreODisplay.textContent = this.scores.O;
        localStorage.setItem('tictactoeScoreX', this.scores.X);
        localStorage.setItem('tictactoeScoreO', this.scores.O);
    }

    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });
        this.updateStatus();
    }

    toggleAIMode() {
        this.aiMode = !this.aiMode;
        this.aiModeButton.classList.toggle('active');
        this.aiControls.style.display = this.aiMode ? 'flex' : 'none';
        this.restartGame();
    }
}

// Initialize game
const game = new TicTacToe(); 