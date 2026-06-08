import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Smartphone, Globe, Moon } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false, digest: true });
  const [theme, setTheme] = useState('system');
  const [twoFactor, setTwoFactor] = useState(false);
  const [language, setLanguage] = useState('en');

  const Toggle = ({ checked, onChange, label, description }: any) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <p className="font-bold text-gray-900">{label}</p>
        <p className="text-sm text-gray-500 font-medium">{description}</p>
      </div>
      <button 
        onClick={onChange}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${checked ? 'bg-indigo-600' : 'bg-gray-200'}`}
      >
        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 flex items-center gap-3">
              <SettingsIcon size={40} className="text-slate-300" /> Settings
            </h1>
            <p className="text-slate-300 text-lg max-w-xl font-medium">
              Manage your application preferences, notifications, and privacy controls.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Sidebar Tabs */}
        <div className="glass-panel p-4 rounded-3xl border border-gray-100 shadow-sm h-fit">
          <nav className="space-y-2">
            {[
              { id: 'general', icon: <SettingsIcon size={20} />, label: 'General' },
              { id: 'notifications', icon: <Bell size={20} />, label: 'Notifications' },
              { id: 'privacy', icon: <Shield size={20} />, label: 'Privacy & Security' },
              { id: 'appearance', icon: <Moon size={20} />, label: 'Appearance' },
              { id: 'language', icon: <Globe size={20} />, label: 'Language & Region' },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all text-sm ${
                  activeTab === tab.id 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-3 glass-panel p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[500px]">
          
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">General Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">Default Landing Page</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none">
                    <option>Dashboard</option>
                    <option>My Courses</option>
                    <option>Live Classes</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">Download Quality</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none">
                    <option>Auto (Recommended)</option>
                    <option>High (1080p) - Uses more storage</option>
                    <option>Medium (720p)</option>
                    <option>Data Saver (480p)</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">Account Data</h3>
                <p className="text-sm text-gray-500 mb-4 font-medium">You can request an archive of your account data or permanently delete your account.</p>
                <div className="flex gap-4">
                  <button className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Request Data Archive</button>
                  <button className="px-5 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors">Delete Account</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2"><Bell className="text-indigo-500" /> Notification Settings</h2>
              <div className="bg-white border border-gray-100 rounded-2xl p-2 px-6">
                <Toggle 
                  label="Email Notifications" 
                  description="Receive daily updates and announcements via email." 
                  checked={notifications.email} 
                  onChange={() => setNotifications({...notifications, email: !notifications.email})} 
                />
                <Toggle 
                  label="Push Notifications" 
                  description="Get live class reminders and instant alerts on your device." 
                  checked={notifications.push} 
                  onChange={() => setNotifications({...notifications, push: !notifications.push})} 
                />
                <Toggle 
                  label="SMS Alerts" 
                  description="Receive SMS text messages for important security alerts." 
                  checked={notifications.sms} 
                  onChange={() => setNotifications({...notifications, sms: !notifications.sms})} 
                />
                <Toggle 
                  label="Weekly Digest" 
                  description="Get a weekly summary of your performance and upcoming tests." 
                  checked={notifications.digest} 
                  onChange={() => setNotifications({...notifications, digest: !notifications.digest})} 
                />
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2"><Shield className="text-emerald-500" /> Privacy & Security</h2>
              
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold text-emerald-900 text-lg">Two-Factor Authentication (2FA)</h3>
                  <p className="text-sm font-medium text-emerald-700 mt-1">Add an extra layer of security to your account.</p>
                </div>
                <button 
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${twoFactor ? 'bg-white text-emerald-600 border border-emerald-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                >
                  {twoFactor ? 'Enabled' : 'Enable 2FA'}
                </button>
              </div>

              <div className="mt-8">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Mac OS • Chrome</p>
                        <p className="text-xs text-gray-500 font-medium">Patna, India • Active Now</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">Current</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">iPhone 13 • Safari</p>
                        <p className="text-xs text-gray-500 font-medium">Patna, India • 2 hours ago</p>
                      </div>
                    </div>
                    <button className="text-sm font-bold text-red-500 hover:text-red-700">Logout</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2"><Moon className="text-purple-500" /> Appearance</h2>
              
              <h3 className="font-bold text-gray-700 mb-4">Theme Preference</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${theme === 'light' ? 'border-purple-500 bg-purple-50' : 'border-gray-100 bg-white hover:bg-gray-50'}`}
                >
                  <div className="w-16 h-12 bg-gray-100 rounded-md border border-gray-200 overflow-hidden flex flex-col">
                     <div className="h-3 bg-white border-b border-gray-200"></div>
                     <div className="flex-1 bg-white flex p-1 gap-1"><div className="w-2 bg-gray-200 rounded"></div><div className="flex-1 bg-gray-100 rounded"></div></div>
                  </div>
                  <span className="font-bold text-gray-900">Light Mode</span>
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${theme === 'dark' ? 'border-purple-500 bg-purple-50' : 'border-gray-100 bg-white hover:bg-gray-50'}`}
                >
                  <div className="w-16 h-12 bg-gray-900 rounded-md border border-gray-700 overflow-hidden flex flex-col">
                     <div className="h-3 bg-gray-800 border-b border-gray-700"></div>
                     <div className="flex-1 bg-black flex p-1 gap-1"><div className="w-2 bg-gray-800 rounded"></div><div className="flex-1 bg-gray-900 rounded"></div></div>
                  </div>
                  <span className="font-bold text-gray-900">Dark Mode</span>
                </button>
                <button 
                  onClick={() => setTheme('system')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${theme === 'system' ? 'border-purple-500 bg-purple-50' : 'border-gray-100 bg-white hover:bg-gray-50'}`}
                >
                  <div className="w-16 h-12 rounded-md border border-gray-300 overflow-hidden flex flex-col relative">
                     <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-900"></div>
                  </div>
                  <span className="font-bold text-gray-900">System Sync</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2"><Globe className="text-blue-500" /> Language & Region</h2>
              
              <div className="space-y-6 max-w-md">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">Display Language</label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                  >
                    <option value="en">English (US)</option>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="es">Spanish (Español)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">Timezone</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none">
                    <option>Asia/Kolkata (IST)</option>
                    <option>America/New_York (EST)</option>
                    <option>Europe/London (GMT)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2 font-medium">This will affect the timing of live classes and mock test schedules.</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Settings;
