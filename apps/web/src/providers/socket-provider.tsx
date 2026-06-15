"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import type { Socket } from "socket.io-client";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { initializeSocket, disconnectSocket } from "@/lib/socket.client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
      return;
    }

    try {
      const socketInstance = initializeSocket(token);

      socketInstance.on("connect", () => {
        setIsConnected(true);
        console.log("Socket connected");
      });

      socketInstance.on("disconnect", () => {
        setIsConnected(false);
        console.log("Socket disconnected");
      });

      setSocket(socketInstance);
    } catch (error) {
      console.error("Failed to initialize socket:", error);
    }

    return () => {
      // Don't disconnect on cleanup - let the socket persist for the session
    };
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error("useSocket must be used within SocketProvider");
  }

  return context;
}
