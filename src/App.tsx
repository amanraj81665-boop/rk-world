import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import LiveClassroom from './pages/LiveClassroom';
import MockTest from './pages/MockTest';
import Courses from './pages/Courses';
import DoubtEngine from './pages/DoubtEngine';
import Library from './pages/Library';
import Analytics from './pages/Analytics';
import Assignments from './pages/Assignments';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import UpgradePro from './pages/UpgradePro';
import CommunityChat from './pages/CommunityChat';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans text-gray-900">
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Main Application) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/doubts" element={<DoubtEngine />} />
                <Route path="/library" element={<Library />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/upgrade" element={<UpgradePro />} />
                <Route path="/community" element={<CommunityChat />} />
                <Route element={<ProtectedRoute adminOnly={true} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
              </Route>
              <Route path="/live" element={<LiveClassroom />} />
              <Route path="/test" element={<MockTest />} />
            </Route>
            
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
