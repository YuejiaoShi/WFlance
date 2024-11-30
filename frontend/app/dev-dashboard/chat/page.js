'use client';

import { getFieldFromCookie } from '@/app/utils/auth';
import { getAllClientsFromDeveloper } from '@/app/utils/chatUtil';
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const Chat = () => {
  const socketRef = useRef(null);
  const [clients, setClients] = useState([]);
  const [senderId, setSenderId] = useState(null);
  const [receiverId, setReceiverId] = useState('');
  const [roomName, setRoomName] = useState(null);
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const [buttonCont, setButtonCont] = useState('Send Event');

  // Format clients
  const formatClients = clients =>
    clients.map(client => ({
      name: client.client.name,
      id: client.clientId,
    }));

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    const socket = io('wss://wflance-production.up.railway.app');
    socketRef.current = socket;

    const initializeChat = async () => {
      try {
        const userId = getFieldFromCookie('userId');
        if (!userId) {
          console.warn('userId not found in cookie');
          return;
        }

        setSenderId(userId);

        const allClients = await getAllClientsFromDeveloper(userId);
        setClients(formatClients(allClients));
        console.log('Fetched all clients:', allClients);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();

    // Wrap `socket.on` to log events
    const originalOn = socket.on;
    socket.on = function (event, callback) {
      console.log(`Listening to event: ${event}`);
      return originalOn.call(this, event, callback);
    };

    // Log all incoming events
    socket.onAny((event, ...args) => {
      console.log(`Received event: ${event}, data:`, args);
    });

    socket.on('connect', () => {
      console.log('Connected to server!', socket.id);
      socket.emit('howdy', 'stranger');
    });

    socket.on('hello', msg => {
      console.log('hello hahah!', msg);
    });

    socket.on('responseEvent', data => {
      console.log('Received response from server:', data);
      setButtonCont(`Received: ${data}`);
    });

    socket.on('receiveMessage', message => {
      console.log('Received message:', message);
      setMessagesByRoom(prev => ({
        ...prev,
        [message.roomName]: [...(prev[message.roomName] || []), message],
      }));
    });

    socket.on('chatHistory', chatMessages => {
      console.log('Received chat history:', chatMessages);

      // Group messages by room
      const groupedMessages = chatMessages.reduce((acc, msg) => {
        const room = `${msg.senderId}_${msg.receiverId}`;
        if (!acc[room]) acc[room] = [];
        acc[room].push(msg);
        return acc;
      }, {});

      // Update state with grouped messages
      setMessagesByRoom(prev => ({
        ...prev,
        ...groupedMessages,
      }));

      console.log('Grouped Messages by Room:', groupedMessages);
    });

    return () => {
      console.log('Disconnecting socket...');
      socket.disconnect();
    };
  }, []);

  const sendSocketEvents = () => {
    const socket = socketRef.current;
    if (!socket) {
      console.error('Socket not initialized!');
      return;
    }

    console.log("Button pressed. Emitting 'myevent'.");
    socket.emit('myevent', 'Hello Server');
  };

  const joinRoom = (specificRoomName = null) => {
    const socket = socketRef.current;
    if (!socket) {
      console.error('Socket not initialized!');
      return;
    }

    if (!receiverId && !specificRoomName) {
      alert('Please select or enter a receiver!');
      return;
    }

    if (!senderId) {
      alert('Sender ID is missing!');
      return;
    }

    const room = specificRoomName || `${senderId}_${receiverId}`;
    setRoomName(room);

    console.log(`Joining room: ${room}`);
    socket.emit('joinRoom', { senderId, receiverId });
    socket.emit('fetchMessages', { senderId, receiverId });
  };

  const sendMessage = () => {
    const socket = socketRef.current;
    if (!socket) {
      console.error('Socket not initialized!');
      return;
    }

    console.log('sendMessage function called');

    if (!messageInput.trim()) {
      alert('Message cannot be empty!');
      return;
    }

    if (!roomName) {
      alert('Join a room first!');
      return;
    }

    const message = { senderId, receiverId, message: messageInput };
    console.log('Sending message:', message);

    socket.emit('sendMessage', message);

    setMessagesByRoom(prev => ({
      ...prev,
      [roomName]: [...(prev[roomName] || []), { ...message, senderId }],
    }));
    setMessageInput('');
    scrollToBottom();
  };

  return (
    <div className='w-full h-full bg-gray-100'>
      <div className='flex p-10 h-full flex-col mx-auto max-w-screen-xl'>
        <div className='flex flex-grow bg-white shadow-lg rounded-2xl'>
          {/* Sidebar */}
          <div className='w-1/4 flex flex-col border-r-2 border-gray-100'>
            <div className='p-4'>
              <h2 className='text-xl font-bold text-primary-blue-dark'>Chat App</h2>
            </div>
            <div className='p-4'>
              <label htmlFor='receiverId' className='block font-medium mb-2'>
                Chat with:
              </label>
              <input
                type='number'
                id='receiverId'
                value={receiverId || ''}
                onChange={e => setReceiverId(e.target.value)}
                placeholder='Enter receiver ID'
                className='w-full border rounded-lg px-3 py-2 mb-4'
              />
              <button
                onClick={() => joinRoom()}
                className='w-full bg-primary-blue-dark text-white py-2 rounded-lg hover:bg-primary-blue'
              >
                Start Chat
              </button>
            </div>
            {/* Chat List */}
            <div className='p-4'>
              <h3 className='text-lg font-bold mb-2'>Your Chats</h3>
              <ul className='space-y-2'>
                {clients.map((client, index) => (
                  <li
                    key={index}
                    className='p-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300'
                    onClick={() => joinRoom(`${senderId}_${client.id}`)}
                  >
                    Chat with {client.name || `User ${client.id}`}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chat Section */}
          <div className='flex-1 flex flex-col'>
            <div className='p-4 flex items-center border-b-2 border-gray-100'>
              <h3 className='text-lg font-semibold'>Chat Room: {roomName || 'No room joined'}</h3>
            </div>
            <div className='flex-1 overflow-y-auto bg-gray-50 p-4'>
              {(messagesByRoom[roomName] || []).map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-3 rounded-lg max-w-md ${
                    msg.senderId === senderId ? 'bg-primary-purple text-white ml-auto' : 'bg-gray-200 text-black'
                  }`}
                >
                  <strong>{msg.senderId === senderId ? 'You' : `User ${msg.senderId}`}:</strong> {msg.message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className='p-4 border-t-2 border-gray-100 flex items-center'>
              <input
                type='text'
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                placeholder='Type a message...'
                className='flex-1 border rounded-lg px-3 py-2 mr-2'
              />
              <button onClick={sendMessage} className='bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600'>
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
