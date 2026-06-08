import { useState } from 'react';
import axios from 'axios';
import { UploadCloud, BookOpen, Video, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'library' | 'course' | 'test' | 'staff'>('library');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Form States
  const [libForm, setLibForm] = useState({ title: '', subject: '', type: 'PDF', size: '' });
  const [courseForm, setCourseForm] = useState({ title: '', module: '', teacher: '' });
  const [testForm, setTestForm] = useState({ examName: '', questionHtml: '', optionA: '', optionB: '', optionC: '', optionD: '' });
  const [staffForm, setStaffForm] = useState({ name: '', email: '', password: '', role: 'teacher' });

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-black text-gray-900">Access Denied</h2>
        <p className="text-gray-500 font-medium">You must be an administrator to view this page.</p>
      </div>
    );
  }

  const handleLibrarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      await axios.post('http://localhost:5001/api/library', libForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Library material uploaded successfully!');
      setLibForm({ title: '', subject: '', type: 'PDF', size: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to upload library material');
    }
    setLoading(false);
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      await axios.post('http://localhost:5001/api/courses', courseForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Course created successfully!');
      setCourseForm({ title: '', module: '', teacher: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to create course');
    }
    setLoading(false);
  };

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const options = [testForm.optionA, testForm.optionB, testForm.optionC, testForm.optionD];
      const html = `<p class="font-medium">${testForm.questionHtml}</p>`;
      
      await axios.post('http://localhost:5001/api/tests', {
        examName: testForm.examName,
        questionHtml: html,
        options: options
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Mock Test created successfully!');
      setTestForm({ examName: '', questionHtml: '', optionA: '', optionB: '', optionC: '', optionD: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to create test');
    }
    setLoading(false);
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      await axios.post('http://localhost:5001/api/admin/staff', staffForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(`${staffForm.role === 'admin' ? 'Admin' : 'Teacher'} account created successfully!`);
      setStaffForm({ name: '', email: '', password: '', role: 'teacher' });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create staff account');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in duration-500 pb-20">
      
      <div className="glass-panel rounded-3xl p-8 mb-6 relative overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 text-white shadow-lg border-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
            <UploadCloud size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
            <p className="text-indigo-200 font-medium mt-1">Upload and manage content across the platform seamlessly.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-100 bg-white/50">
          <button 
            onClick={() => setActiveTab('library')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'library' ? 'text-indigo-600 bg-white border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <BookOpen size={18} /> E-Library
          </button>
          <button 
            onClick={() => setActiveTab('course')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'course' ? 'text-indigo-600 bg-white border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Video size={18} /> Courses
          </button>
          <button 
            onClick={() => setActiveTab('test')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'test' ? 'text-indigo-600 bg-white border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <FileText size={18} /> Mock Tests
          </button>
          <button 
            onClick={() => setActiveTab('staff')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'staff' ? 'text-indigo-600 bg-white border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <ShieldAlert size={18} /> Add Staff
          </button>
        </div>

        <div className="p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
              <CheckCircle2 size={20} className="text-green-500" />
              <span className="font-bold">{success}</span>
            </div>
          )}

          {activeTab === 'library' && (
            <form onSubmit={handleLibrarySubmit} className="max-w-2xl space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Material Title</label>
                <input required type="text" value={libForm.title} onChange={e => setLibForm({...libForm, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="e.g. Physics Revision Notes" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                  <input required type="text" value={libForm.subject} onChange={e => setLibForm({...libForm, subject: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="e.g. Physics" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                  <select value={libForm.type} onChange={e => setLibForm({...libForm, type: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white">
                    <option value="PDF">PDF Document</option>
                    <option value="Video">Video Lecture</option>
                    <option value="Image">Image / Mindmap</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">File Size</label>
                <input required type="text" value={libForm.size} onChange={e => setLibForm({...libForm, size: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="e.g. 2.4 MB" />
              </div>
              <button disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-70 mt-4">
                {loading ? 'Uploading...' : 'Upload Library Material'}
              </button>
            </form>
          )}

          {activeTab === 'course' && (
            <form onSubmit={handleCourseSubmit} className="max-w-2xl space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Course Title</label>
                <input required type="text" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="e.g. Class 11th Chemistry Crash Course" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Module / Description</label>
                <input required type="text" value={courseForm.module} onChange={e => setCourseForm({...courseForm, module: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="e.g. Module 1: Basic Concepts" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Teacher Name</label>
                <input required type="text" value={courseForm.teacher} onChange={e => setCourseForm({...courseForm, teacher: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="e.g. Alakh Pandey" />
              </div>
              <button disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-70 mt-4">
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </form>
          )}

          {activeTab === 'test' && (
            <form onSubmit={handleTestSubmit} className="max-w-2xl space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Exam Name</label>
                <input required type="text" value={testForm.examName} onChange={e => setTestForm({...testForm, examName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="e.g. JEE Main Mock Test #2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Question (HTML format supported)</label>
                <textarea required value={testForm.questionHtml} onChange={e => setTestForm({...testForm, questionHtml: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none min-h-[120px]" placeholder="e.g. What is the value of G?" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Option A</label>
                  <input required type="text" value={testForm.optionA} onChange={e => setTestForm({...testForm, optionA: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Option B</label>
                  <input required type="text" value={testForm.optionB} onChange={e => setTestForm({...testForm, optionB: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Option C</label>
                  <input required type="text" value={testForm.optionC} onChange={e => setTestForm({...testForm, optionC: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Option D</label>
                  <input required type="text" value={testForm.optionD} onChange={e => setTestForm({...testForm, optionD: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                </div>
              </div>
              <button disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-70 mt-4">
                {loading ? 'Uploading...' : 'Publish Question to Test'}
              </button>
            </form>
          )}

          {activeTab === 'staff' && (
            <form onSubmit={handleStaffSubmit} className="max-w-2xl space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input required type="text" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="e.g. Aman Sir" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                <input required type="email" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="e.g. teacher@rkworld.com" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Temporary Password</label>
                  <input required minLength={6} type="text" value={staffForm.password} onChange={e => setStaffForm({...staffForm, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="e.g. RKWorld@123" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Account Role</label>
                  <select value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none bg-white">
                    <option value="teacher">Teacher</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>
              <button disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-70 mt-4">
                {loading ? 'Creating...' : 'Create Staff Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
