"use client";

import { getFieldFromCookie } from "@/app/utils/auth";
import { getAllClientsFromDeveloper } from "@/app/utils/chatUtil";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

const Chat = () => {
  const socketRef = useRef(null);
  const [clients, setClients] = useState([]);
  const [userId, setUserId] = useState(null); // Logged-in user ID
  const [receiverId, setReceiverId] = useState(""); // For manually starting a chat
  const [roomName, setRoomName] = useState(null);
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const formatClientsFromHistory = (chatHistory, userId) => {
    const uniqueConversations = {};
    chatHistory.forEach((chat) => {
      const otherParticipant = chat.receiverId;

      // Skip adding self as a participant in the chat list
      // if (otherParticipant === userId) {
      //   return;
      // }

      if (!uniqueConversations[chat.conversationId]) {
        uniqueConversations[chat.conversationId] = {
          conversationId: chat.conversationId,
          participantId: otherParticipant,
          name: `User ${otherParticipant}`,
        };
      }
    });

    // console.log("Formatted Clients:", uniqueConversations);
    return Object.values(uniqueConversations);
  };

  useEffect(() => {
    const socket = io("wss://wflance-production.up.railway.app");
    socketRef.current = socket;

    const initializeChat = async () => {
      try {
        const loggedInUserId = getFieldFromCookie("userId"); // Retrieve userId
        if (!loggedInUserId) {
          console.warn("userId not found in cookie");
          return;
        }

        setUserId(loggedInUserId); // Set the logged-in user ID

        const activeClientsChatHistory = await getAllClientsFromDeveloper(
          loggedInUserId
        );
        // console.log("Fetched all clients:", activeClientsChatHistory);

        // Format clients to display chat list
        const formattedClients = formatClientsFromHistory(
          activeClientsChatHistory,
          loggedInUserId
        );

        setClients(formattedClients);

        const groupedMessages = activeClientsChatHistory.reduce((acc, msg) => {
          if (!acc[msg.conversationId]) acc[msg.conversationId] = [];
          acc[msg.conversationId].push(msg);
          return acc;
        }, {});

        setMessagesByRoom(groupedMessages);
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    initializeChat();

    // Listen to socket events
    socket.on("connect", () => {
      console.log("Connected to server!", socket.id);
    });
    //for realtime messages
    socket.on("receiveMessage", (message) => {
      console.log("Received message:", message);
      setMessagesByRoom((prev) => ({
        ...prev,
        [message.conversationId]: [
          ...(prev[message.conversationId] || []),
          message,
        ],
      }));
    });

    // socket.on("chatHistory", (chatMessages) => {
    //   console.log("Received chat history:", chatMessages);

    //   // Update chat list and messages dynamically
    //   const updatedClients = formatClientsFromHistory(chatMessages, userId);
    //   setClients(updatedClients);

    //   const groupedMessages = chatMessages.reduce((acc, msg) => {
    //     if (!acc[msg.conversationId]) acc[msg.conversationId] = [];
    //     acc[msg.conversationId].push(msg);
    //     return acc;
    //   }, {});

    //   setMessagesByRoom((prev) => ({
    //     ...prev,
    //     ...groupedMessages,
    //   }));

    //   console.log("Updated Messages by Room:", groupedMessages);
    // });

    socket.on("joinedRoom", (response) => {
      if (response && response.conversationId) {
        console.log("Joined room response:", response);
        setRoomName(response.conversationId);
      } else {
        console.error("Invalid joinedRoom response from server");
      }
    });

    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.emit("fetchMessages", { userId, receiverId });
    scrollToBottom();
  }, [messagesByRoom]);

  const joinRoom = (specificRoomId, receiverId) => {
    const socket = socketRef.current;

    if (!socket) {
      console.error("Socket not initialized!");
      return;
    }

    if (!specificRoomId && (!receiverId || receiverId.trim() === "")) {
      alert("Please select a conversation or enter a receiver ID!");
      return;
    }

    // const room = specificRoomId;

    // if (!room) {
    //   console.error("Failed to construct room name!");
    //   return;
    // }

    // setRoomName(room);

    if (specificRoomId === "") {
      const newRoomName = userId + "_" + receiverId;
      setRoomName(newRoomName);
      console.log(`Joining room: ${newRoomName}`);
    } else {
      const room = specificRoomId;
      console.log(`Joining room: ${room}`);
      setRoomName(room);
    }

    socket.emit("joinRoom", {
      senderId: Number(userId),
      receiverId: Number(receiverId),
    });

    //const roomMessages = messagesByRoom[specificRoomId || room] || [];
    //.log("Loading messages for room:", room, roomMessages);
    console.log("joinRoom payload:", {
      senderId: Number(userId),
      receiverId: Number(receiverId),
    });
  };

  const sendMessage = () => {
    const socket = socketRef.current;
    if (!socket) {
      console.error("Socket not initialized!");
      return;
    }

    if (!messageInput.trim()) {
      alert("Message cannot be empty!");
      return;
    }

    if (!roomName) {
      alert("Join a room first!");
      return;
    }
    const participant = clients.find(
      (client) => client.conversationId === roomName
    );

    // if (!participant) {
    //   console.warn(`No participant found for roomName: ${roomName}`);
    // }

    const message = {
      senderId: Number(userId),
      receiverId: participant?.participantId || receiverId, // Fallback to "Unknown" or handle error
      conversationId: roomName,
      message: messageInput,
    };

    console.log("Sending message:", message);

    socket.emit("sendMessage", message);

    setMessagesByRoom((prev) => ({
      ...prev,
      [roomName]: [...(prev[roomName] || []), { ...message, senderId: userId }],
    }));
    setMessageInput("");
    scrollToBottom();
  };

  return (
    <div className="flex h-full bg-gray-100 flex-col mx-auto max-w-screen-xl">
      <div className="flex flex-1 p-10 flex-col">
        <div className="flex flex-grow bg-white shadow-lg rounded-2xl">
          {/* Sidebar */}
          <div className="w-1/4 flex flex-col border-r-2 border-gray-100">
            <div className="p-4">
              <h2 className="text-xl font-bold text-primary-blue-dark">
                Chat App
              </h2>
            </div>
            <div className="p-4">
              <label htmlFor="receiverId" className="block font-medium mb-2">
                Chat with:
              </label>
              <input
                type="number"
                id="receiverId"
                value={receiverId || ""}
                onChange={(e) => setReceiverId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") joinRoom("", receiverId);
                }}
                placeholder="Enter receiver ID"
                className="w-full border rounded-lg px-3 py-2 mb-4"
              />
              <button
                onClick={() => joinRoom("", receiverId)}
                className="w-full bg-primary-blue-dark text-white py-2 rounded-lg hover:bg-primary-blue"
              >
                Start Chat
              </button>
            </div>

            {/* Chat List */}
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">Your Chats</h3>
              <ul className="space-y-2">
                {clients.map((client, index) => (
                  <li
                    key={index}
                    className="p-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
                    onClick={() => {
                      joinRoom(client.conversationId, client.participantId);
                    }}
                  >
                    Chat with {client.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 flex items-center border-b-2 border-gray-100">
              <h3 className="text-lg font-semibold">
                Chat Room: {roomName || "No room joined"}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              {(messagesByRoom[roomName] || []).map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-3 rounded-lg max-w-md ${
                    msg.senderId === userId
                      ? "bg-primary-purple text-white ml-auto"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <strong>
                    {msg.senderId === userId ? "You" : `User ${msg.senderId}`}:
                  </strong>{" "}
                  {msg.message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t-2 border-gray-100 flex items-center">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-lg px-3 py-2 mr-2"
              />
              <button
                onClick={sendMessage}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
