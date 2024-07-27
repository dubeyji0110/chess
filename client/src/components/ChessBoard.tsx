import { Events } from '@/constants';
import { Board } from '@/interfaces';
import { Chess, Square } from 'chess.js';
import Image from 'next/image';
import { useState } from 'react';

interface IChessBoard {
  socket: WebSocket;
  chess: Chess;
  board: Board;
  setBoard: React.Dispatch<React.SetStateAction<Board>>;
}

const ChessBoard = ({ socket, chess, board, setBoard }: IChessBoard) => {
  const [from, setFrom] = useState<null | Square>(null);

  return (
    <div className="text-white-200">
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareRepresentation = (String.fromCharCode(97 + (j % 8)) +
                '' +
                (8 - i)) as Square;

              return (
                <div
                  onClick={() => {
                    if (!from) {
                      setFrom(squareRepresentation);
                    } else {
                      socket.send(
                        JSON.stringify({
                          type: Events.MAKE_MOVE,
                          payload: {
                            move: {
                              from,
                              to: squareRepresentation,
                            },
                          },
                        }),
                      );

                      setFrom(null);
                      chess.move({
                        from,
                        to: squareRepresentation,
                      });
                      setBoard(chess.board());
                    }
                  }}
                  key={j}
                  className={`w-24 h-24 ${(i + j) % 2 === 0 ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className="w-full justify-center flex h-full">
                    <div className="h-full justify-center flex flex-col">
                      {square ? (
                        <Image
                          alt={`chess-piece-${square?.type}`}
                          className="w-10"
                          width={100}
                          height={100}
                          src={`/${
                            square?.color === 'b'
                              ? square?.type
                              : `${square?.type?.toUpperCase()} copy`
                          }.png`}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ChessBoard;
