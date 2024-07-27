import { WebSocket } from 'ws';
import { Chess } from 'chess.js';
import { Colors, Events } from '@/constants';

export interface Move {
  promotion: string | undefined;
  from: string;
  to: string;
}

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  private startTime: Date;
  private moveCount = 0;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();

    this.initGame(this.player1, Colors.WHITE);
    this.initGame(this.player2, Colors.BLACK);
  }

  private initGame(socket: WebSocket, color: string) {
    socket.send(
      JSON.stringify({
        type: Events.INIT_GAME,
        payload: { color },
      }),
    );
  }

  private updateGame(socket: WebSocket, move: Move) {
    socket.send(
      JSON.stringify({
        type: Events.MAKE_MOVE,
        payload: { move },
      }),
    );
  }

  private endGame(socket: WebSocket) {
    socket.send(
      JSON.stringify({
        type: Events.GAME_OVER,
        payload: {
          winner: this.board.turn() === 'w' ? Colors.BLACK : Colors.WHITE,
        },
      }),
    );
  }

  makeMove(socket: WebSocket, move: Move) {
    if (this.moveCount % 2 === 0 && socket !== this.player1) return;
    if (this.moveCount % 2 === 1 && socket !== this.player2) return;

    try {
      this.board.move(move);
    } catch (error) {
      console.error(error);
      return;
    }

    if (this.board.isGameOver()) {
      this.endGame(this.player1);
      this.endGame(this.player2);
    }

    if (this.moveCount % 2 === 1) {
      this.updateGame(this.player1, move);
    } else {
      this.updateGame(this.player2, move);
    }

    this.moveCount++;
  }
}
