'use client';

import { getFieldFromCookie } from '@/app/utils/auth';
import { getAllClientsFromDeveloper } from '@/app/utils/chatUtil';
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

const Chat = () => {
  const socketRef = useRef(null);
  const [developers, setDevelopers] = useState([]);
  const [senderId, setSenderId] = useState(null);
  const [receiverId, setReceiverId] = useState('');
  const [roomName, setRoomName] = useState(null);
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const [buttonCont, setButtonCont] = useState('Send Event');

  // // Format clients
  // const formatClients = clients =>
  //   clients.map(client => ({
  //     name: client.client.name,
  //     id: client.clientId,
  //   }));

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

        // const allClients = await getAllClientsFromDeveloper(userId);
        // setClients(formatClients(allClients));
        // console.log('Fetched all clients:', allClients);
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
        const room = `${msg.receiverId}_${msg.senderId}`;
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

  const joinRoom = (specificRoomName = null) => {
    const socket = socketRef.current;
    if (!socket) {
      console.error('Socket not initialized!');
      return;
    }

    if (!receiverId && !specificRoomName) {
      toast.info('Please select or enter a receiver!');
      return;
    }

    if (!senderId) {
      toast.info('Sender ID is missing!');
      return;
    }

    setDevelopers(prevDevelopers => [...prevDevelopers, { id: receiverId, name: `User ${receiverId}` }]);

    const room = specificRoomName || `${receiverId}_${senderId}`;
    setRoomName(room);
    console.log(`Joining room: ${room}`);
    socket.emit('joinRoom', { receiverId, senderId });
    socket.emit('fetchMessages', { receiverId, senderId });
  };

  const handleClientsClick = ({ receiverId, senderId }) => {
    const socket = socketRef.current;
    setRoomName(`${receiverId}_${senderId}`);
    socket.emit('joinRoom', { receiverId, senderId });
    socket.emit('fetchMessages', { receiverId, senderId });
  };

  const sendMessage = () => {
    const socket = socketRef.current;
    if (!socket) {
      console.error('Socket not initialized!');
      return;
    }

    console.log('sendMessage function called');

    if (!messageInput.trim()) {
      toast.info('Message cannot be empty!');
      return;
    }

    if (!roomName) {
      toast.info('Join a room first');
      return;
    }

    const message = { receiverId, senderId, message: messageInput };
    console.log('Sending message:', message);

    socket.emit('sendMessage', message);

    setMessagesByRoom(prev => ({
      ...prev,
      [roomName]: [...(prev[roomName] || []), { ...message, receiverId }],
    }));
    setMessageInput('');
    scrollToBottom();
  };

  return (
    <div className='w-full h-full flex-1 bg-gray-100'>
      <div className='flex sm:p-10 p-0 flex-col mx-auto max-w-screen-xl h-full'>
        <div className='flex h-full bg-white shadow-lg rounded-2xl'>
          {/* Sidebar */}
          <div className='w-1/4 flex flex-col border-r-2 border-gray-100'>
            <div className='p-4'>
              <h2 className='text-xl font-bold text-primary-blue-dark'>WEflance Chat</h2>
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
                onKeyDown={e => {
                  if (e.key === 'Enter') joinRoom();
                }}
                placeholder='Enter receiver ID'
                className='w-full border rounded-lg px-3 py-2 mb-4'
              />
              <button
                onClick={() => joinRoom()}
                className='w-full bg-primary-blue text-white py-2 rounded-lg hover:bg-primary-accent-light'
              >
                Start Chat
              </button>
            </div>
            {/* Chat List */}
            <div className='p-4'>
              <h3 className='text-lg font-bold mb-2'>Your Chats</h3>
              <ul className='space-y-2'>
                {developers.map((developer, index) => (
                  <li
                    key={index}
                    className='p-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300'
                    onClick={() => handleClientsClick({ receiverId: developer.id, senderId })}
                  >
                    Chat with {developer.name || `User ${developer.id}`}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chat Section */}
          <div className='flex-grow flex flex-col max-w-full'>
            {/* Header */}
            <div className='p-4 flex items-center border-b-2 border-gray-100'>
              <h3 className='text-lg font-semibold'>Chat Room: {roomName || 'No room joined'}</h3>
            </div>

            {/* Chat Messages */}
            <div
              className='flex-grow flex flex-col bg-gray-50 p-4 overflow-y-auto'
              style={{ maxHeight: 'calc(100vh - 200px)' }}
            >
              {(messagesByRoom[roomName] || []).map((msg, index) => {
                const receiverName = developers.find(developer => developer.id === msg.receiverId)?.name;

                return (
                  <div
                    key={index}
                    className={`mb-2 p-3 rounded-lg break-words ${
                      Number(msg.senderId) === Number(senderId)
                        ? 'bg-primary-purple text-white ml-auto'
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    <strong>
                      {Number(msg.senderId) === Number(senderId)
                        ? 'You'
                        : receiverName
                        ? receiverName
                        : `User ${msg.senderId}`}
                    </strong>
                    : {msg.message}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className='p-4 border-t-2 border-gray-100 flex items-center'>
              <input
                type='text'
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                placeholder='Type a message...'
                className='flex-1 border rounded-lg px-3 py-2 mr-2'
                onKeyDown={e => {
                  if (e.key === 'Enter') sendMessage();
                }}
                aria-label='Message input'
              />
              <button
                onClick={sendMessage}
                className='bg-gray-100 text-white py-2 px-4 rounded-lg hover:bg-gray-200'
                aria-label='Send message'
              >
                <PaperAirplaneIcon className='h-6 w-6 text-primary-blue' aria-hidden='true' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
