import { useState, useEffect, useRef } from 'react';
import DriverLayout from '../../components/driver/DriverLayout';
import { MessageSquare, Send } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

interface Message {
    id: string;
    sender: string;
    text: string;
    time: string;
    isDriver: boolean;
}

const Chat = () => {
    const { socket, isConnected } = useSocket();
    const [chatMessage, setChatMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Join driver room on mount
    useEffect(() => {
        if (socket) {
            socket.emit('join', { 
                userId: 'driver-1', 
                userType: 'driver',
                userName: 'Sunil Perera'
            });

            // Listen for incoming messages
            socket.on('receive_message', (data: any) => {
                const newMessage: Message = {
                    id: Date.now().toString(),
                    sender: data.isBroadcast ? `${data.sender} (Broadcast 📢)` : data.sender,
                    text: data.message,
                    time: new Date(data.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    isDriver: false,
                };
                setMessages(prev => [...prev, newMessage]);
            });

            return () => {
                socket.off('receive_message');
            };
        }
    }, [socket]);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (chatMessage.trim() && socket) {
            const messageData = {
                message: chatMessage,
                sender: 'Driver (Sunil Perera)',
                senderType: 'driver',
                senderId: 'driver-1',
                timestamp: new Date().toISOString(),
            };

            // Send direct message to admin
            socket.emit('send_direct_message', messageData);

            // Add to local messages
            const newMessage: Message = {
                id: Date.now().toString(),
                sender: 'You',
                text: chatMessage,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                isDriver: true,
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

    return (
        <DriverLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Chat with Admin</h1>
                    <p className="text-gray-500 mt-1">Communicate with the admin team</p>
                </div>

                {/* Chat Container */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-[calc(100vh-250px)] flex flex-col">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                    <MessageSquare size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Admin Support</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                        <span className="text-xs text-gray-500">{isConnected ? 'Connected' : 'Disconnected'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                            {messages.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <MessageSquare size={48} className="text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No messages yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Start a conversation with admin</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.isDriver ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-md ${message.isDriver ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 border border-gray-200'} rounded-2xl px-4 py-3 shadow-sm`}>
                                                <p className="text-xs font-medium mb-1 ${message.isDriver ? 'text-blue-100' : 'text-gray-500'}">
                                                    {message.sender}
                                                </p>
                                                <p className="text-sm leading-relaxed">{message.text}</p>
                                                <p className={`text-xs mt-2 ${message.isDriver ? 'text-blue-100' : 'text-gray-400'}`}>
                                                    {message.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-gray-200 p-4 bg-white">
                            <div className="flex items-end gap-3">
                                <textarea
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    rows={2}
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!chatMessage.trim()}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center gap-2 h-[52px]"
                                >
                                    <Send size={18} />
                                    Send
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Press Enter to send, Shift + Enter for new line</p>
                        </div>
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
};

export default Chat;
