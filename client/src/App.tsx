import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AccessibilityProvider } from './context/AccessibilityContext';
import Dashboard from './pages/Dashboard';
import RoutesPage from './pages/RoutesPage';
import Drivers from './pages/Drivers';
import AddBus from './pages/AddBus';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Passenger Pages
import PassengerDashboard from './pages/passenger/PassengerDashboard';
import SearchRoutes from './pages/passenger/SearchRoutes';
import BookSeats from './pages/passenger/BookSeats';
import LiveTracking from './pages/passenger/LiveTracking';
import MyTrips from './pages/passenger/MyTrips';
import Favorites from './pages/passenger/Favorites';

function App() {
  return (
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

          {/* Passenger Routes */}
          <Route path="/passenger" element={<PassengerDashboard />} />
          <Route path="/passenger/search" element={<SearchRoutes />} />
          <Route path="/passenger/book-seats" element={<BookSeats />} />
          <Route path="/passenger/tracking" element={<LiveTracking />} />
          <Route path="/passenger/trips" element={<MyTrips />} />
          <Route path="/passenger/favorites" element={<Favorites />} />
        </Routes>
      </BrowserRouter>
    </AccessibilityProvider>
  );
}

export default App;