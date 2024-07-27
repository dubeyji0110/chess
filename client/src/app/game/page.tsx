'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { useSocket } from '@/hooks';
import { Button, ChessBoard } from '@/components';
import { Board, EventData } from '@/interfaces';
import { Events } from '@/constants';

export default function Game() {
  const socket = useSocket();
  const chess = useRef<Chess>(new Chess());

  const [board, setBoard] = useState<Board>(chess.current.board());
  const [started, setStarted] = useState<boolean>(false);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message: EventData = JSON.parse(event.data);

      switch (message.type) {
        case Events.INIT_GAME:
          setBoard(chess.current.board());
          setStarted(true);
          break;

        case Events.MAKE_MOVE:
          if (message.payload) {
            chess.current.move(message.payload.move);
            setBoard(chess.current.board());
          }
          break;
      }
    };
  }, [chess, socket]);

  if (!socket) return <div>Connecting...</div>;

  return (
    <main className="h-screen w-screen">
      <div className="flex">
        <div className="flex-1">
          <ChessBoard chess={chess.current} setBoard={setBoard} socket={socket} board={board} />
        </div>
        <div className="flex justify-center items-center h-screen p-4 bg-slate-800">
          {!started && (
            <Button
              className="bg-green-600 text-white font-medium hover:bg-green-700 w-40 text-center"
              onClick={() => {
                socket.send(
                  JSON.stringify({
                    type: Events.INIT_GAME,
                  }),
                );
              }}
            >
              Play
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
