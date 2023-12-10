"use client";

import { io, Socket } from "socket.io-client";
import React, { useCallback, useContext, useEffect, useState } from "react";

interface SocketProviderInterface {
  children?: React.ReactNode;
}

interface SocketContextInterface {
  sendMessage: (message: string) => void;
}

const SocketContext = React.createContext<SocketContextInterface | null>(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error("Socket context not initialized");
  return socket;
};

export const SocketProvider: React.FC<SocketProviderInterface> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const sendMessage: SocketContextInterface["sendMessage"] = useCallback(
    (message) => {
      console.log(socket);

      if (socket) {
        console.log(`send message ${message}`);
        socket.emit("event:message", { message });
      }
    },
    [socket]
  );

  const onMessageReceived = useCallback((message: string) => {
    console.log(message);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:9200");
    _socket.on("message", onMessageReceived);
    setSocket(_socket);
    return () => {
      _socket.disconnect();
      _socket.off("message", onMessageReceived);
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
