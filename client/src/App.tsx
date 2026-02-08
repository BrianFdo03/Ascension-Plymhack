import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { SocketProvider } from "./context/SocketContext";
import Dashboard from "./pages/Dashboard";
import RoutesPage from "./pages/RoutesPage";
import Drivers from "./pages/Drivers";
import AddBus from "./pages/AddBus";
import AdminChat from "./pages/AdminChat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Passenger Pages
import PassengerDashboard from "./pages/passenger/PassengerDashboard";
import SearchRoutes from "./pages/passenger/SearchRoutes";
import BookSeats from "./pages/passenger/BookSeats";
import LiveTracking from "./pages/passenger/LiveTracking";
import MyTrips from "./pages/passenger/MyTrips";
import Favorites from "./pages/passenger/Favorites";

// Driver Pages
import DriverDashboard from "./pages/driver/DriverDashboard";
import BookedSeats from "./pages/driver/BookedSeats";
import DriverTracking from "./pages/driver/LiveTracking";
import DriverChat from "./pages/driver/Chat";
import RouteTraffic from "./pages/driver/RouteTraffic";

function App() {
  return (
    <SocketProvider>
      <AccessibilityProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/add-bus" element={<AddBus />} />
            <Route path="/admin-chat" element={<AdminChat />} />

            {/* Passenger Routes */}
            <Route path="/passenger" element={<PassengerDashboard />} />
            <Route path="/passenger/search" element={<SearchRoutes />} />
            <Route path="/passenger/book-seats" element={<BookSeats />} />
            <Route path="/passenger/tracking" element={<LiveTracking />} />
            <Route path="/passenger/trips" element={<MyTrips />} />
            <Route path="/passenger/favorites" element={<Favorites />} />

            {/* Driver Routes */}
            <Route path="/driver" element={<DriverDashboard />} />
            <Route path="/driver/bookings" element={<BookedSeats />} />
            <Route path="/driver/tracking" element={<DriverTracking />} />
            <Route path="/driver/route-traffic" element={<RouteTraffic />} />
            <Route path="/driver/chat" element={<DriverChat />} />
          </Routes>
        </BrowserRouter>
      </AccessibilityProvider>
    </SocketProvider>
  );
}

export default App;
