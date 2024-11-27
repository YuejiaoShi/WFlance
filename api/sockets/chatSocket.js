import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

const chatSocket = (io, socket) => {
  // Respond to a simple test event
  socket.on("myEvent", () => {
    socket.emit("responseEvent", "Hello client!");
  });

  // Handle joining a chat room
  socket.on("joinRoom", async ({ senderId, receiverId, roomName }) => {
    try {
      // Ensure a valid room name exists
      const participantIds = [senderId, receiverId].sort().join("_");

      // Find or create the conversation
      let conversation = await Conversation.findOne({
        where: { participantIds },
      });

      if (!conversation) {
        conversation = await Conversation.create({ participantIds });
      }

      // Join the room
      socket.join(roomName || conversation.id);
      console.log(`User joined conversation: ${conversation.id}`);

      // Notify the user that they have joined successfully
      socket.emit("joinedRoom", { roomName: conversation.id });
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", { message: "Error joining the room." });
    }
  });

  // Handle sending a message
  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, message, roomName }) => {
      try {
        if (!message || !senderId || !receiverId) {
          console.error("Invalid message data:", {
            senderId,
            receiverId,
            message,
          });
          return;
        }

        const participantIds = [senderId, receiverId].sort().join("_");

        // Ensure the conversation exists
        const conversation = await Conversation.findOne({
          where: { participantIds },
        });

        if (!conversation) {
          console.error("Conversation not found");
          return;
        }

        // Save the message
        const newMessage = await Message.create({
          conversationId: conversation.id,
          senderId,
          receiverId,
          message,
        });

        // Emit the message to all clients in the room
        io.to(roomName || conversation.id).emit("receiveMessage", newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Error sending the message." });
      }
    }
  );

  // Fetch messages for a specific room
  socket.on("fetchMessages", async ({ roomName }) => {
    try {
      // Find the conversation using the roomName
      const conversation = await Conversation.findOne({
        where: { id: roomName },
      });

      if (!conversation) {
        socket.emit("chatHistory", []);
        return;
      }

      // Fetch all messages for the conversation
      const messages = await Message.findAll({
        where: { conversationId: conversation.id },
        order: [["createdAt", "ASC"]],
      });

      // Emit the chat history to the client
      socket.emit("chatHistory", messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      socket.emit("error", { message: "Error fetching messages." });
    }
  });
};

export default chatSocket;
