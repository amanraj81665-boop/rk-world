import { Trophy, Calendar, CheckCircle, PlayCircle, BarChart3, Download, MessageSquare, Award, Book, Play, Activity, FileSpreadsheet, Video, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

type DashboardData = {
  userStats: { attendance: number; testsCompleted: number; hoursLearned: number; };
  upcomingClasses: { title: string; teacher: string; startsIn: string; }[];
  recentMaterials: { title: string; type: string; size: string; }[];
  gamification: { streak: number; xp: number; level: string; };
  personalizedFocus: { weakSubject: string; recommendationTitle: string; recommendationType: string; };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userInfoStr = localStorage.getItem('userInfo');
        const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
        const config = userInfo ? { headers: { Authorization: `Bearer ${userInfo.token}` } } : {};
        
        const response = await axios.get('http://localhost:5001/api/dashboard', config);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data, using dummy data', error);
        // Dummy data fallback
        setData({
          userStats: { attendance: 0, testsCompleted: 0, hoursLearned: 0 },
          upcomingClasses: [],
          recentMaterials: [],
          gamification: { streak: 0, xp: 0, level: "Beginner" },
          personalizedFocus: { weakSubject: "General", recommendationTitle: "Welcome Guide & Orientation", recommendationType: "Video" }
        });
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleEnroll = async (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
      if (!userInfo) {
        toast.error('Please login to enroll');
        return;
      }
      
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(`http://localhost:5001/api/courses/${courseId}/enroll`, {}, config);
      
      toast.success('Successfully enrolled in the course! 🎉');
      
      // Update local state without refreshing
      setData((prev: any) => {
        if (!prev) return prev;
        const enrolledCourse = prev.availableCourses.find((c: any) => c._id === courseId);
        return {
          ...prev,
          availableCourses: prev.availableCourses.filter((c: any) => c._id !== courseId),
          enrolledCourses: [...(prev.enrolledCourses || []), enrolledCourse]
        };
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-10 min-h-screen"
    >
      
      {/* Welcome Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          Welcome back, {user?.name ? (user.name.trim().split(' ')[0] || 'Student') : 'Student'}! <span className="text-xl md:text-2xl">👋</span>
        </h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base">Keep learning, keep growing. You've got this! 🚀</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Left Column (Main Feed - 70%) */}
        <div className="flex-1 space-y-8">
          
          {/* Hero Banner (Continue Learning) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-[32px] md:p-10 p-6 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] relative overflow-hidden group"
          >
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-white/20 transition-colors duration-1000"></div>
            <div className="absolute bottom-0 left-20 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-[60px] mix-blend-overlay"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl w-full">
                <p className="text-indigo-100 text-xs md:text-sm font-semibold tracking-wider uppercase mb-1 md:mb-2">Continue Learning</p>
                <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Physics – Work, Energy & Power</h2>
                
                {/* Progress Bar */}
                <div className="mb-6 max-w-md">
                  <div className="flex justify-between text-xs text-indigo-100 font-medium mb-2">
                    <span>R.k. W🌎RLD Academy</span>
                    <span>75% Complete</span>
                  </div>
                  <div className="h-2 w-full bg-indigo-950/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <div className="h-full bg-green-400 rounded-full relative" style={{ width: '75%' }}>
                      <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <button onClick={() => navigate('/courses')} className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95">
                  Resume Now <PlayCircle size={18} />
                </button>
              </div>

              {/* Decorative 3D Illustration Mockup */}
              <div className="hidden md:flex shrink-0 relative">
                <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl relative">
                  <Book className="w-20 h-20 text-white opacity-90" />
                  <div className="absolute -bottom-2 -left-4 w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg transform -rotate-12 border border-white/20">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-14 h-14 bg-indigo-400 rounded-xl flex items-center justify-center shadow-lg transform rotate-12 border border-white/20">
                    <Activity className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5"
          >
            <motion.div onClick={() => navigate('/analytics')} variants={itemVariants} whileHover={{ y: -5 }} className="bg-white/70 backdrop-blur-xl p-5 md:p-6 rounded-[24px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.1)] transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <CheckCircle size={20} />
                </div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Attendance</p>
              </div>
              <div className="flex items-end justify-between gap-2">
                <h3 className="text-2xl font-black text-gray-900 truncate">{data.userStats.attendance}%</h3>
                <span className="text-green-500 text-[11px] font-bold bg-green-50 px-2 py-1 rounded-md whitespace-nowrap">Start ↗</span>
              </div>
            </motion.div>

            <motion.div onClick={() => navigate('/test')} variants={itemVariants} whileHover={{ y: -5 }} className="bg-white/70 backdrop-blur-xl p-5 md:p-6 rounded-[24px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)] transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <FileSpreadsheet size={20} />
                </div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide truncate">Tests Done</p>
              </div>
              <div className="flex items-end justify-between gap-2">
                <h3 className="text-2xl font-black text-gray-900 truncate">{data.userStats.testsCompleted}</h3>
                <span className="text-gray-500 text-[11px] font-bold bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap">Take Test ↗</span>
              </div>
            </motion.div>

            <motion.div onClick={() => navigate('/analytics')} variants={itemVariants} whileHover={{ y: -5 }} className="bg-white/70 backdrop-blur-xl p-5 md:p-6 rounded-[24px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(139,92,246,0.1)] transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <Trophy size={20} />
                </div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide truncate">Current Rank</p>
              </div>
              <div className="flex items-end justify-between gap-2">
                <h3 className="text-xl font-black text-gray-900 truncate">Unranked</h3>
                <span className="text-emerald-500 text-[11px] font-bold bg-emerald-50 px-2 py-1 rounded-md whitespace-nowrap">Join ↗</span>
              </div>
            </motion.div>

            <motion.div onClick={() => navigate('/analytics')} variants={itemVariants} whileHover={{ y: -5 }} className="bg-white/70 backdrop-blur-xl p-5 md:p-6 rounded-[24px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.1)] transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                  <Award size={20} />
                </div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide truncate">XP Points</p>
              </div>
              <div className="flex items-end justify-between gap-2">
                <h3 className="text-2xl font-black text-gray-900 truncate">{data.gamification.xp}</h3>
                <span className="text-orange-500 text-[11px] font-bold bg-orange-50 px-2 py-1 rounded-md whitespace-nowrap">Earn ↗</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button onClick={() => navigate('/live')} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Video size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Join Live Class</h4>
                  <p className="text-[10px] text-gray-500">Go to live classroom</p>
                </div>
              </button>
              <button onClick={() => navigate('/library')} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Download Notes</h4>
                  <p className="text-[10px] text-gray-500">Get study materials</p>
                </div>
              </button>
              <button onClick={() => navigate('/test')} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileSpreadsheet size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Start Mock Test</h4>
                  <p className="text-[10px] text-gray-500">Test your knowledge</p>
                </div>
              </button>
              <button onClick={() => navigate('/doubts')} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Ask Doubt</h4>
                  <p className="text-[10px] text-gray-500">Get help instantly</p>
                </div>
              </button>
            </div>
          </div>

          {/* Academics (6th - 12th) */}
          {/* Enrolled Courses */}
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span> My Courses
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {data.enrolledCourses && data.enrolledCourses.length > 0 ? (
                data.enrolledCourses.map((course: any, idx: number) => (
                  <motion.div key={course._id} onClick={() => navigate('/courses')} variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} className="bg-white/80 backdrop-blur-xl rounded-[28px] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)] transition-all cursor-pointer relative">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-28 p-5 relative overflow-hidden">
                      <div className="absolute right-[-10px] top-[-10px] opacity-20 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500"><Book size={80} /></div>
                      <h4 className="text-white font-bold text-lg truncate">{course.title}</h4>
                      <p className="text-indigo-100 text-xs">{course.category}</p>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
                        <span>{course.chapters?.length || 0} Chapters</span>
                        <span>0%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center bg-white/50 rounded-2xl border border-gray-100 border-dashed">
                  <p className="text-gray-500 font-medium">You haven't enrolled in any courses yet.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span> Available Courses
              </h3>
              <button onClick={() => navigate('/courses')} className="text-indigo-600 text-sm font-bold hover:text-indigo-700 flex items-center gap-1 group">
                View All <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.availableCourses && data.availableCourses.length > 0 ? (
                data.availableCourses.slice(0, 6).map((course: any, idx: number) => (
                  <motion.div key={course._id} onClick={() => navigate('/courses')} variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} className="bg-white/80 backdrop-blur-xl rounded-[28px] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)] transition-all cursor-pointer relative">
                    <div className="bg-gradient-to-br from-orange-400 to-rose-400 h-28 p-5 relative overflow-hidden">
                      <div className="absolute right-[-10px] top-[-10px] opacity-20 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500"><Award size={80} /></div>
                      <h4 className="text-white font-bold text-lg truncate">{course.title}</h4>
                      <p className="text-orange-100 text-xs">{course.category}</p>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-2 font-medium">
                        <span>{course.chapters?.length || 0} Chapters</span>
                        <button onClick={(e) => handleEnroll(e, course._id)} className="bg-orange-100 hover:bg-orange-200 text-orange-600 px-3 py-1.5 rounded-lg font-bold transition-colors">
                          Enroll Now
                        </button>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-3">
                        <div className="h-full bg-gray-300 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center bg-white/50 rounded-2xl border border-gray-100 border-dashed">
                  <p className="text-gray-500 font-medium">No new courses available right now.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* AI Recommendation */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row items-center gap-6 justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 shrink-0 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-indigo-100">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-gray-900 text-lg">AI Recommendation</h3>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-indigo-100">Based on your performance</span>
                </div>
                <p className="text-gray-500 text-sm">We noticed you're struggling slightly with <span className="font-bold text-gray-900">{data.personalizedFocus.weakSubject}</span>.</p>
                <p className="text-gray-500 text-sm">Here is a curated module to boost your score.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 w-full md:w-auto relative z-10">
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{data.personalizedFocus.recommendationTitle}</h4>
                <p className="text-xs text-gray-500 mt-0.5">7 Lessons • 1 Quiz • 45 min</p>
              </div>
              <button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg text-sm transition-colors shadow-md shadow-indigo-600/20 whitespace-nowrap">
                Start Learning
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (Side Panel - 30%) */}
        <div className="w-full xl:w-[320px] shrink-0 space-y-6">
          
          {/* Upcoming Live Class */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Upcoming Live Class</h3>
              <button className="text-indigo-600 text-xs font-semibold hover:underline">View Calendar</button>
            </div>
            
            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              {data.upcomingClasses && data.upcomingClasses.length > 0 ? (
                <>
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest inline-block mb-3 animate-pulse shadow-sm shadow-red-500/20">Live</span>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden border border-white shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.upcomingClasses[0].teacher}`} alt="Teacher" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{data.upcomingClasses[0].title}</h4>
                      <p className="text-xs text-gray-500">By {data.upcomingClasses[0].teacher}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{data.upcomingClasses[0].startsIn}</span>
                  </div>
                  
                  <button onClick={() => navigate('/live')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-600/20">
                    <Video size={16} /> Join Live Class
                  </button>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="text-gray-400" size={20} />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">No Scheduled Classes</p>
                  <p className="text-xs text-gray-500 mt-1">Check back later or browse courses.</p>
                </div>
              )}
            </div>
          </div>

          {/* Learning Progress */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">Your Learning Progress</h3>
              <select className="text-xs bg-gray-50 border border-gray-200 text-gray-600 rounded-lg px-2 py-1 outline-none">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            
            {/* Donut Chart Mockup */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                  <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset="226" className="text-emerald-400" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-gray-900">0%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-gray-500 w-20">Completed</span>
                  <span className="font-bold text-gray-900">0%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span className="text-gray-500 w-20">In Progress</span>
                  <span className="font-bold text-gray-900">0%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span className="text-gray-500 w-20">Not Started</span>
                  <span className="font-bold text-gray-900">100%</span>
                </div>
              </div>
            </div>

            {/* Line Chart Mockup */}
            <div className="relative h-24 mt-4 flex items-end justify-between px-2 pb-6 border-b border-gray-100">
              <div className="absolute top-4 right-10 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-md z-10">0%</div>
              
              {/* SVG Line */}
              <svg className="absolute inset-0 w-full h-full pt-4 pb-6" preserveAspectRatio="none">
                <path d="M 0 60 Q 50 60, 100 60 T 200 60 T 300 60" fill="none" stroke="#4F46E5" strokeWidth="3" className="drop-shadow-sm" />
                <path d="M 0 60 Q 50 60, 100 60 T 200 60 T 300 60 L 300 100 L 0 100 Z" fill="url(#gradient)" stroke="none" opacity="0.1" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="w-full flex justify-between absolute bottom-1 left-0 text-[10px] text-gray-400 font-medium px-2">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Recent Activity</h3>
              <button className="text-indigo-600 text-xs font-semibold hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {data.recentMaterials && data.recentMaterials.length > 0 ? (
                // This section would map through actual recent materials if there were any
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <CheckCircle size={14} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900">Started Learning!</h4>
                    <p className="text-xs text-gray-500">First step taken</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">Now</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3">
                    <Award size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Welcome to R.K. W🌎RLD!</h4>
                  <p className="text-xs text-gray-500 mt-1">Start a course to see your activity here.</p>
                  <button onClick={() => navigate('/courses')} className="mt-3 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                    Browse Courses
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
