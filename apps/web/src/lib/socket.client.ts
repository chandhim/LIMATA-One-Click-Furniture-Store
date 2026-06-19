import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initializeSocket(token: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  const getSocketUrl = () => {
    const baseFromEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (baseFromEnv) return baseFromEnv;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      return apiUrl.replace(/\/api(\/v\d+)?$/, "");
    }

    return "http://localhost:4000";
  };

  const socketUrl = getSocketUrl();
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
