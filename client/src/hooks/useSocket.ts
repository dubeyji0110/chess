'use client';
import { useEffect, useState } from 'react';

const WS_URL = 'ws://localhost:8080';

const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!socket) {
      const ws = new WebSocket(WS_URL);
      setSocket(ws);
      ws.onclose = () => {
        setSocket(null);
      };
    }

    return () => {
      socket && socket.close();
    };
  }, [socket]);

  return socket;
};

export default useSocket;
