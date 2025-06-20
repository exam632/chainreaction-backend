const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let board = Array(36).fill({ count: 0, player: null });

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('state', board);

  socket.on('move', (data) => {
    const index = data.y * 6 + data.x;
    if (index >= 0 && index < 36) {
      board[index] = {
        count: (board[index].count || 0) + 1,
        player: (board[index].player === null) ? 0 : 1
      };
      io.emit('state', board);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
