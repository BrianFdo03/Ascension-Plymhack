import { useState, useEffect, useRef } from 'react';
import Layout from '../components/layout/Layout';
import { MessageSquare, Send, Users, Radio } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

interface Message {
    id: string;
    sender: string;
    text: string;
    time: string;
    isAdmin: boolean;
    isBroadcast?: boolean;
    driverId?: string;
}

interface Driver {
    userId: string;
    userName: string;
    socketId: string;
}

const AdminChat = () => {
    const { socket, isConnected } = useSocket();
    const [chatMessage, setChatMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineDrivers, setOnlineDrivers] = useState<Driver[]>([]);
    const [selectedDriver, setSelectedDriver] = useState<string | null>(null); // null = broadcast
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Join admin room on mount
    useEffect(() => {
        if (socket) {
            socket.emit('join', { userId: 'admin-1', userType: 'admin', userName: 'Admin' });

            // Listen for drivers list updates
            socket.on('drivers_update', (drivers: Driver[]) => {
                setOnlineDrivers(drivers);
            });

            // Listen for incoming messages
            socket.on('receive_message', (data: any) => {
                const newMessage: Message = {
                    id: Date.now().toString(),
                    sender: data.sender,
                    text: data.message,
                    time: new Date(data.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    isAdmin: false,
                    isBroadcast: data.isBroadcast,
                    driverId: data.senderId,
                };
                setMessages(prev => [...prev, newMessage]);
            });

            return () => {
                socket.off('receive_message');
                socket.off('drivers_update');
            };
        }
    }, [socket]);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (chatMessage.trim() && socket) {
            if (selectedDriver === null) {
                // Broadcast to all drivers
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
                    isBroadcast: true,
                };
                setMessages(prev => [...prev, newMessage]);
            } else {
                // Direct message to specific driver
                const messageData = {
                    message: chatMessage,
                    sender: 'Admin',
                    senderType: 'admin',
                    recipientId: selectedDriver,
                    timestamp: new Date().toISOString(),
                };

                socket.emit('send_direct_message', messageData);

                const driver = onlineDrivers.find(d => d.userId === selectedDriver);
                const newMessage: Message = {
                    id: Date.now().toString(),
                    sender: `You → ${driver?.userName || 'Driver'}`,
                    text: chatMessage,
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    isAdmin: true,
                    isBroadcast: false,
                };
                setMessages(prev => [...prev, newMessage]);
            }
            
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
        <Layout title="Driver Communication">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Driver Communication</h1>
                        <p className="text-gray-500 mt-1">Real-time chat with drivers</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                        <span className="text-sm font-medium text-blue-700">
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                </div>

                {/* Active Drivers */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Users size={20} className="text-blue-600" />
                        <h3 className="font-semibold text-gray-900">Active Drivers ({onlineDrivers.length})</h3>
                    </div>

                    {/* Broadcast Option */}
                    <div 
                        onClick={() => setSelectedDriver(null)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 mb-3 cursor-pointer transition-all ${
                            selectedDriver === null 
                                ? 'bg-blue-50 border-blue-500' 
                                : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                        }`}
                    >
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white">
                            <Radio size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">Broadcast to All</p>
                            <p className="text-xs text-gray-600">Send message to all drivers</p>
                        </div>
                        {selectedDriver === null && (
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        )}
                    </div>

                    {/* Individual Drivers */}
                    {onlineDrivers.length === 0 ? (
                        <div className="text-center py-4 text-gray-500 text-sm">
                            No drivers online
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {onlineDrivers.map((driver) => (
                                <div 
                                    key={driver.userId}
                                    onClick={() => setSelectedDriver(driver.userId)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                        selectedDriver === driver.userId 
                                            ? 'bg-blue-50 border-blue-500' 
                                            : 'bg-white border-gray-200 hover:border-blue-300'
                                    }`}
                                >
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {driver.userName.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{driver.userName}</p>
                                        <p className="text-xs text-gray-600">ID: {driver.userId}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        <span className="text-xs text-green-700 font-medium">Online</span>
                                    </div>
                                    {selectedDriver === driver.userId && (
                                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Chat Container */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-[calc(100vh-400px)] flex flex-col">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                    {selectedDriver === null ? <Radio size={20} className="text-white" /> : <MessageSquare size={20} className="text-white" />}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {selectedDriver === null 
                                            ? 'Broadcast to All Drivers' 
                                            : `Chat with ${onlineDrivers.find(d => d.userId === selectedDriver)?.userName || 'Driver'}`
                                        }
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {selectedDriver === null 
                                            ? `${onlineDrivers.length} drivers will receive this message` 
                                            : 'Direct message'
                                        }
                                    </p>
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
                                        <p className="text-sm text-gray-400 mt-1">Start a conversation with drivers</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-md ${message.isAdmin ? (message.isBroadcast ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-blue-600') + ' text-white' : 'bg-white text-gray-900 border border-gray-200'} rounded-2xl px-4 py-3 shadow-sm`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className={`text-xs font-medium ${message.isAdmin ? 'text-blue-100' : 'text-gray-500'}`}>
                                                        {message.sender}
                                                    </p>
                                                    {message.isBroadcast && message.isAdmin && (
                                                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">📢 Broadcast</span>
                                                    )}
                                                </div>
                                                <p className="text-sm leading-relaxed">{message.text}</p>
                                                <p className={`text-xs mt-2 ${message.isAdmin ? 'text-blue-100' : 'text-gray-400'}`}>
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
                                    placeholder="Type your message to drivers..."
                                    rows={2}
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!chatMessage.trim() || !isConnected}
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
        </Layout>
    );
};

export default AdminChat;
