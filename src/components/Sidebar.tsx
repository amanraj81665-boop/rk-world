import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileSpreadsheet, HelpCircle, Video, Library as LibraryIcon, BarChart3, User, Settings, LogOut, Atom, Crown, Users, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, name: 'Dashboard', path: '/' },
    { icon: <BookOpen size={20} />, name: 'My Courses', path: '/courses' },
    { icon: <Video size={20} />, name: 'Live Classes', path: '/live' },
    { icon: <FileSpreadsheet size={20} />, name: 'Mock Tests', path: '/test' },
    { icon: <FileText size={20} />, name: 'Assignments', path: '/assignments' },
    { icon: <LibraryIcon size={20} />, name: 'E-Library', path: '/library' },
    { icon: <HelpCircle size={20} />, name: 'Doubt Engine', path: '/doubts' },
    { icon: <Users size={20} />, name: 'Community', path: '/community' },
    { icon: <BarChart3 size={20} />, name: 'Analytics', path: '/analytics' },
    { icon: <User size={20} />, name: 'Profile', path: '/profile' },
    { icon: <Settings size={20} />, name: 'Settings', path: '/settings' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ icon: <Crown size={20} />, name: 'Admin Panel', path: '/admin' });
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`w-[280px] bg-[#0F172A] flex flex-col shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out scrollbar-hide shrink-0
        fixed inset-y-0 left-0 z-40 md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Section */}
        <div className="flex items-center gap-3 p-6 pt-8">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/40 border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 blur-md group-hover:scale-150 transition-transform duration-500"></div>
            <Atom size={24} className="text-white relative z-10 animate-[spin_10s_linear_infinite]" />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl tracking-tight">
              <span className="text-red-500">R.K.</span> <span className="text-white">W🌎RLD</span>
            </h1>
          </div>
        </div>

        {/* Profile Section */}
        <div className="p-6 text-center border-b border-indigo-500/30 bg-gradient-to-b from-indigo-900/50 to-transparent">
        <div className="w-20 h-20 mx-auto rounded-full bg-indigo-100 p-1 mb-3 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
          <div className="w-full h-full rounded-full overflow-hidden bg-white">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Aman'}`} alt="Profile" className="w-full h-full object-cover" />
            )}
          </div>
        </div>
          <h2 className="text-white font-bold text-lg tracking-wide">{user?.name || 'Raushan Sir'}</h2>
          <div className="bg-indigo-600/20 px-3 py-1 rounded-full mt-1.5 border border-indigo-500/30">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{user?.role === 'admin' ? 'Administrator' : 'Student'}</p>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center leading-relaxed">
            Class 12th Student<br/>School of IT - JEE Preparation<br/>R.K. W🌎RLD Academy
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 relative">
          {/* Subtle ambient light in sidebar */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none"></div>
          
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => { if(window.innerWidth < 768 && onClose) onClose(); }}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm tracking-wide">{item.name}</span>
                  {isActive && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                  )}
                  {item.name === 'Live Classes' && !isActive && (
                    <span className="absolute right-4 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">Live</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Upgrade Card */}
        {!user?.isPro && (
          <div className="px-5 py-4 mt-2">
            <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 rounded-2xl p-4 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl group-hover:bg-yellow-500/20 transition-colors"></div>
              <div className="flex items-center gap-2 mb-2">
                <Crown size={18} className="text-yellow-400" />
                <h4 className="text-white font-bold text-sm">Upgrade to Pro</h4>
              </div>
              <p className="text-slate-400 text-xs mb-4 leading-relaxed">Unlock all courses, mock tests, live classes & more.</p>
              <button onClick={() => {
                navigate('/upgrade');
                if (onClose) onClose();
              }} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-600/20">
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="p-5 border-t border-white/5 mt-2">
          <button 
            onClick={() => {
              logout();
              if (onClose) onClose();
            }}
            className="flex items-center space-x-3 w-full px-4 text-slate-400 hover:text-red-400 transition-colors font-medium text-sm group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
