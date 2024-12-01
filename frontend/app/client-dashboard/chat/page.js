'use client';

import { getFieldFromCookie } from '@/app/utils/auth';
import { getAllMessagesFromDeveloper } from '@/app/utils/chatUtil';
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { extractOtherUsers, getConversationIdFromMessages, groupMessagesByConversation } from '@/lib/chatHelpers';

const Chat = () => {
  const socketRef = useRef(null);
  const [senderId, setSenderId] = useState(null);
  const [receiverId, setReceiverId] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [combinedRoom, setCombinedRoom] = useState('');
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [conversationId, setConversationId] = useState(null);
  const [receiverInput, setReceiverInput] = useState('');

  const [clients, setClients] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    const socket = io('wss://wflance-production.up.railway.app');
    socketRef.current = socket;

    const initializeChat = async () => {
      const loggedInUserId = getFieldFromCookie('userId');
      if (!loggedInUserId) {
        console.warn('userId not found in cookie');
        return;
      }
      setSenderId(loggedInUserId);

      const activeChatHistory = await getAllMessagesFromDeveloper(loggedInUserId);
      setAllMessages(activeChatHistory);

      const otherUsers = extractOtherUsers(activeChatHistory, loggedInUserId); // [6,8]
      setClients(otherUsers);

      const groupedMessages = groupMessagesByConversation(activeChatHistory);
      setMessagesByRoom(groupedMessages);
    };

    initializeChat();

    socket.on('connect', () => {
      console.log('Connected to server!', socket.id);
    });

    socket.on('receiveMessage', message => {
      setMessagesByRoom(prev => ({
        ...prev,
        [message.conversationId]: [...(prev[message.conversationId] || []), message],
      }));
    });

    socket.on('chatHistory', chatMessages => {
      const groupedMessages = chatMessages.reduce((acc, msg) => {
        if (!acc[msg.conversationId]) acc[msg.conversationId] = [];
        acc[msg.conversationId].push(msg);
        return acc;
      }, {});

      setMessagesByRoom(prev => ({
        ...prev,
        ...groupedMessages,
      }));
    });

    if (receiverId) {
      joinRoom(receiverId);
    }

    return () => {
      console.log('Disconnecting socket...');
      socket.disconnect();
    };
  }, [receiverId]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.emit('fetchMessages', { senderId, receiverId });
    scrollToBottom();
  }, [messagesByRoom]);

  const joinRoom = inputUserId => {
    const socket = socketRef.current;
    if (!socket) {
      console.error('Socket not initialized!');
      return;
    }

    setReceiverId(inputUserId);

    const conversationId = getConversationIdFromMessages(allMessages, inputUserId, senderId);

    setCombinedRoom(`${senderId}_${inputUserId}`);
    setConversationId(conversationId);

    socket.emit('joinRoom', { senderId, inputUserId });
  };

  const sendMessage = async () => {
    const socket = socketRef.current;
    if (!socket) {
      console.error('Socket not initialized!');
      return;
    }

    if (!messageInput.trim()) {
      toast.info('Message cannot be empty!');
      return;
    }

    if (!combinedRoom) {
      toast.info('Join a room first');
      return;
    }

    const message = { senderId, receiverId, message: messageInput };
    socket.emit('sendMessage', message);

    const activeChatHistory = await getAllMessagesFromDeveloper(senderId);
    setAllMessages(activeChatHistory);

    const conversationId = getConversationIdFromMessages(allMessages, receiverId, senderId);

    setMessagesByRoom(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), message],
    }));

    setMessageInput('');
    scrollToBottom();
  };

  return (
    <div className='w-full h-full flex-1 bg-gray-100'>
      <div className='flex sm:p-10 p-0 flex-col mx-auto  max-w-screen-xl h-full'>
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
              <form
                onSubmit={e => {
                  e.preventDefault();
                  joinRoom(receiverInput);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    joinRoom(receiverInput);
                  }
                }}
              >
                <input
                  type='number'
                  id='receiverId'
                  value={receiverInput}
                  onChange={e => setReceiverInput(e.target.value)}
                  placeholder='Enter receiver ID'
                  className='w-full border rounded-lg px-3 py-2 mb-4'
                />
                <button
                  className='w-full bg-primary-blue text-white py-2 rounded-lg hover:bg-primary-accent-light'
                  type='submit'
                >
                  Start Chat
                </button>
              </form>
            </div>
            {/* Chat List */}
            <div className='p-4'>
              <h3 className='text-lg font-bold mb-2'>Your Chats</h3>
              <ul className='space-y-2'>
                {clients.map((client, index) => (
                  <li
                    key={index}
                    className='p-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300'
                    onClick={() => setReceiverId(client)}
                  >
                    Chat with {client || `User ${client}`}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chat Section */}
          <div className='flex-grow flex flex-col max-w-full'>
            {/* Header */}
            <div className='p-4 flex items-center border-b-2 border-gray-100'>
              <h3 className='text-lg font-semibold'>Chat Room: {combinedRoom || 'No room joined'}</h3>
            </div>

            {/* Chat Messages */}
            <div
              className='flex-grow flex flex-col bg-gray-50 p-4 overflow-y-auto'
              style={{ maxHeight: 'calc(100vh - 200px)' }}
            >
              {(messagesByRoom[conversationId] || []).map((msg, index) => {
                const receiverName = clients.find(client => client.id === msg.senderId)?.name;

                return (
                  <div
                    key={index}
                    className={`mb-2 p-3 rounded-lg break-words ${
                      Number(msg.senderId) === Number(senderId)
                        ? 'bg-primary-purple text-white ml-auto'
                        : 'bg-gray-200 text-black mr-auto'
                    }`}
                  >
                    <strong>
                      {Number(msg.senderId) === Number(senderId) ? 'You' : receiverName || `User ${msg.senderId}`}
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
