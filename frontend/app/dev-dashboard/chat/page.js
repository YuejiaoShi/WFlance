'use client';

import { getFieldFromCookie } from '@/app/utils/auth';
import { getAllMessagesFromDeveloper, getClientNameById, getClientNames } from '@/app/utils/chatUtil';
import React, { useState, useEffect, useRef, use } from 'react';
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
  const [clientName, setClientName] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef(null);

  const handleScroll = () => {
    const chatContainer = messagesEndRef.current?.parentElement;

    if (chatContainer) {
      const isAtBottom = chatContainer.scrollHeight - chatContainer.scrollTop === chatContainer.clientHeight;
      setIsAtBottom(isAtBottom);
    }
  };

  const scrollToBottom = () => {
    if (isAtBottom) {
      const chatContainer = messagesEndRef.current?.parentElement;

      if (chatContainer) {
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  };

  useEffect(() => {
    const chatContainer = messagesEndRef.current?.parentElement;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, []);

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

      const otherUserIds = extractOtherUsers(activeChatHistory, senderId);
      const clientsWithNames = await getClientNames(otherUserIds, loggedInUserId);
      setClients(clientsWithNames);

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

    socket.on('joinedRoom', response => {
      if (response.conversationId) {
        setConversationId(response.conversationId);
      } else {
        console.error('Invalid joinedRoom response from server');
      }
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

  useEffect(() => {
    const fetchMessages = async () => {
      const activeChatHistory = await getAllMessagesFromDeveloper(Number(senderId));
      setAllMessages(activeChatHistory);

      const otherUserIds = extractOtherUsers(activeChatHistory, senderId);
      const clientsWithNames = await getClientNames(otherUserIds);
      setClients(clientsWithNames);
    };
    fetchMessages();
  }, [messageInput]);

  const joinRoom = inputUserId => {
    const socket = socketRef.current;
    if (!socket) {
      console.error('Socket not initialized!');
      return;
    }

    setReceiverId(inputUserId);

    const conversationIdByMessages = getConversationIdFromMessages(allMessages, inputUserId, senderId);
    if (conversationIdByMessages) {
      setConversationId(conversationIdByMessages);
    }

    setCombinedRoom(`${senderId}_${inputUserId}`);
    socket.emit('joinRoom', { senderId, receiverId: inputUserId });
  };

  const sendMessage = () => {
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

    const conversationId = getConversationIdFromMessages(allMessages, receiverId, senderId);

    const message = { senderId, receiverId, conversationId, message: messageInput };
    socket.emit('sendMessage', message);

    setMessagesByRoom(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), message],
    }));

    setMessageInput('');
    scrollToBottom();
  };

  useEffect(() => {
    const fetchClientName = async () => {
      const clientName = await getClientNameById(receiverId);
      setClientName(clientName);
    };
    fetchClientName();
  }, [combinedRoom]);

  return (
    <div className='w-full h-full bg-gray-100'>
      <div className='flex flex-grow sm:pb-24 sm:pt-8 p-0 flex-col mx-auto max-w-screen-xl h-full'>
        <div className='flex h-full bg-white shadow-lg rounded-2xl'>
          {/* Sidebar */}
          <div className='lg:w-1/5 w-1/4 flex flex-col border-r-2 border-gray-100'>
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
            <div className='p-4 max-h-full overflow-y-auto'>
              <h3 className='text-lg font-bold mb-2'>Your Chats</h3>
              <ul className='space-y-2'>
                {clients.map((client, index) => (
                  <li
                    key={index}
                    className='p-1.5 bg-gray-200 rounded-xl cursor-pointer hover:bg-gray-300'
                    onClick={() => {
                      setReceiverId(client.id);
                    }}
                  >
                    <div className='flex md:flex-row items-center flex-col'>
                      <span className='flex rounded-full bg-primary-accent-light p-3 h-8 w-8 items-center justify-center text-white mr-2'>
                        🤵🏻
                      </span>
                      <span className='font-semibold'>{client.name || `User ${client.id}`}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chat Section */}
          <div className='flex-grow flex flex-col max-w-full'>
            <div className='p-4 flex items-center border-b-2 border-gray-100'>
              <h3 className='text-lg font-semibold'>{clientName ? `Chatting with ${clientName}` : 'No room joined'}</h3>
            </div>

            {/* Chat Messages */}
            <div
              className='flex-grow flex flex-col bg-gray-50 p-4 overflow-y-auto'
              style={{ maxHeight: 'calc(100vh - 200px)' }}
            >
              {(messagesByRoom[conversationId] || []).map((msg, index) => {
                return (
                  <div
                    key={index}
                    className={`mb-2 p-3 rounded-lg break-words ${
                      Number(msg.senderId) === Number(senderId)
                        ? 'bg-primary-purple text-white ml-auto'
                        : 'bg-gray-200 text-black mr-auto'
                    }`}
                  >
                    {msg.message}
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
                className='flex-grow border rounded-lg px-3 py-2 mr-2'
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
