import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, EyeOff, Eye, Video, BookOpen, FileSpreadsheet, Headset, GraduationCap, Phone, ShieldCheck } from 'lucide-react';
import { playCinematicGreeting, unlockAudio } from '../utils/audio';
import heroImg from '../assets/hero.png';
import bannerImg from '../assets/banner.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'student' | 'teacher'>('student');
  
  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    unlockAudio(); // Unlock audio context synchronously with user click
    try {
      // Send the selected loginType as 'role' to ensure it matches the database
      const { data } = await axios.post('http://localhost:5001/api/auth/login', { email, password, role: loginType });
      login(data);
      toast.success('Login Successful!');
      
      playCinematicGreeting();

      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    unlockAudio();
    // Mock Google Login for prototype
    const mockGoogleUser = {
      _id: 'google_' + Math.random().toString(36).substring(2, 9),
      name: 'Demo Student',
      email: 'student@gmail.com',
      role: 'student' as const,
      token: 'mock_google_jwt_token_123',
    };
    login(mockGoogleUser);
    toast.success('Successfully logged in with Google! 🚀');

    playCinematicGreeting();

    navigate('/');
  };

  const handleSendOtp = async () => {
    if (!forgotEmail) return toast.error('Please enter your email');
    try {
      setIsForgotLoading(true);
      const { data } = await axios.post('http://localhost:5001/api/auth/forgot-password', { email: forgotEmail });
      toast.success(data.message || 'OTP sent successfully!');
      setForgotStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!forgotOtp) return toast.error('Please enter the OTP');
    try {
      setIsForgotLoading(true);
      const { data } = await axios.post('http://localhost:5001/api/auth/verify-otp', { email: forgotEmail, otp: forgotOtp });
      toast.success(data.message || 'OTP verified!');
      setForgotStep(3);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    try {
      setIsForgotLoading(true);
      const { data } = await axios.post('http://localhost:5001/api/auth/reset-password', { email: forgotEmail, otp: forgotOtp, newPassword });
      toast.success(data.message || 'Password reset successfully! Please login.');
      setShowForgotModal(false);
      setForgotStep(1);
      setForgotEmail('');
      setForgotOtp('');
      setNewPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsForgotLoading(false);
    }
  };

  // Shared form JSX to avoid duplication
  const renderForm = (isMobile: boolean) => (
    <div className={`w-full ${isMobile ? '' : 'max-w-[420px] bg-white rounded-[32px] p-8 sm:p-10 shadow-2xl relative border border-gray-100 my-auto mb-8 lg:mb-auto'}`}>
      
      {!isMobile && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back! 👋</h2>
          <p className="text-gray-500 text-sm font-medium">Log in to continue your learning journey.</p>
        </div>
      )}

      {/* Login Type Toggle */}
      <div className={`flex ${isMobile ? 'mb-8 pt-2' : 'p-1.5 bg-gray-50 rounded-2xl mb-8 border border-gray-100'}`}>
        <button 
          type="button"
          onClick={() => setLoginType('student')}
          className={isMobile 
            ? `flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 ${loginType === 'student' ? 'border-[#8B5CF6] text-[#8B5CF6]' : 'border-transparent text-gray-400'}`
            : `flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${loginType === 'student' ? 'bg-white text-[#8B5CF6] shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`
          }
        >
          {isMobile ? (
            <div className="w-4 h-4 rounded-full border-2 border-[#8B5CF6] flex items-center justify-center"><div className={`w-2 h-2 rounded-full ${loginType === 'student' ? 'bg-[#8B5CF6]' : 'bg-transparent'}`}></div></div>
          ) : (
            <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-[#8B5CF6]"></div></div>
          )}
          Student Login
        </button>
        <button 
          type="button"
          onClick={() => setLoginType('teacher')}
          className={isMobile 
            ? `flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 ${loginType === 'teacher' ? 'border-[#8B5CF6] text-[#8B5CF6]' : 'border-gray-100 text-gray-400'}`
            : `flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${loginType === 'teacher' ? 'bg-white text-[#8B5CF6] shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`
          }
        >
          {isMobile ? (
             <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center"><div className={`w-2 h-2 rounded-full ${loginType === 'teacher' ? 'bg-[#8B5CF6]' : 'bg-transparent'}`}></div></div>
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
          )}
          Teacher Login
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Email or Phone Number</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-500 transition-colors">
              <Mail size={18} />
            </div>
            <input 
              type="text" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-sm shadow-[0_0_0_1000px_white_inset,0_1px_2px_0_rgba(0,0,0,0.05)] selection:bg-red-500 selection:text-white"
              placeholder="Enter your email or phone number"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-500 transition-colors">
              <Lock size={18} />
            </div>
            <input 
              type={showPassword ? 'text' : 'password'}
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-12 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-sm shadow-[0_0_0_1000px_white_inset,0_1px_2px_0_rgba(0,0,0,0.05)] selection:bg-red-500 selection:text-white"
              placeholder="Enter your password"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          <div className="flex justify-end mt-3">
            <button 
              type="button" 
              onClick={() => {
                setShowForgotModal(true);
                setForgotStep(1);
                setForgotEmail(email); // Pre-fill if they typed something
              }}
              className="text-xs font-bold text-[#8B5CF6] hover:text-[#7C3AED] mt-2 block text-right w-full"
            >
              Forgot Password?
            </button>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#8B5CF6]/30 transition-all hover:-translate-y-0.5 text-base mt-2 flex justify-center items-center gap-2"
        >
          Login {isMobile && <span>→</span>}
        </button>
      </form>

      <div className="mt-8 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-gray-400 font-medium">or continue with</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button 
          type="button" 
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-2xl transition-all text-sm shadow-sm hover:-translate-y-0.5 active:translate-y-0"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Google
        </button>
        <button 
          type="button" 
          onClick={() => toast.success('Microsoft login coming soon!')}
          className="flex items-center justify-center gap-2 w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-2xl transition-all text-sm shadow-sm hover:-translate-y-0.5 active:translate-y-0"
        >
          <img src="https://www.svgrepo.com/show/448234/microsoft.svg" alt="Microsoft" className="w-5 h-5" />
          Microsoft
        </button>
      </div>

      <p className="mt-8 text-center text-gray-600 text-sm font-medium pb-2">
        Don't have an account? <Link to="/register" className="text-[#8B5CF6] hover:text-[#7C3AED] font-bold ml-1">Sign Up</Link>
      </p>
    </div>
  );

  return (
    <>
      {/* =========================================
          MOBILE LAYOUT (Hidden on Desktop)
          ========================================= */}
      <div className="flex lg:hidden min-h-screen bg-[#F8F9FE] flex-col relative overflow-hidden font-sans">
        {/* Purple Background Blob */}
        <div className="absolute top-24 right-[-30%] w-[350px] h-[350px] bg-[#8B5CF6] rounded-full blur-[0px] opacity-100"></div>
        
        {/* Top Header */}
        <div className="relative z-20 px-6 pt-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-red-500/30">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="12" r="6" fill="currentColor" />
                <path d="M8 20 Q 14 18 19 21 L 19 32 Q 14 29 8 31 Z" fill="currentColor" />
                <path d="M32 20 Q 26 18 21 21 L 21 32 Q 26 29 32 31 Z" stroke="currentColor" strokeWidth="3.5" fill="transparent" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-[#1A1A3A] font-extrabold tracking-tight text-2xl leading-none mt-1">
                <span className="text-red-500">R.K.</span> W🌎RLD
              </h2>
            </div>
          </div>
          <p className="text-gray-500 text-[10px] mt-3 font-bold ml-1">
            Competitive exams | 11th - 12th | Class 6th to 10th
          </p>

          <div className="mt-8">
            <h1 className="text-[40px] font-black text-[#1A1A3A] leading-[1.1] tracking-tight">
              Welcome<br/><span className="text-[#8B5CF6]">Back!</span> <span className="inline-block">👋</span>
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-3 max-w-[200px]">
              Login to continue your learning journey.
            </p>
          </div>
        </div>

        {/* Hero Image */}
        <div className="absolute top-[80px] right-[-10%] w-[65%] z-20 pointer-events-none flex justify-end">
          <img src={heroImg} alt="Aman Raj" className="w-full object-contain drop-shadow-2xl scale-[1.15]" />
        </div>

        {/* Bottom Form Card */}
        <div className="relative z-30 mt-auto bg-white w-full rounded-t-[40px] px-6 pt-8 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] flex flex-col">
          {renderForm(true)}
          
          <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-[11px] font-semibold">
             <ShieldCheck size={14} className="text-[#8B5CF6]" />
             100% Secure & Trusted Platform
          </div>
        </div>
      </div>


      {/* =========================================
          DESKTOP LAYOUT (Hidden on Mobile)
          ========================================= */}
      <div className="hidden lg:flex min-h-screen bg-[#06041A] font-sans items-center justify-center p-8 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-[1400px] w-full min-h-[800px] my-8 lg:my-auto bg-[#0A0826]/60 backdrop-blur-xl border border-white/5 rounded-[40px] flex flex-col lg:flex-row overflow-hidden relative shadow-2xl shadow-indigo-500/10">
          
          {/* Top Left Logo (Absolute inside container) */}
          <div className="absolute top-8 left-8 flex items-center gap-3 z-30">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/30">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="12" r="6" fill="currentColor" />
                <path d="M8 20 Q 14 18 19 21 L 19 32 Q 14 29 8 31 Z" fill="currentColor" />
                <path d="M32 20 Q 26 18 21 21 L 21 32 Q 26 29 32 31 Z" stroke="currentColor" strokeWidth="3.5" fill="transparent" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-extrabold tracking-wider text-xl leading-none mt-1"><span className="text-red-500">R.K.</span> W🌎RLD</h2>
            </div>
          </div>

          {/* Left Side: Branding */}
          <div className="hidden lg:flex w-3/5 relative flex-col justify-center pl-16 z-10">
            
            {/* Promotional Banner centered on left side */}
            <div className="relative w-[480px] z-30 rounded-[32px] overflow-hidden shadow-2xl shadow-red-500/10 border-2 border-white/5 mx-auto -mt-12">
              <img src={bannerImg} alt="R.K. World Promo" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>

          {/* Bottom Feature Bar */}
          <div className="absolute bottom-0 left-0 w-3/5 p-8 hidden lg:flex justify-between items-center z-30 bg-gradient-to-t from-[#0A0826] to-transparent pointer-events-none">
            <div className="flex gap-16 ml-16">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0B0921]/80 border border-white/10 text-indigo-400 flex items-center justify-center backdrop-blur-md"><Video size={20} /></div>
                <div>
                  <h4 className="text-white font-bold text-sm">Live Classes</h4>
                  <p className="text-indigo-300/60 text-[10px]">Interactive live sessions</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0B0921]/80 border border-white/10 text-indigo-400 flex items-center justify-center backdrop-blur-md"><BookOpen size={20} /></div>
                <div>
                  <h4 className="text-white font-bold text-sm">Study Material</h4>
                  <p className="text-indigo-300/60 text-[10px]">Notes & resources</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0B0921]/80 border border-white/10 text-indigo-400 flex items-center justify-center backdrop-blur-md"><FileSpreadsheet size={20} /></div>
                <div>
                  <h4 className="text-white font-bold text-sm">Mock Tests</h4>
                  <p className="text-indigo-300/60 text-[10px]">Practice & improve</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0B0921]/80 border border-white/10 text-indigo-400 flex items-center justify-center backdrop-blur-md"><Headset size={20} /></div>
                <div>
                  <h4 className="text-white font-bold text-sm">24/7 Support</h4>
                  <p className="text-indigo-300/60 text-[10px]">We're here to help</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full lg:w-2/5 flex items-center justify-center p-6 lg:p-10 z-30 relative bg-transparent">
            {renderForm(false)}
          </div>
          
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06041A]/80 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-2xl font-black text-gray-900 mb-2">
              {forgotStep === 1 ? 'Reset Password' : forgotStep === 2 ? 'Enter OTP' : 'New Password'}
            </h2>
            <p className="text-gray-500 text-sm font-medium mb-6">
              {forgotStep === 1 
                ? 'Enter your registered email to receive an OTP.' 
                : forgotStep === 2 
                ? `We've sent a 6-digit OTP to ${forgotEmail}`
                : 'Create a new, strong password.'}
            </p>

            <div className="space-y-4">
              {forgotStep === 1 && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:bg-white transition-all text-sm"
                      placeholder="admin@rkworld.com"
                    />
                  </div>
                  <button 
                    onClick={handleSendOtp}
                    disabled={isForgotLoading}
                    className="w-full mt-6 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-indigo-500/30 disabled:opacity-70"
                  >
                    {isForgotLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              )}

              {forgotStep === 2 && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">6-Digit OTP</label>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-center text-2xl tracking-[0.5em] font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:bg-white transition-all"
                    placeholder="------"
                  />
                  <button 
                    onClick={handleVerifyOtp}
                    disabled={isForgotLoading}
                    className="w-full mt-6 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-indigo-500/30 disabled:opacity-70"
                  >
                    {isForgotLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              )}

              {forgotStep === 3 && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-12 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:bg-white transition-all text-sm"
                      placeholder="At least 6 characters"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  <button 
                    onClick={handleResetPassword}
                    disabled={isForgotLoading}
                    className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-green-500/30 disabled:opacity-70"
                  >
                    {isForgotLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Login;
