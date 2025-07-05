let board = Array(3).fill().map(() => Array(3).fill(''));
let currentPlayer = 'X';
let gameOver = false;
let scoreX = 0;
let scoreO = 0;
let nameX = 'Sai';
let nameO = 'Pookie';

const boardElement = document.getElementById('board');
const resultElement = document.getElementById('result');
const turnElement = document.getElementById('turn');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
const playerNames = document.getElementById('player-names');

const clickSound = document.getElementById('click-sound');
const winSound = document.getElementById('win-sound');
const drawSound = document.getElementById('draw-sound');

function startGame() {
  const xInput = document.getElementById('playerX').value.trim();
  const oInput = document.getElementById('playerO').value.trim();
  if (xInput) nameX = xInput;
  if (oInput) nameO = oInput;

  document.getElementById('game-area').classList.remove('hidden');
  document.querySelector('.player-input').classList.add('hidden');

  updateTurnText();
  updateScoreboard();
  renderBoard();
}

function renderBoard() {
  boardElement.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.textContent = board[i][j];
      cell.addEventListener('click', () => handleMove(i, j));
      boardElement.appendChild(cell);
    }
  }
}

function handleMove(row, col) {
  if (board[row][col] !== '' || gameOver) return;

  board[row][col] = currentPlayer;
  clickSound.play();
  renderBoard();

  if (checkWin()) {
    gameOver = true;
    if (currentPlayer === 'X') {
      resultElement.textContent = `${nameX} wins!`;
      scoreX++;
    } else {
      resultElement.textContent = `${nameO} wins!`;
      scoreO++;
    }
    updateScoreboard();
    winSound.play();
    launchConfetti();
  } else if (checkDraw()) {
    resultElement.textContent = `Match is Drawn!`;
    gameOver = true;
    drawSound.play();
    launchConfetti();
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnText();
    if (currentPlayer === 'O') setTimeout(aiMove, 250);
  }
}

function aiMove() {
  let empty = [];
  board.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell === '') empty.push([i, j]);
    })
  );
  if (empty.length > 0) {
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    handleMove(r, c);
  }
}

function updateTurnText() {
  turnElement.textContent = currentPlayer === 'X'
    ? `${nameX}'s Turn (X)`
    : `${nameO}'s Turn (O)`;
}

function updateScoreboard() {
  scoreXElement.textContent = scoreX;
  scoreOElement.textContent = scoreO;
  playerNames.textContent = `${nameX} vs ${nameO}`;
}

function checkWin() {
  for (let i = 0; i < 3; i++) {
    if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return true;
    if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) return true;
  }
  if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return true;
  if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return true;
  return false;
}

function checkDraw() {
  return board.flat().every(cell => cell !== '');
}

function resetGame() {
  board = Array(3).fill().map(() => Array(3).fill(''));
  currentPlayer = 'X';
  gameOver = false;
  resultElement.textContent = '';
  updateTurnText();
  renderBoard();
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
}

function launchConfetti() {
  const duration = 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 1000 };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    confetti(Object.assign({}, defaults, {
      particleCount: 50,
      origin: { x: Math.random(), y: Math.random() - 0.2 }
    }));
  }, 200);
}
let consecutiveX = 0;
let consecutiveO = 0;

function handleMove(row, col) {
  if (board[row][col] !== '' || gameOver) return;

  board[row][col] = currentPlayer;
  clickSound.play();
  renderBoard();

  if (checkWin()) {
    gameOver = true;
    if (currentPlayer === 'X') {
      resultElement.textContent = `${nameX} has won!`;
      scoreX++;
      consecutiveX++;
      consecutiveO = 0; // reset other player's consecutive wins
    } else {
      resultElement.textContent = `${nameO} wins!`;
      scoreO++;
      consecutiveO++;
      consecutiveX = 0;
    }
    updateScoreboard();
    winSound.play();
    launchConfetti();

    // Show exit button if someone got 3 consecutive wins
    if (consecutiveX === 2 || consecutiveO === 2) {
      document.getElementById('exit-btn').classList.remove('hidden');
      resultElement.textContent += " 🎉";
    } else {
      document.getElementById('exit-btn').classList.add('hidden');
    }
    
  } else if (checkDraw()) {
    resultElement.textContent = `Match is Drawn!`;
    gameOver = true;
    drawSound.play();
    launchConfetti();

    // Reset consecutive wins on draw
    consecutiveX = 0;
    consecutiveO = 0;
    document.getElementById('exit-btn').classList.add('hidden');
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnText();
    if (currentPlayer === 'O') setTimeout(aiMove, 250);
    document.getElementById('exit-btn').classList.add('hidden'); // Hide during ongoing game
  }
}

function resetGame() {
  board = Array(3).fill().map(() => Array(3).fill(''));
  currentPlayer = 'X';
  gameOver = false;
  resultElement.textContent = '';
  updateTurnText();
  renderBoard();
  document.getElementById('exit-btn').classList.add('hidden');
}

// Exit button handler
function exitGame() {
  alert("Thanks for playing! The game will now reset.");
  window.location.reload(); // You can also hide game UI instead of reload if you prefer
}
