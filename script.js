const CONFIG = {
  COLS: 10,
  ROWS: 20,
  NEXT_SIZE: 4,
  LINES_PER_LEVEL: 10,
  BASE_DROP_MS: 1000,
  MIN_DROP_MS: 100,
};

const GAME_STATE = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
};

const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

const PIECES = {
  I: [
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
    [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
    [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
  ],
  O: [
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
  ],
  T: [
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
    [[0, 1, 0], [1, 1, 0], [0, 1, 0]],
  ],
  S: [
    [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
    [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
    [[1, 0, 0], [1, 1, 0], [0, 1, 0]],
  ],
  Z: [
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
    [[0, 1, 0], [1, 1, 0], [1, 0, 0]],
  ],
  J: [
    [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
    [[0, 1, 0], [0, 1, 0], [1, 1, 0]],
  ],
  L: [
    [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
    [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
    [[1, 1, 0], [0, 1, 0], [0, 1, 0]],
  ],
};

const SPAWN_X = { I: 3, O: 4, T: 3, S: 3, Z: 3, J: 3, L: 3 };

const KICKS_JLSTZ = {
  '0>1': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '1>2': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  '2>3': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '3>0': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '0>3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  '1>0': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '2>1': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '3>2': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
};

const KICKS_I = {
  '0>1': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
  '1>2': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
  '2>3': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
  '3>0': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
  '0>3': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
  '1>0': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
  '2>1': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
  '3>2': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
};

const LINE_SCORES = { 1: 100, 2: 300, 3: 500, 4: 800 };

let board;
let currentPiece;
let nextPiece;
let score;
let level;
let lines;
let gameState;
let lastTime = 0;
let dropCounter = 0;
let animationId = null;

function createBoard() {
  return Array.from({ length: CONFIG.ROWS }, () => Array(CONFIG.COLS).fill(0));
}

function randomPieceType() {
  return PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
}

function createPiece(type) {
  return {
    type,
    rotation: 0,
    shape: PIECES[type][0],
    x: SPAWN_X[type],
    y: 0,
  };
}

function collides(piece, boardState, offsetX = 0, offsetY = 0, rotation = piece.rotation) {
  const shape = PIECES[piece.type][rotation];
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (!shape[row][col]) continue;
      const x = piece.x + col + offsetX;
      const y = piece.y + row + offsetY;
      if (x < 0 || x >= CONFIG.COLS || y >= CONFIG.ROWS) return true;
      if (y >= 0 && boardState[y][x]) return true;
    }
  }
  return false;
}

function merge(piece, boardState) {
  const shape = piece.shape;
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (!shape[row][col]) continue;
      const y = piece.y + row;
      const x = piece.x + col;
      if (y >= 0 && y < CONFIG.ROWS && x >= 0 && x < CONFIG.COLS) {
        boardState[y][x] = piece.type;
      }
    }
  }
}

function clearLines(boardState) {
  let cleared = 0;
  for (let row = CONFIG.ROWS - 1; row >= 0; row--) {
    if (boardState[row].every((cell) => cell !== 0)) {
      boardState.splice(row, 1);
      boardState.unshift(Array(CONFIG.COLS).fill(0));
      cleared++;
      row++;
    }
  }
  return cleared;
}

function getDropInterval() {
  const ms = CONFIG.BASE_DROP_MS - (level - 1) * 80;
  return Math.max(CONFIG.MIN_DROP_MS, ms);
}

function addLineScore(cleared) {
  if (cleared > 0) {
    score += (LINE_SCORES[cleared] || cleared * 100) * level;
    lines += cleared;
    level = Math.floor(lines / CONFIG.LINES_PER_LEVEL) + 1;
  }
}

function spawnPiece() {
  currentPiece = nextPiece || createPiece(randomPieceType());
  nextPiece = createPiece(randomPieceType());
  if (collides(currentPiece, board)) {
    gameState = GAME_STATE.GAME_OVER;
    updateOverlays();
  }
}

function lockPiece() {
  merge(currentPiece, board);
  const cleared = clearLines(board);
  addLineScore(cleared);
  spawnPiece();
  updateHUD();
}

function tryMove(dx, dy) {
  if (!collides(currentPiece, board, dx, dy)) {
    currentPiece.x += dx;
    currentPiece.y += dy;
    return true;
  }
  return false;
}

function rotatePiece(direction = 1) {
  if (currentPiece.type === 'O') return;

  const from = currentPiece.rotation;
  const to = (from + direction + 4) % 4;
  const kickKey = `${from}>${to}`;
  const kicks = currentPiece.type === 'I' ? KICKS_I[kickKey] : KICKS_JLSTZ[kickKey];

  for (const [kx, ky] of kicks) {
    if (!collides(currentPiece, board, kx, ky, to)) {
      currentPiece.rotation = to;
      currentPiece.shape = PIECES[currentPiece.type][to];
      currentPiece.x += kx;
      currentPiece.y += ky;
      return true;
    }
  }
  return false;
}

function softDrop() {
  if (tryMove(0, 1)) {
    score += 1;
    dropCounter = 0;
    updateHUD();
    return true;
  }
  lockPiece();
  return false;
}

function hardDrop() {
  let distance = 0;
  while (tryMove(0, 1)) {
    distance++;
  }
  score += distance * 2;
  lockPiece();
  updateHUD();
}

function drawPiece(boardState, piece) {
  const display = boardState.map((row) => [...row]);
  const { shape, x, y, type } = piece;

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (!shape[row][col]) continue;
      const boardY = y + row;
      const boardX = x + col;
      if (boardY >= 0 && boardY < CONFIG.ROWS && boardX >= 0 && boardX < CONFIG.COLS) {
        display[boardY][boardX] = type;
      }
    }
  }
  return display;
}

function ensureGridCells(container, rows, cols, cellClass) {
  const total = rows * cols;
  if (container.children.length === total) return;

  container.replaceChildren();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('div');
      cell.className = cellClass;
      cell.dataset.row = row;
      cell.dataset.col = col;
      container.appendChild(cell);
    }
  }
}

