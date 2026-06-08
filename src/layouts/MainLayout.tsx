import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Only show the massive footer on the main dashboard page
  const showFooter = location.pathname === '/' || location.pathname === '/dashboard';

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] relative font-sans text-gray-900">
      {/* Subtle Premium Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-100/40 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-100/30 blur-[150px] animate-pulse" style={{ animationDuration: '14s' }}></div>
        <div className="absolute bottom-[-20%] left-[10%] w-[50%] h-[50%] rounded-full bg-purple-100/40 blur-[130px] animate-pulse" style={{ animationDuration: '12s' }}></div>
      </div>

      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden z-0 relative">
        <TopNav onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto flex flex-col z-0">
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
          {showFooter && <Footer />}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
