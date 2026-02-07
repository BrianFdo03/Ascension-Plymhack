import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Dashboard from './pages/Dashboard';
import RoutesPage from './pages/RoutesPage';
import Drivers from './pages/Drivers';
import AddBus from './pages/AddBus';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trips" element={<RoutesPage />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/add-bus" element={<AddBus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;