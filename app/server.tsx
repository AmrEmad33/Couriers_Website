import { Socket } from "socket.io-client";

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket: Socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
server.listen(3001, () => {
  console.log("WebSocket server is listening on port 3001");
});
