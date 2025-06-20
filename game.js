const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 6;
const cellSize = canvas.width / gridSize;
const socket = io('https://your-backend-url.onrender.com');
let currentPlayer = 0;
let board = Array(gridSize * gridSize).fill(null).map(() => ({count: 0, player: null}));

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const index = y * gridSize + x;
      const cell = board[index];
      ctx.strokeStyle = '#ccc';
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      if (cell.count > 0) {
        ctx.fillStyle = cell.player === 0 ? 'red' : 'green';
        ctx.beginPath();
        ctx.arc((x + 0.5) * cellSize, (y + 0.5) * cellSize, 10 + 5 * (cell.count - 1), 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);
  socket.emit('move', {x, y});
});

socket.on('state', newBoard => {
  board = newBoard;
  drawBoard();
});

drawBoard();