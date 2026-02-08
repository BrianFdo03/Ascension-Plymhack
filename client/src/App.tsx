import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { NotificationToast } from './components/common/NotificationToast';
import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import RoutesPage from './pages/RoutesPage';
import Drivers from './pages/Drivers';
import AddBus from './pages/AddBus';
import AdminChat from './pages/AdminChat';
import AdminNotifications from './pages/AdminNotifications';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Passenger Pages
import PassengerDashboard from './pages/passenger/PassengerDashboard';
import SearchRoutes from './pages/passenger/SearchRoutes';
import BookSeats from './pages/passenger/BookSeats';
import LiveTracking from './pages/passenger/LiveTracking';
import MyTrips from './pages/passenger/MyTrips';
import Favorites from './pages/passenger/Favorites';

// Driver Pages
import DriverDashboard from './pages/driver/DriverDashboard';
import BookedSeats from './pages/driver/BookedSeats';
import DriverTracking from './pages/driver/LiveTracking';
import DriverChat from './pages/driver/Chat';
import RouteTraffic from './pages/driver/RouteTraffic';

// Wrapper component to handle notifications based on route
function AppContent() {
  const location = useLocation();
  const [userType, setUserType] = useState<'driver' | 'passenger' | 'admin'>('passenger');
  const [userId, setUserId] = useState('user-123'); // This should come from auth

  useEffect(() => {
    // Determine user type based on route
    if (location.pathname.startsWith('/driver')) {
      setUserType('driver');
      setUserId('driver-123'); // Replace with actual driver ID from auth
    } else if (location.pathname.startsWith('/passenger')) {
      setUserType('passenger');
      setUserId('passenger-123'); // Replace with actual passenger ID from auth
    } else {
      setUserType('admin');
      setUserId('admin-123'); // Replace with actual admin ID from auth
    }
  }, [location.pathname]);

  return (
    <NotificationProvider userId={userId} userType={userType}>
      <NotificationToast />
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trips" element={<RoutesPage />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/add-bus" element={<AddBus />} />
        <Route path="/admin-chat" element={<AdminChat />} />
        <Route path="/admin-notifications" element={<AdminNotifications />} />

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
    </NotificationProvider>
  );
}

function App() {
  return (
    <SocketProvider>
      <AccessibilityProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AccessibilityProvider>
    </SocketProvider>
  );
}

export default App;