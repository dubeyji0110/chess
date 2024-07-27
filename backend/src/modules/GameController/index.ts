import { WebSocket } from 'ws';
import { Game, Move } from '@/modules/Game';
import { Events } from '@/constants';

export interface EventData {
  type: keyof typeof Events;
  payload:
    | {
        move: Move;
      }
    | undefined;
}

export class GameController {
  private games: Game[];
  private users: WebSocket[];
  private waitingUser: WebSocket | null;

  constructor() {
    this.games = [];
    this.users = [];
    this.waitingUser = null;
  }

  private subscribe(socket: WebSocket) {
    socket.on('message', (data) => {
      const message = <EventData>JSON.parse(data.toString());

      switch (message.type) {
        case Events.INIT_GAME:
          if (this.waitingUser) {
            this.pairGame(this.waitingUser, socket);
          } else {
            this.waitingUser = socket;
          }
          break;

        case Events.MAKE_MOVE:
          if (message.payload) this.makeMove(socket, message.payload.move);
          break;
      }
    });
  }

  private pairGame(player1: WebSocket, player2: WebSocket) {
    const game = new Game(player1, player2);
    this.games.push(game);
    this.waitingUser = null;
  }

  private makeMove(socket: WebSocket, move: Move) {
    const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
    if (game) {
      game.makeMove(socket, move);
    }
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.subscribe(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
  }
}
