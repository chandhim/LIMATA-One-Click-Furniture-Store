import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initializeSocket(token: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Remove the trailing /api suffix if present to connect to the base socket server url
  const baseSocketUrl = apiUrl.replace(/\/api$/, "");

  socket = io(`${baseSocketUrl}/chat`, {
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
