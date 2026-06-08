import { Search, Bell, Menu, X, Book, Video as VideoIcon, FileSpreadsheet, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';

type TopNavProps = {
  onMenuClick?: () => void;
};

const TopNav = ({ onMenuClick }: TopNavProps) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userInfoStr = localStorage.getItem('userInfo');
        const token = userInfoStr ? JSON.parse(userInfoStr).token : '';
        if (!token) return;
        const res = await axios.get('https://rk-world.onrender.com/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };
    fetchNotifications();

    const socket = io('https://rk-world.onrender.com');
    socket.on('new-notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      toast('New Alert: ' + notification.title, { icon: '🔔' });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      const token = userInfoStr ? JSON.parse(userInfoStr).token : '';
      await axios.put(`https://rk-world.onrender.com/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'course': return <Book size={16} className="text-indigo-500" />;
      case 'live': return <VideoIcon size={16} className="text-red-500" />;
      case 'test': return <FileSpreadsheet size={16} className="text-orange-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md h-20 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-white/50">
      
      {/* Left section: Hamburger for Mobile */}
      <div className="flex items-center">
        <button onClick={onMenuClick} className="md:hidden text-gray-500 hover:text-indigo-600 transition-colors p-2 -ml-2 rounded-lg hover:bg-indigo-50">
          <Menu size={24} />
        </button>
        <button className="hidden md:block text-gray-500 hover:text-indigo-600 transition-colors p-2 -ml-2 rounded-lg hover:bg-indigo-50">
          <Menu size={24} />
        </button>
      </div>

      {/* Center Section: Search Bar */}
      <div className="flex-1 max-w-2xl px-6 hidden sm:flex justify-center">
        <div className="flex items-center bg-gray-100/50 hover:bg-white rounded-full px-5 py-2.5 w-full focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] border border-transparent focus-within:border-indigo-100 transition-all duration-300 group">
          <Search size={18} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors shrink-0" />
          <input
            type="text"
            placeholder="Search for courses, tests, notes..."
            className="bg-transparent border-none outline-none ml-3 text-sm w-full placeholder-gray-400 text-gray-800"
          />
        </div>
      </div>

      {/* Right Section: Icons & Profile */}
      <div className="flex items-center space-x-5 lg:space-x-8 shrink-0">
        
        {/* Notification Bell */}
        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)} className="relative p-2 text-gray-500 hover:text-indigo-600 transition-all hover:bg-indigo-50 rounded-full group">
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 scale-0 group-hover:scale-150 transition-transform duration-300"></div>
            <Bell size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <button onClick={() => setShowDropdown(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                      key={notif._id} 
                      onClick={() => handleRead(notif._id, notif.isRead)}
                      className={`px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors flex gap-3 ${notif.isRead ? 'bg-white hover:bg-gray-50' : 'bg-indigo-50/50 hover:bg-indigo-50'}`}
                    >
                      <div className="mt-1 shrink-0 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                        {getIcon(notif.type)}
                      </div>
                      <div>
                        <p className={`text-sm ${notif.isRead ? 'text-gray-700' : 'text-gray-900 font-bold'}`}>{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2"></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 p-0.5 shadow-sm group-hover:shadow-md transition-shadow">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-white">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Aman'}`} alt="Profile" className="w-full h-full object-cover" />
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">{user?.name || 'Raushan Sir'}</p>
            <p className="text-[11px] font-medium text-gray-500 leading-tight mt-0.5">{user?.role === 'admin' ? 'Admin' : 'Student'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
