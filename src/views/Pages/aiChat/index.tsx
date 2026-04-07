
import { useState, useEffect, useRef } from 'react';
import { Bot, Send, Loader } from 'lucide-react';
import { aiChatService } from '@/core/api/aiChatService';

interface Message {
  id: number;
  sender: string;
  message: string;
  created_at: string;
}

const AIChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'You',
      message: newMessage,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsSending(true);

    try {
      const aiResponse = await aiChatService.sendMessage({ message: newMessage });
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'AI Assistant',
        message: 'Sorry, something went wrong. Please try again.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex justify-center bg-gray-200 h-screen items-center p-4">
      <div className="flex w-full max-w-4xl h-full max-h-140 bg-white rounded shadow gap-0 flex-col">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 rounded-t">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-full">
              <Bot className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Customer Service</h2>
              <p className="text-sm text-blue-100">Hi! I'm here to help you find the perfect rental equipment!</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Hi! I'm your customer service assistant. How can I help you today?</p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${
                    msg.sender === 'You' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex gap-2 max-w-xs ${
                      msg.sender === 'You' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className={`p-2 rounded-full h-fit ${
                      msg.sender === 'You' ? 'bg-blue-400' : 'bg-blue-400'
                    }`}>
                      {msg.sender === 'You' ? (
                        <Bot className="text-white" size={32} />
                      ) : (
                        <Bot className="text-white" size={32} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {msg.sender}
                      </p>
                      <div
                        className={`rounded-2xl p-3 break-words ${
                          msg.sender === 'You'
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-500 text-white'
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
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="border-t border-gray-200 p-4 bg-white rounded-b"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask me about our rental equipment..."
              className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isSending || !newMessage.trim()}
              className="bg-green-500 flex items-center gap-2 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {isSending ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIChatPage;