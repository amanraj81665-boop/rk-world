import { useState, useEffect } from 'react';
import { User, Settings, Shield, CreditCard, Bell, LogOut, Award, Star, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('https://rk-world.onrender.com/api/profile');
        setProfile(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setUploadingImage(true);
        const base64String = reader.result as string;
        
        const { data } = await axios.put('https://rk-world.onrender.com/api/profile/image', {
          profileImage: base64String
        });
        
        setProfile((prev: any) => ({ ...prev, profileImage: base64String }));
        updateUser({ profileImage: base64String });
        toast.success('Profile picture updated!');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to update profile picture');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-red-500" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header Profile Card */}
      <div className="bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10 w-32 h-32 rounded-full bg-white/20 p-2 backdrop-blur-sm border-2 border-white/40 shadow-2xl flex-shrink-0 group cursor-pointer">
          <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center overflow-hidden relative">
            {profile?.profileImage || user?.profileImage ? (
              <img src={profile.profileImage || user.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} alt="Profile" className="w-full h-full object-cover bg-indigo-100" />
            )}
            
            {/* Upload Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
              {uploadingImage ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Settings size={24} className="mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                </>
              )}
            </div>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            onChange={handleImageUpload}
            disabled={uploadingImage}
          />
        </div>
        
        <div className="relative z-10 text-center md:text-left flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1">{user?.name || 'Student'}</h1>
          <p className="text-red-100 font-medium text-lg mb-4">{profile?.userClass || 'Class 12th'} • {profile?.targetExam?.includes('JEE') ? 'JEE Aspirant' : 'Student'}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {profile?.isPro && (
              <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/20 flex items-center gap-2 shadow-sm">
                <Star size={16} className="text-yellow-400 fill-yellow-400" /> Pro Member
              </span>
            )}
            <span className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-black/10 flex items-center gap-2 shadow-sm">
              <Award size={16} className="text-orange-300" /> Rank #{profile?.rank || 2} in Batch
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Settings Navigation */}
        <div className="glass-panel p-4 rounded-3xl border border-gray-100 shadow-sm h-fit">
          <nav className="space-y-2">
            {[
              { icon: <User size={20} />, label: 'Personal Information', active: true },
              { icon: <Shield size={20} />, label: 'Password & Security', active: false },
              { icon: <CreditCard size={20} />, label: 'Subscription & Billing', active: false },
              { icon: <Bell size={20} />, label: 'Notifications', active: false },
              { icon: <Settings size={20} />, label: 'App Preferences', active: false },
            ].map((item) => (
              <button 
                key={item.label}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all text-sm ${
                  item.active 
                    ? 'bg-red-50 text-red-600 border border-red-100' 
                    : 'text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-100">
              <button onClick={logout} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all text-sm text-red-500 hover:bg-red-50 hover:border-red-100 border border-transparent">
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Personal Information</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.name || ''}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user?.email || ''}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Phone Number</label>
                <input 
                  type="tel" 
                  defaultValue={profile?.phone || ''}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Target Exam</label>
                <select 
                  defaultValue={profile?.targetExam || 'JEE Main & Advanced'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all appearance-none cursor-pointer"
                >
                  <option>JEE Main & Advanced</option>
                  <option>NEET (UG)</option>
                  <option>CBSE Boards</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button type="button" className="px-6 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/30 transition-all">
                Save Changes
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;
