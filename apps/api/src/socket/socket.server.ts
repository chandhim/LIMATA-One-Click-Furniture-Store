import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { verifyToken } from "@/lib/jwt";
import { ApiError } from "@/shared/errors/api-error";

export interface SocketAuthPayload {
  id: string;
  role: string;
}

export interface AuthenticatedSocket extends SocketIOServer {
  user?: SocketAuthPayload;
}

export function createSocketServer(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
        : true,
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // Authentication middleware to intercept incoming WebSocket connection requests
  // It ensures only authenticated users can establish a real-time socket connection
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new ApiError(401, "Unauthorized"));
    }

    try {
      // Validate the JWT token and attach the decoded user payload to the socket instance for future event handlers
      const payload = verifyToken(token) as SocketAuthPayload;
      (socket as typeof socket & { user?: SocketAuthPayload }).user = payload;
      next();
    } catch (_error) {
      next(new ApiError(401, "Invalid or expired token"));
    }
  });

  return io;
}
