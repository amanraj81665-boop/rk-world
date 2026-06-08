import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PlusCircle, Video, Book, Save, FileText, MessageCircle, Share2, ThumbsUp, MoreHorizontal, Radio, ShieldAlert, Settings, Trash2, Edit2 } from 'lucide-react';
// import { useAuth } from '../context/AuthContext'; // removed to fix unused var

const AdminDashboard = () => {
  // const { user } = useAuth(); // removed to fix unused var
  const [activeTab, setActiveTab] = useState<'feed' | 'course' | 'library' | 'test' | 'live' | 'staff' | 'settings'>('feed');
  
  const [courses, setCourses] = useState<any[]>([]);
  const [courseForm, setCourseForm] = useState({
    title: '', module: '', teacher: '', progress: 0, isActive: true, price: 0
  });
  
  const [libraryForm, setLibraryForm] = useState({
    title: '', subject: 'All', type: 'PDF', size: ''
  });

  const [testForm, setTestForm] = useState({
    examName: '', questionHtml: '', optionA: '', optionB: '', optionC: '', optionD: ''
  });

  const [liveForm, setLiveForm] = useState({
    title: '', subject: '', teacher: ''
  });

  const [staffForm, setStaffForm] = useState({
    name: '', email: '', password: '', role: 'teacher'
  });

  const [settingsForm, setSettingsForm] = useState({
    proSubscriptionPrice: 999
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/settings');
        if (res.data) {
          setSettingsForm({ proSubscriptionPrice: res.data.proSubscriptionPrice });
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };
    fetchSettings();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/courses');
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'course') {
      fetchCourses();
    }
  }, [activeTab]);

  // Dummy Feed Posts for Admin Feed
  const feedPosts = [
    {
      id: 1,
      author: 'Raushan Sir (Admin)',
      role: 'Director, R.K. W🌎RLD',
      time: '2 hours ago',
      content: 'Hello Students! The new Mock Test for JEE Mains is now live on the platform. Please navigate to the Mock Tests section to attempt it. Best of luck! 🚀',
      likes: 45,
      comments: 12
    },
    {
      id: 2,
      author: 'Physics Department',
      role: 'Faculty',
      time: '5 hours ago',
      content: 'We have uploaded the DPP (Daily Practice Problems) for Thermodynamics. Make sure to solve them before tomorrow\'s live class.',
      likes: 132,
      comments: 4
    }
  ];

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      const token = userInfoStr ? JSON.parse(userInfoStr).token : '';
      await axios.post('http://localhost:5001/api/admin/courses', {
        title: courseForm.title,
        module: courseForm.module,
        teacher: courseForm.teacher,
        isActive: courseForm.isActive,
        price: courseForm.price
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Course added successfully!');
      setCourseForm({ title: '', module: '', teacher: '', progress: 0, isActive: true, price: 0 });
      fetchCourses(); // refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add course');
    }
  };

  const handleLibrarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      const token = userInfoStr ? JSON.parse(userInfoStr).token : '';
      await axios.post('http://localhost:5001/api/admin/library', {
        ...libraryForm,
        downloads: 0,
        rating: 5.0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Library material added successfully!');
      setLibraryForm({ title: '', subject: 'All', type: 'PDF', size: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add material');
    }
  };

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      const token = userInfoStr ? JSON.parse(userInfoStr).token : '';
      const options = [testForm.optionA, testForm.optionB, testForm.optionC, testForm.optionD];
      const html = `<p class="font-medium">${testForm.questionHtml}</p>`;
      
      await axios.post('http://localhost:5001/api/admin/tests', {
        examName: testForm.examName,
        questionHtml: html,
        options: options
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Mock Test question added successfully!');
      setTestForm({ examName: '', questionHtml: '', optionA: '', optionB: '', optionC: '', optionD: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add test question');
    }
  };

  const handleLiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      const token = userInfoStr ? JSON.parse(userInfoStr).token : '';
      await axios.post('http://localhost:5001/api/admin/live', liveForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Live class started successfully!');
      setLiveForm({ title: '', subject: '', teacher: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to start live class');
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      const token = userInfoStr ? JSON.parse(userInfoStr).token : '';
      await axios.post('http://localhost:5001/api/admin/staff', staffForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${staffForm.role === 'admin' ? 'Admin' : 'Teacher'} account created successfully!`);
      setStaffForm({ name: '', email: '', password: '', role: 'teacher' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create staff account');
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      const token = userInfoStr ? JSON.parse(userInfoStr).token : '';
      await axios.put('http://localhost:5001/api/settings', settingsForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Pricing updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update pricing');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      const token = userInfoStr ? JSON.parse(userInfoStr).token : '';
      await axios.delete(`http://localhost:5001/api/admin/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Course deleted');
      fetchCourses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete course');
    }
  };

  const handleUpdatePrice = async (id: string, newPrice: number) => {
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      const token = userInfoStr ? JSON.parse(userInfoStr).token : '';
      await axios.put(`http://localhost:5001/api/admin/courses/${id}`, { price: newPrice }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Course price updated');
      fetchCourses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update price');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-5xl mx-auto">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Quick Actions Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex overflow-hidden">
            <button onClick={() => setActiveTab('live')} className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 transition-colors rounded-xl font-bold ${activeTab === 'live' ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600 hover:bg-red-50 group'}`}>
              <Radio size={24} className={activeTab === 'live' ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500 transition-colors'} />
              <span className="text-sm">Start Live</span>
            </button>
            <div className="w-px bg-gray-100 my-2"></div>
            <button onClick={() => setActiveTab('course')} className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 transition-colors rounded-xl font-bold ${activeTab === 'course' ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600 hover:bg-red-50 group'}`}>
              <Video size={24} className={activeTab === 'course' ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500 transition-colors'} />
              <span className="text-sm">Add Course</span>
            </button>
            <div className="w-px bg-gray-100 my-2"></div>
            <button onClick={() => setActiveTab('library')} className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 transition-colors rounded-xl font-bold ${activeTab === 'library' ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600 hover:bg-red-50 group'}`}>
              <Book size={24} className={activeTab === 'library' ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500 transition-colors'} />
              <span className="text-sm">Library</span>
            </button>
            <div className="w-px bg-gray-100 my-2"></div>
            <button onClick={() => setActiveTab('test')} className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 transition-colors rounded-xl font-bold ${activeTab === 'test' ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600 hover:bg-red-50 group'}`}>
              <FileText size={24} className={activeTab === 'test' ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500 transition-colors'} />
              <span className="text-sm">Mock Test</span>
            </button>
            <div className="w-px bg-gray-100 my-2"></div>
            <button onClick={() => setActiveTab('staff')} className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 transition-colors rounded-xl font-bold ${activeTab === 'staff' ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600 hover:bg-red-50 group'}`}>
              <ShieldAlert size={24} className={activeTab === 'staff' ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500 transition-colors'} />
              <span className="text-sm">Add Staff</span>
            </button>
            <div className="w-px bg-gray-100 my-2"></div>
            <button onClick={() => setActiveTab('settings')} className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 transition-colors rounded-xl font-bold ${activeTab === 'settings' ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600 hover:bg-red-50 group'}`}>
              <Settings size={24} className={activeTab === 'settings' ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500 transition-colors'} />
              <span className="text-sm">Pricing</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8">
              {activeTab === 'live' && (
                <form onSubmit={handleLiveSubmit} className="space-y-5 animate-in fade-in">
                  <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Start Live Session
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Class Title</label>
                      <input type="text" required value={liveForm.title} onChange={e => setLiveForm({...liveForm, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Advanced Mathematics: Calculus" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Subject</label>
                      <input type="text" required value={liveForm.subject} onChange={e => setLiveForm({...liveForm, subject: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Maths" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Teacher Name</label>
                      <input type="text" required value={liveForm.teacher} onChange={e => setLiveForm({...liveForm, teacher: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Aman Sir" />
                    </div>
                  </div>
                  <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-2 w-full mt-4">
                    <Radio size={18} /> GO LIVE NOW
                  </button>
                </form>
              )}

              {activeTab === 'course' && (
                <div className="space-y-10">
                  <form onSubmit={handleCourseSubmit} className="space-y-5 animate-in fade-in">
                  <h3 className="text-lg font-black text-gray-900 mb-4">Create New Course</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Course Title</label>
                      <input type="text" required value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Physics: Class 12th Batch" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Module Name</label>
                      <input type="text" required value={courseForm.module} onChange={e => setCourseForm({...courseForm, module: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Module 4: Thermodynamics" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Teacher Name</label>
                      <input type="text" required value={courseForm.teacher} onChange={e => setCourseForm({...courseForm, teacher: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Rahul Sir" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Course Price (₹)</label>
                      <input type="number" required value={courseForm.price} onChange={e => setCourseForm({...courseForm, price: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. 1999" />
                    </div>
                  </div>
                  <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 w-full mt-4">
                    <PlusCircle size={18} /> Publish Course
                  </button>
                </form>

                {/* Manage Existing Courses List */}
                <div className="mt-10 pt-8 border-t border-gray-100 animate-in fade-in">
                  <h3 className="text-lg font-black text-gray-900 mb-4">Manage Existing Courses</h3>
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{course.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{course.module} • By {course.teacher}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-500 transition-all">
                            <span className="pl-3 text-gray-500 font-bold">₹</span>
                            <input 
                              type="number" 
                              defaultValue={course.price || 0}
                              onBlur={(e) => {
                                const newPrice = Number(e.target.value);
                                if (newPrice !== course.price) handleUpdatePrice(course._id, newPrice);
                              }}
                              className="w-24 px-2 py-2 outline-none text-sm font-bold text-gray-900"
                            />
                          </div>
                          <button onClick={() => handleDeleteCourse(course._id)} className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {courses.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No courses available.</p>
                    )}
                  </div>
                </div>
              </div>
              )}

              {activeTab === 'library' && (
                <form onSubmit={handleLibrarySubmit} className="space-y-5 animate-in fade-in">
                  <h3 className="text-lg font-black text-gray-900 mb-4">Add Library Material</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Material Title</label>
                      <input type="text" required value={libraryForm.title} onChange={e => setLibraryForm({...libraryForm, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Organic Chemistry DPP" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Subject</label>
                      <select value={libraryForm.subject} onChange={e => setLibraryForm({...libraryForm, subject: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500">
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Maths">Maths</option>
                        <option value="All">All Subjects</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Type</label>
                      <select value={libraryForm.type} onChange={e => setLibraryForm({...libraryForm, type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500">
                        <option value="PDF">PDF Document</option>
                        <option value="Video">Video Lecture</option>
                        <option value="Image">Mindmap Image</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">File Size (Text)</label>
                      <input type="text" required value={libraryForm.size} onChange={e => setLibraryForm({...libraryForm, size: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. 2.5 MB" />
                    </div>
                  </div>
                  <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 w-full mt-4">
                    <Save size={18} /> Upload Material
                  </button>
                </form>
              )}

              {activeTab === 'staff' && (
                <form onSubmit={handleStaffSubmit} className="space-y-5 animate-in fade-in">
                  <h3 className="text-lg font-black text-gray-900 mb-4">Create Staff Account</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                      <input type="text" required value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Aman Sir" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
                      <input type="email" required value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. teacher@rkworld.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Temporary Password</label>
                      <input type="text" required minLength={6} value={staffForm.password} onChange={e => setStaffForm({...staffForm, password: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. RKWorld@123" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Account Role</label>
                      <select value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500">
                        <option value="teacher">Teacher</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 w-full mt-4">
                    <ShieldAlert size={18} /> Create Staff Account
                  </button>
                </form>
              )}

              {activeTab === 'settings' && (
                <form onSubmit={handleSettingsSubmit} className="space-y-5 animate-in fade-in">
                  <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <Settings className="text-red-500" /> Platform Pricing Settings
                  </h3>
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-6">
                    <p className="text-orange-800 text-sm font-medium">Control the cost of the Pro Subscription globally. All future purchases will use this price.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Pro Subscription Price (₹)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                        <input type="number" required value={settingsForm.proSubscriptionPrice} onChange={e => setSettingsForm({...settingsForm, proSubscriptionPrice: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg font-bold" />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-2 w-full mt-4">
                    <Save size={18} /> Update Pricing
                  </button>
                </form>
              )}
              
              {activeTab === 'test' && (
                <form onSubmit={handleTestSubmit} className="space-y-5 animate-in fade-in">
                  <h3 className="text-lg font-black text-gray-900 mb-4">Upload Mock Test Question</h3>
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Exam Name</label>
                      <input type="text" required value={testForm.examName} onChange={e => setTestForm({...testForm, examName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. JEE Main Mock Test #2" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Question Content (HTML supported)</label>
                      <textarea required value={testForm.questionHtml} onChange={e => setTestForm({...testForm, questionHtml: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[120px]" placeholder="e.g. What is the value of G?" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Option A</label>
                        <input type="text" required value={testForm.optionA} onChange={e => setTestForm({...testForm, optionA: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Option B</label>
                        <input type="text" required value={testForm.optionB} onChange={e => setTestForm({...testForm, optionB: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Option C</label>
                        <input type="text" required value={testForm.optionC} onChange={e => setTestForm({...testForm, optionC: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Option D</label>
                        <input type="text" required value={testForm.optionD} onChange={e => setTestForm({...testForm, optionD: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 w-full mt-4">
                    <Save size={18} /> Publish Question to Test
                  </button>
                </form>
              )}

              {activeTab === 'feed' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black tracking-tight text-gray-900">Your Recent Posts</h3>
                    <button className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100">Write Update</button>
                  </div>
                  {feedPosts.map(post => (
                    <div key={post.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-red-100 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 overflow-hidden shrink-0">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} alt="Author" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm leading-tight">{post.author}</h4>
                            <p className="text-[11px] font-semibold text-gray-500">{post.role}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{post.time}</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-700"><MoreHorizontal size={18} /></button>
                      </div>
                      
                      <div className="mb-4 text-gray-800 leading-relaxed font-medium text-sm">
                        {post.content}
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-gray-500">
                        <div className="flex gap-6">
                          <button className="flex items-center gap-1.5 hover:text-red-600 transition-colors font-bold text-xs">
                            <ThumbsUp size={16} /> {post.likes}
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors font-bold text-xs">
                            <MessageCircle size={16} /> {post.comments}
                          </button>
                        </div>
                        <button className="flex items-center gap-1.5 hover:text-green-600 transition-colors font-bold text-xs">
                          <Share2 size={16} /> Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <h2 className="text-2xl font-extrabold mb-2 relative z-10">Admin Dashboard</h2>
            <p className="text-sm text-gray-300 relative z-10">Post updates, create courses, and manage content from one place.</p>
            <button onClick={() => setActiveTab('feed')} className="mt-6 w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 rounded-xl transition-all">
              View All Posts
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
