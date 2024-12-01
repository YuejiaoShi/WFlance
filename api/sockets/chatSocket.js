import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

const chatSocket = (io, socket) => {
  socket.on("myevent", async () => {
    socket.emit("responseEvent", "Hello client!");
  });

  socket.on("joinRoom", async ({ senderId, receiverId }) => {
    console.log("Received 'joinRoom' event");
    //console.log(`Sender ID: ${senderId}, Receiver ID: ${receiverId}`);

    //new line
    if (!senderId || !receiverId) {
      console.error("Invalid joinRoom parameters:", { senderId, receiverId });
      return;
    }
    const participantIds = [senderId, receiverId].sort().join("_");
    console.log(`Computed participantIds: ${participantIds}`);

    let conversation;
    try {
      conversation = await Conversation.findOne({
        where: { participantIds },
      });

      if (!conversation) {
        console.log("No existing conversation found. Creating a new one...");
        conversation = await Conversation.create({ participantIds });
        console.log("New conversation created:", conversation.id);
      } else {
        console.log("Found existing conversation:", conversation.id);
      }

      socket.join(conversation.id);
      console.log(`User joined conversation: ${conversation.id}`);
      socket.emit("joinedRoom", { conversationId: conversation.id });
    } catch (error) {
      console.error("Error at 'joinRoom' event:", error);
    }
  });

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    console.log("Received 'sendMessage' event", {
      senderId,
      receiverId,
      message,
    });
    if (!message || !senderId || !receiverId) {
      console.error("Invalid message data:", { senderId, receiverId, message });
      return;
    }

    const participantIds = [senderId, receiverId].sort().join("_");
    const conversation = await Conversation.findOne({
      where: { participantIds },
    });

    if (!conversation) {
      console.error(
        "Conversation not found for participantIds:",
        participantIds
      );
      return;
    }

    const newMessage = await Message.create({
      conversationId: conversation.id,
      senderId,
      receiverId,
      message,
    });

    io.to(conversation.id).emit("receiveMessage", newMessage);
  });

  // Fetch messages
  socket.on("fetchMessages", async ({ senderId, receiverId }) => {
    console.log("Received 'fetchMessages' event");
    const participantIds = [senderId, receiverId].sort().join("_");
    const conversation = await Conversation.findOne({
      where: { participantIds },
    });

    if (!conversation) {
      socket.emit("chatHistory", []);
      return;
    }

    const messages = await Message.findAll({
      where: { conversationId: conversation.id },
      order: [["createdAt", "ASC"]],
    });

    socket.emit("chatHistory", messages);
  });
};

export default chatSocket;
