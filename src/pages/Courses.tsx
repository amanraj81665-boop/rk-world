import { useState, useEffect } from 'react';
import { PlayCircle, Clock, FileText, CheckCircle2, MessageSquare, Download, Settings, Maximize, Play, Pause, Volume2, FastForward, BookOpen } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'dpp' | 'doubts'>('notes');
  const [activeChapter, setActiveChapter] = useState(1);
  const [courseData, setCourseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userInfoStr = localStorage.getItem('userInfo');
        const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
        const token = userInfo?.token;

        // Fetch enrolled courses from the dashboard API
        const { data } = await axios.get('https://rk-world.onrender.com/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data && data.enrolledCourses && data.enrolledCourses.length > 0) {
          setCourseData(data.enrolledCourses[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] max-w-lg mx-auto text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-48 h-48 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="text-red-400 w-24 h-24" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">No Courses Yet!</h2>
        <p className="text-gray-500 text-lg font-medium">
          You haven't purchased or enrolled in any courses right now. Visit the dashboard to explore our premium batches and start your learning journey!
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-2xl shadow-[0_10px_25px_rgba(239,68,68,0.4)] hover:shadow-[0_15px_35px_rgba(239,68,68,0.6)] hover:-translate-y-1 transition-all"
        >
          Explore Courses
        </button>
      </div>
    );
  }

  const chapters = courseData.chapters || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{courseData.title}</h1>
          <p className="text-gray-500 font-medium mt-1">{courseData.module} • By {courseData.teacher}</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm font-bold text-gray-700">{courseData.isActive ? 'Course Active' : 'Completed'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Video & Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Smart Video Player */}
          <div className="glass-panel rounded-3xl overflow-hidden shadow-md">
            {/* Video Container (Simulated) */}
            <div className="w-full aspect-video bg-gray-900 relative group flex items-center justify-center">
              {/* Fake Video Thumbnail / Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-80"></div>
              
              {!isPlaying ? (
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 bg-red-500/90 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-transform hover:scale-110 z-10"
                >
                  <Play size={36} className="ml-2" />
                </button>
              ) : (
                <div className="text-white z-10 flex flex-col items-center animate-pulse">
                  <PlayCircle size={48} className="text-red-500 mb-4" />
                  <p className="font-medium tracking-wider">Playing Video...</p>
                </div>
              )}

              {/* Video Controls (Visible on hover) */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 z-20">
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                  <div className="h-full bg-red-500 w-[35%] relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"></div>
                  </div>
                </div>
                {/* Controls */}
                <div className="flex justify-between items-center text-white mt-1">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-red-400 transition-colors">
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button className="hover:text-red-400 transition-colors"><Volume2 size={20} /></button>
                    <span className="text-xs font-medium font-mono">18:24 / 52:10</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors">
                      1.5x <FastForward size={14} />
                    </button>
                    <button className="hover:text-red-400 transition-colors"><Settings size={20} /></button>
                    <button className="hover:text-red-400 transition-colors"><Maximize size={20} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Tabs (Notes, DPP, Doubts) */}
          <div className="glass-panel rounded-3xl p-6 shadow-sm">
            <div className="flex border-b border-gray-100 mb-6 gap-6">
              {[
                { id: 'notes', label: 'Class Notes', icon: <FileText size={18} /> },
                { id: 'dpp', label: 'DPP & Quizzes', icon: <CheckCircle2 size={18} /> },
                { id: 'doubts', label: 'Ask Doubt', icon: <MessageSquare size={18} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all relative ${
                    activeTab === tab.id ? 'text-red-600' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab.icon} {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-red-500 rounded-t-full"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {activeTab === 'notes' && (
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-white/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">Lecture 2 Handwritten Notes</h4>
                      <p className="text-xs text-gray-500 font-medium">PDF • 2.4 MB • Uploaded 2 hrs ago</p>
                    </div>
                  </div>
                  <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm">
                    <Download size={18} />
                  </button>
                </div>
              )}
              
              {activeTab === 'dpp' && (
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-white/50 transition-colors group">
                   <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">DPP-02: Laws of Thermodynamics</h4>
                      <p className="text-xs text-gray-500 font-medium">15 Questions • 45 Mins</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-colors border border-blue-100 hover:border-transparent">
                    Start Test
                  </button>
                </div>
              )}

              {activeTab === 'doubts' && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                   <MessageSquare size={48} className="text-gray-200 mb-4" />
                   <h3 className="text-lg font-bold text-gray-800 mb-2">Got a question?</h3>
                   <p className="text-sm text-gray-500 mb-4 max-w-md">Our AI and expert teachers are here to help you 24/7. Type your doubt or go to the Doubt Engine.</p>
                   <button className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl shadow-[0_5px_15px_rgba(239,68,68,0.3)] hover:shadow-[0_8px_25px_rgba(239,68,68,0.4)] hover:-translate-y-1 transition-all">
                     Ask in Doubt Engine
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Playlist/Chapters */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-3xl p-6 shadow-sm sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
              Course Content
              <span className="text-xs font-bold bg-green-50 text-green-600 px-2 py-1 rounded-lg border border-green-100">20% Done</span>
            </h3>
            
            <div className="space-y-3">
              {chapters.map((chapter: any) => (
                <div 
                  key={chapter.id}
                  onClick={() => setActiveChapter(chapter.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                    chapter.id === activeChapter 
                      ? 'bg-red-50 border-red-200 shadow-sm' 
                      : 'bg-white/50 border-transparent hover:bg-white/80 hover:border-gray-100'
                  }`}
                >
                  <div className="mt-1">
                    {chapter.completed ? (
                      <CheckCircle2 size={18} className="text-green-500" />
                    ) : chapter.id === activeChapter ? (
                      <PlayCircle size={18} className="text-red-500 animate-pulse" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 ml-0.5"></div>
                    )}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold leading-tight ${chapter.id === activeChapter ? 'text-red-700' : 'text-gray-800'}`}>
                      {chapter.title}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1">
                      <Clock size={12} /> {chapter.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Courses;
