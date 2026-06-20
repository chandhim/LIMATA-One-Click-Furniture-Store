import { io, type Socket } from "socket.io-client";

import { getApiBaseUrl } from "./env";

let socket: Socket | null = null;

export function initializeSocket(token: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  const socketUrl = getApiBaseUrl();
  console.log("Initializing Socket.io client to:", socketUrl);

  socket = io(socketUrl, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ["websocket", "polling"],
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
}
