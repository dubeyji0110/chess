import { WebSocketServer } from 'ws';
import { GameController } from '@/modules/GameController';

const PORT = parseInt(process.env.PORT ?? '8080');

const wss = new WebSocketServer({ port: PORT }, () => {
  console.log(`Server started on ${PORT}`);
});
const gameController = new GameController();

wss.on('connection', (socket) => {
  gameController.addUser(socket);
  socket.on('close', () => gameController.removeUser(socket));
});
