import { useState } from "react";
import {
  Bus,
  Users,
  MessageSquare,
  MapPin,
  Clock,
  Calendar,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import DriverLayout from "../../components/driver/DriverLayout";
import { useNavigate } from "react-router";

interface BookedSeat {
  id: string;
  seatNumber: string;
  passengerName: string;
  phone: string;
  from: string;
  to: string;
  fare: number;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isDriver: boolean;
}

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "chat">(
    "overview",
  );
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Admin",
      text: "Good morning! Ready for today's route?",
      time: "08:30 AM",
      isDriver: false,
    },
    {
      id: "2",
      sender: "You",
      text: "Yes, all set!",
      time: "08:32 AM",
      isDriver: true,
    },
    {
      id: "3",
      sender: "Admin",
      text: "Great! Have a safe journey.",
      time: "08:33 AM",
      isDriver: false,
    },
  ]);

  // Mock data
  const busDetails = {
    numberPlate: "WP NB-1234",
    route: "Pettah - Homagama",
    routeNo: "#138",
    departureTime: "09:00 AM",
    totalSeats: 52,
    bookedSeats: 28,
  };

  const bookedSeats: BookedSeat[] = [
    {
      id: "1",
      seatNumber: "A1",
      passengerName: "Kamal Perera",
      phone: "0771234567",
      from: "Pettah",
      to: "Nugegoda",
      fare: 50,
    },
    {
      id: "2",
      seatNumber: "A2",
      passengerName: "Nimal Silva",
      phone: "0779876543",
      from: "Borella",
      to: "Homagama",
      fare: 80,
    },
    {
      id: "3",
      seatNumber: "B1",
      passengerName: "Sunil Fernando",
      phone: "0765432109",
      from: "Pettah",
      to: "Maharagama",
      fare: 70,
    },
    {
      id: "4",
      seatNumber: "B2",
      passengerName: "Amara Jayasinghe",
      phone: "0712345678",
      from: "Kotte",
      to: "Homagama",
      fare: 60,
    },
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "You",
        text: chatMessage,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isDriver: true,
      };
      setMessages([...messages, newMessage]);
      setChatMessage("");
    }
  };

  return (
    <DriverLayout>
      <div className="p-6">
        {/* Bus Info Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Bus size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{busDetails.numberPlate}</h2>
                <p className="text-blue-100 mt-1">{busDetails.route}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                    Route {busDetails.routeNo}
                  </span>
                  <span className="text-sm flex items-center gap-1">
                    <Clock size={14} />
                    Departs: {busDetails.departureTime}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {busDetails.bookedSeats}/{busDetails.totalSeats}
              </div>
              <div className="text-blue-100 text-sm mt-1">Seats Booked</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Calendar size={18} />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "bookings"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Users size={18} />
                Booked Seats ({bookedSeats.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "chat"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageSquare size={18} />
                Chat
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Passengers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookedSeats.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <MapPin size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Available Seats</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {busDetails.totalSeats - busDetails.bookedSeats}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Clock size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Next Departure</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {busDetails.departureTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Traffic Summary Card */}
            <div
              onClick={() => navigate("/driver/route-traffic")}
              className="md:col-span-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-sm border border-orange-200 p-6 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Route Traffic Status
                    </h3>
                    <p className="text-sm text-gray-600">
                      Real-time traffic conditions on your route
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors">
                  View Details
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Light Traffic</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">3 stops</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Moderate</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">2 stops</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-600">Heavy Traffic</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">1 stop</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg border border-orange-200">
                <p className="text-xs text-orange-800">
                  ⚠️ <strong>Alert:</strong> Heavy traffic detected at Kotte.
                  Consider alternative route or inform passengers about delay.
                </p>
              </div>
            </div>

            {/* SDG Impact Card */}
            <div className="md:col-span-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    Today's Environmental Impact
                  </h3>
                  <p className="text-sm text-gray-600">
                    SDG 11: Sustainable Cities & Communities
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-gray-600 mb-1">CO₂ Saved</p>
                  <p className="text-xl font-bold text-green-600">45.2 kg</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">Fuel Efficiency</p>
                  <p className="text-xl font-bold text-blue-600">8.5 km/L</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <p className="text-xs text-gray-600 mb-1">Passengers</p>
                  <p className="text-xl font-bold text-purple-600">28</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-orange-200">
                  <p className="text-xs text-gray-600 mb-1">Cars Removed</p>
                  <p className="text-xl font-bold text-orange-600">45</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Seat
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Passenger
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      From
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      To
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Fare
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookedSeats.map((seat) => (
                    <tr
                      key={seat.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 font-semibold rounded-lg">
                          {seat.seatNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {seat.passengerName}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{seat.phone}</td>
                      <td className="px-6 py-4 text-gray-700">{seat.from}</td>
                      <td className="px-6 py-4 text-gray-700">{seat.to}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        Rs. {seat.fare}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-[500px] flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isDriver ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs ${message.isDriver ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"} rounded-2xl px-4 py-3`}
                    >
                      <p className="text-sm font-medium mb-1">
                        {message.sender}
                      </p>
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${message.isDriver ? "text-blue-100" : "text-gray-500"}`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DriverLayout>
  );
};

export default DriverDashboard;
