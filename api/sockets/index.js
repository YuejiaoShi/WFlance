import { Server } from "socket.io";
import chatSocket from "./chatSocket.js";

const setupSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    chatSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default setupSockets;
