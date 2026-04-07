import { useState, useEffect, useRef } from 'react';
import { User, Send, Loader } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { chatService } from '@/core/api/chatService';
import { getToken } from '@/core/helpers/TokenHandle';

interface Message {
  id: number;
  sender_id: number;
  sender: {
    id: number;
    name: string;
    avatar?: string;
  };
  message: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  id: number;
  other_user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  latest_message?: Message;
  last_message_at?: string;
}

interface CurrentUserType {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

const ChatPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null);
  const currentUserRef = useRef<CurrentUserType | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          currentUserRef.current = user;
        }

        await loadConversations();

        const token = getToken();
        socketRef.current = io(
          import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001',
          {
            auth: {
              token,
            },
          }
        );

        socketRef.current.on('connect', () => {
          console.log('Connected to socket server');
        });

        socketRef.current.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
        });

        if (currentUser) {
          socketRef.current.emit('user_online', currentUser.id);
        }

        socketRef.current.on('receive_message', (data) => {
          if (currentUserRef.current?.id === data.senderId) {
            return;
          }

          setMessages((prev) => [
            ...prev,
            {
              id: Math.random(),
              sender_id: data.senderId,
              sender: {
                id: data.senderId,
                name: data.senderName,
                avatar: data.senderAvatar,
              },
              message: data.message,
              is_read: false,
              created_at: new Date().toISOString(),
            },
          ]);
        });

        socketRef.current.on('user_typing', (data) => {
          setTypingUsers((prev) => ({
            ...prev,
            [data.userId]: data.userName,
          }));
        });

        socketRef.current.on('stop_typing', (data) => {
          setTypingUsers((prev) => {
            const newTyping = { ...prev };
            delete newTyping[data.userId];
            return newTyping;
          });
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        setIsLoading(false);
      }
    };

    initializeChat();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const loadConversations = async () => {
    try {
      const result = await chatService.getAllConversations();
      setConversations(result.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadConversationDetails = async (conversationId: number) => {
    try {
      const result = await chatService.getConversationDetails(conversationId);
      const conversation = conversations.find((c) => c.id === conversationId);
      if (conversation) {
        setSelectedConversation(conversation);
        setMessages(result.messages);

        socketRef.current?.emit('join_conversation', conversationId);

        if (currentUser) {
          await chatService.markConversationAsRead(conversationId);
        }
      }
    } catch (error) {
      console.error('Failed to load conversation details:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Send button clicked');
    console.log('newMessage:', newMessage);
    console.log('selectedConversation:', selectedConversation);
    console.log('currentUser:', currentUser);
    console.log('isSending:', isSending);
    if (!newMessage.trim() || !selectedConversation || !currentUser || isSending) {
      console.log('Cannot send: conditions not met');
      return;
    }

    setIsSending(true);
    try {
      console.log('Sending message to API...');
      const sentMessage = await chatService.sendMessage(selectedConversation.id, {
        message: newMessage,
      });
      console.log('Message sent to API:', sentMessage);

      setMessages((prev) => [...prev, sentMessage]);

      console.log('Emitting to socket...');
      socketRef.current?.emit('send_message', {
        conversationId: selectedConversation.id,
        message: newMessage,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
      });

      setNewMessage('');
      handleStopTyping();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = () => {
    if (!selectedConversation || !currentUser) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current?.emit('user_typing', {
        conversationId: selectedConversation.id,
        userId: currentUser.id,
        userName: currentUser.name,
      });
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 3000);
  };

  const handleStopTyping = () => {
    if (selectedConversation && currentUser) {
      socketRef.current?.emit('stop_typing', {
        conversationId: selectedConversation.id,
        userId: currentUser.id,
      });
    }
    setIsTyping(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-200">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-200 h-screen items-center p-4">
      <div className="flex w-full max-w-6xl h-full max-h-140 bg-white rounded shadow gap-0">
        {/* Conversation List */}
        <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Messages</h2>
          </div>
          <div>
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No conversations yet</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => loadConversationDetails(conversation.id)}
                  className={`w-full p-4 border-b border-gray-200 hover:bg-gray-100 transition text-left ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-blue-50 border-l-4 border-l-blue-500'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-400 p-2 rounded-full">
                      <User className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {conversation.other_user.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.latest_message?.message ||
                          'No messages yet'}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="bg-blue-500 text-white p-4 rounded-tr">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-full">
                    <User className="text-white" size={28} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">
                      {selectedConversation.other_user.name}
                    </h2>
                    <p className="text-sm text-blue-100">
                      {selectedConversation.other_user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex mb-4 ${
                          msg.sender_id === currentUser?.id
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`flex gap-2 max-w-xs ${
                            msg.sender_id === currentUser?.id
                              ? 'flex-row-reverse'
                              : 'flex-row'
                          }`}
                        >
                          <div className="bg-blue-400 p-2 rounded-full h-fit">
                            <User
                              className="text-white"
                              size={32}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">
                              {msg.sender.name}
                            </p>
                            <div
                              className={`rounded-2xl p-3 break-words ${
                                msg.sender_id === currentUser?.id
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-gray-800 border border-gray-200'
                              }`}
                            >
                              <p>{msg.message}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {Object.keys(typingUsers).length > 0 && (
                      <div className="flex mb-4">
                        <div className="text-sm text-gray-500">
                          {Object.values(typingUsers).join(', ')} is typing...
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="border-t border-gray-200 p-4 bg-white rounded-br"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onBlur={handleStopTyping}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !newMessage.trim()}
                    className="bg-blue-500 flex items-center gap-2 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                  >
                    {isSending ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;