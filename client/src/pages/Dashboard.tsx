import { useState, useEffect } from 'react';
import Layout from "../components/layout/Layout";
import DashboardStats from "../components/dashboard/DashboardStats";
import RevenueCharts from "../components/dashboard/RevenueCharts";
import { Button } from "../components/common/Button";
import HighRevenueRoutes from '../components/dashboard/highRevenueRoutes';
import { MessageSquare, X, Send } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router';

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isAdmin: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  // Join admin room and listen for messages
  useEffect(() => {
    if (socket) {
      socket.emit('join', { userId: 'admin-1', userType: 'admin', userName: 'Admin' });

      socket.on('receive_message', (data: any) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          sender: data.sender,
          text: data.message,
          time: new Date(data.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          isAdmin: false,
        };
        setMessages(prev => [...prev, newMessage]);
        
        // Increment unread count if widget is closed
        if (!showChatWidget) {
          setUnreadCount(prev => prev + 1);
        }
      });

      return () => {
        socket.off('receive_message');
      };
    }
  }, [socket, showChatWidget]);

  // Reset unread count when widget is opened
  useEffect(() => {
    if (showChatWidget) {
      setUnreadCount(0);
    }
  }, [showChatWidget]);

  const handleSendMessage = () => {
    if (chatMessage.trim() && socket) {
      // Broadcast to all drivers from dashboard widget
      const messageData = {
        message: chatMessage,
        sender: 'Admin',
        timestamp: new Date().toISOString(),
      };

      socket.emit('send_broadcast', messageData);

      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'You (Broadcast)',
        text: chatMessage,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isAdmin: true,
      };
      setMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // @ts-ignore - handleRefresh reserved for future use
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <Layout
        title="Dashboard Overview"
        action={
          <Button asChild>
            <a
              href="https://docs.google.com/spreadsheets/d/1kLs8Gc7RP-zruKhptf0rkTNszhnlrdzbZ46lQApEeEU/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              See Messages
            </a>
          </Button>
        }
      >
        <DashboardStats refreshKey={refreshKey} />
        <HighRevenueRoutes />
        <RevenueCharts />
      </Layout>

      {/* Chat Widget Button */}
      {!showChatWidget && (
        <button
          onClick={() => setShowChatWidget(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50"
        >
          <MessageSquare size={28} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Widget */}
      {showChatWidget && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Driver Chat</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                  <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/admin-chat')}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors"
              >
                Full View
              </button>
              <button
                onClick={() => setShowChatWidget(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No messages yet</p>
                  <p className="text-xs text-gray-400 mt-1">Start chatting with drivers</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${message.isAdmin ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 border border-gray-200'} rounded-2xl px-3 py-2 shadow-sm`}>
                    <p className={`text-xs font-medium mb-1 ${message.isAdmin ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.sender}
                    </p>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.isAdmin ? 'text-blue-100' : 'text-gray-400'}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatMessage.trim() || !isConnected}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Press Enter to send</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