function updateGridCells(container, grid, cols) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = container.children[row * cols + col];
      const value = grid[row][col];
      cell.className = value ? `cell ${value}` : 'cell';
    }
  }
}

function renderBoard(display) {
  const boardEl = document.getElementById('game-board');
  ensureGridCells(boardEl, CONFIG.ROWS, CONFIG.COLS, 'cell');
  updateGridCells(boardEl, display, CONFIG.COLS);
}

function renderNext() {
  const nextEl = document.getElementById('next-board');
  const grid = Array.from({ length: CONFIG.NEXT_SIZE }, () =>
    Array(CONFIG.NEXT_SIZE).fill(0)
  );

  if (nextPiece) {
    const shape = nextPiece.shape;
    const offsetX = Math.floor((CONFIG.NEXT_SIZE - shape[0].length) / 2);
    const offsetY = Math.floor((CONFIG.NEXT_SIZE - shape.length) / 2);
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          grid[offsetY + row][offsetX + col] = nextPiece.type;
        }
      }
    }
  }

  ensureGridCells(nextEl, CONFIG.NEXT_SIZE, CONFIG.NEXT_SIZE, 'cell');
  updateGridCells(nextEl, grid, CONFIG.NEXT_SIZE);
}

function updateHUD() {
  document.getElementById('score').textContent = score;
  document.getElementById('level').textContent = level;
  document.getElementById('lines').textContent = lines;
}

function updateOverlays() {
  const gameOverEl = document.getElementById('game-over');
  const pausedEl = document.getElementById('paused');
  const isOver = gameState === GAME_STATE.GAME_OVER;
  const isPaused = gameState === GAME_STATE.PAUSED;

  gameOverEl.classList.toggle('hidden', !isOver);
  gameOverEl.setAttribute('aria-hidden', String(!isOver));
  pausedEl.classList.toggle('hidden', !isPaused);
  pausedEl.setAttribute('aria-hidden', String(!isPaused));
}

function render() {
  const display =
    gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.PAUSED
      ? drawPiece(board, currentPiece)
      : board.map((row) => [...row]);
  renderBoard(display);
  renderNext();
  updateOverlays();
}

function tick(delta) {
  if (gameState !== GAME_STATE.PLAYING) return;

  dropCounter += delta;
  if (dropCounter >= getDropInterval()) {
    if (!tryMove(0, 1)) {
      lockPiece();
    }
    dropCounter = 0;
  }
}

function gameLoop(time = 0) {
  const delta = time - lastTime;
  lastTime = time;
  tick(delta);
  render();
  animationId = requestAnimationFrame(gameLoop);
}

function handleKey(event) {
  if (event.key === 'r' || event.key === 'R') {
    resetGame();
    return;
  }

  if (gameState === GAME_STATE.GAME_OVER) return;

  if (event.key === 'p' || event.key === 'P') {
    gameState = gameState === GAME_STATE.PAUSED ? GAME_STATE.PLAYING : GAME_STATE.PAUSED;
    updateOverlays();
    return;
  }

  if (gameState !== GAME_STATE.PLAYING) return;

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      tryMove(-1, 0);
      break;
    case 'ArrowRight':
      event.preventDefault();
      tryMove(1, 0);
      break;
    case 'ArrowDown':
      event.preventDefault();
      softDrop();
      break;
    case 'ArrowUp':
      event.preventDefault();
      rotatePiece(1);
      break;
    case ' ':
      event.preventDefault();
      hardDrop();
      break;
    default:
      return;
  }

  render();
}

function startGame() {
  board = createBoard();
  score = 0;
  level = 1;
  lines = 0;
  gameState = GAME_STATE.PLAYING;
  dropCounter = 0;
  lastTime = 0;
  nextPiece = createPiece(randomPieceType());
  spawnPiece();
  updateHUD();
  render();
}

function resetGame() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
  }
  startGame();
  animationId = requestAnimationFrame(gameLoop);
}

function init() {
  document.addEventListener('keydown', handleKey);
  resetGame();
}

init();
