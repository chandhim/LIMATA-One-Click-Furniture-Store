import { createServer } from "http";
import app from "./app";
import { createSocketServer } from "./socket/socket.server";
import { registerChatSocket } from "./socket/chat.socket";

const port = Number(process.env.PORT ?? process.env.API_PORT ?? 4000);

const httpServer = createServer(app);
const io = createSocketServer(httpServer);

registerChatSocket(io);

httpServer.listen(port, () => {
  console.log(`API running on port ${port}`);
});
