import { Server } from "socket.io";
import chatSocket from "./chatSocket.js";

const setupSockets = (server) => {
  const io = new Server(server, {
    cors: {
      // origin: process.env.NEXT_PUBLIC_CLIENT_URL,
      // credentials: true,
      origin: "*", // Allow any origin (use for testing only)
      methods: ["GET", "POST"],
      //  allowedHeaders: ["Content-Type"],
    },
  });

  io.on("connection", async (socket) => {
    console.log("A user connected on this: " + socket.id);

    chatSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default setupSockets;
