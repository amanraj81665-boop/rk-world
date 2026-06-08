import { useState, useEffect } from 'react';
import { Clock, ChevronRight, ChevronLeft, Bookmark, CheckCircle2, Loader2, Trophy, Target, FileSpreadsheet, XCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

type QuestionStatus = 'unvisited' | 'answered' | 'unanswered' | 'marked';

const MockTest = () => {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(10800);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [statuses, setStatuses] = useState<Record<number, QuestionStatus>>({});
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [testData, setTestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const userInfoStr = localStorage.getItem('userInfo');
        const token = userInfoStr ? JSON.parse(userInfoStr).token : '';
        const { data } = await axios.get('https://rk-world.onrender.com/api/tests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data && data.length > 0) {
          setTestData(data[0]);
          setTimeLeft(data[0].durationSeconds || 10800);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch test:', error);
        setLoading(false);
      }
    };
    fetchTest();
  }, []);

  // Timer logic
  useEffect(() => {
    if (loading || !testData?.questions || result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(); // Auto-submit when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, testData, result]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: QuestionStatus) => {
    switch (status) {
      case 'answered': return 'bg-green-500 text-white border-green-600 shadow-sm';
      case 'unanswered': return 'bg-red-500 text-white border-red-600 shadow-sm';
      case 'marked': return 'bg-purple-500 text-white border-purple-600 shadow-sm';
      default: return 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50';
    }
  };

  const handleOptionSelect = (optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIdx]: optionIdx }));
    setStatuses(prev => ({ ...prev, [currentQuestionIdx]: 'answered' }));
  };

  const handleClearResponse = () => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[currentQuestionIdx];
      return newAnswers;
    });
    setStatuses(prev => ({ ...prev, [currentQuestionIdx]: 'unanswered' }));
  };

  const handleMarkForReview = () => {
    setStatuses(prev => ({ ...prev, [currentQuestionIdx]: 'marked' }));
  };

  const handleNext = () => {
    if (!statuses[currentQuestionIdx] && answers[currentQuestionIdx] === undefined) {
      setStatuses(prev => ({ ...prev, [currentQuestionIdx]: 'unanswered' }));
    }
    if (currentQuestionIdx < (testData?.questions?.length || 0) - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      const token = userInfoStr ? JSON.parse(userInfoStr).token : '';
      const { data } = await axios.post(`https://rk-world.onrender.com/api/tests/${testData._id}/submit`, { answers }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(data);
    } catch (error) {
      console.error('Failed to submit test', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  // --- RESULTS DASHBOARD ---
  if (result) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-green-100 text-green-600 rounded-full mb-4">
            <Trophy size={48} />
          </div>
          <h1 className="text-4xl font-black text-gray-900">Test Submitted Successfully!</h1>
          <p className="text-gray-500 mt-2 text-lg">Here is your detailed performance report.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* AIR Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <p className="text-indigo-100 font-bold uppercase tracking-wider text-sm mb-2">All India Rank</p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black">{result.air}</span>
              <span className="text-indigo-200 font-medium">Rank</span>
            </div>
          </div>

          {/* Score Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center">
            <p className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2">Total Score</p>
            <div className="flex items-baseline gap-2 text-gray-900">
              <span className="text-6xl font-black">{result.score}</span>
              <span className="text-gray-400 font-bold text-xl">/ {result.totalMarks}</span>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <Target className="text-blue-500 mb-2" size={24} />
            <span className="text-2xl font-black text-gray-900">{result.accuracy}%</span>
            <span className="text-xs font-bold text-gray-400 uppercase mt-1">Accuracy</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="text-green-500 mb-2" size={24} />
            <span className="text-2xl font-black text-gray-900">{result.correct}</span>
            <span className="text-xs font-bold text-gray-400 uppercase mt-1">Correct</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm flex flex-col items-center justify-center text-center">
            <XCircle className="text-red-500 mb-2" size={24} />
            <span className="text-2xl font-black text-gray-900">{result.incorrect}</span>
            <span className="text-xs font-bold text-gray-400 uppercase mt-1">Incorrect</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <FileSpreadsheet className="text-gray-400 mb-2" size={24} />
            <span className="text-2xl font-black text-gray-900">{result.unattempted}</span>
            <span className="text-xs font-bold text-gray-400 uppercase mt-1">Unattempted</span>
          </div>
        </div>
      </div>
    );
  }

  // --- LIVE MOCK TEST ENGINE ---
  const currentQ = testData?.questions?.[currentQuestionIdx];

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] max-w-[1400px] mx-auto -mt-2">
      
      {/* Top Bar */}
      <div className="glass-panel rounded-2xl p-4 mb-4 flex justify-between items-center shadow-sm z-10 relative">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">{testData?.title || 'Mock Test'}</h1>
          <p className="text-sm text-gray-500 font-medium">{testData?.subjects || 'General'}</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-xl border border-red-100">
            <Clock className="text-red-500" size={20} />
            {testData?.questions ? (
              <span className="text-xl font-mono font-bold text-red-600 tracking-widest">{formatTime(timeLeft)}</span>
            ) : (
              <span className="text-xl font-mono font-bold text-gray-400 tracking-widest">00:00:00</span>
            )}
          </div>
          <button 
            onClick={handleSubmitTest}
            disabled={submitting || !testData?.questions}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-colors border border-blue-500 flex items-center gap-2"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Submit Test'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        
        {/* Left Side - Question Area */}
        <div className="flex-1 flex flex-col glass-panel rounded-3xl overflow-hidden shadow-sm relative z-0">
          
          {/* Section Tabs */}
          <div className="flex border-b border-gray-100 bg-white/50">
            <button className="px-6 py-4 text-sm font-bold text-red-600 border-b-2 border-red-500 bg-white">Full Syllabus</button>
          </div>

          {/* Question Content */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col justify-start">
            {currentQ ? (
              <div className="h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-gray-900">Question {currentQuestionIdx + 1}</h2>
                  <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                    +{currentQ.positiveMarks}, -{currentQ.negativeMarks} marks
                  </span>
                </div>
                <div className="prose prose-lg max-w-none text-gray-800 mb-8 font-medium">
                  {currentQ.text}
                </div>
                <div className="space-y-4 max-w-2xl">
                  {currentQ.options?.map((option: string, idx: number) => (
                    <label key={idx} className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all group ${answers[currentQuestionIdx] === idx ? 'bg-red-50 border-red-500 shadow-sm' : 'border-gray-200 hover:bg-red-50 hover:border-red-200'}`}>
                      <input 
                        type="radio" 
                        name={`q${currentQuestionIdx}`} 
                        checked={answers[currentQuestionIdx] === idx}
                        onChange={() => handleOptionSelect(idx)}
                        className="w-5 h-5 text-red-600 border-gray-300 focus:ring-red-500" 
                      />
                      <span className="ml-4 text-gray-700 font-medium group-hover:text-gray-900">
                        <span className="font-bold mr-2 text-gray-400 group-hover:text-red-500">{(idx + 10).toString(36).toUpperCase()}.</span> 
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 flex-1 flex flex-col items-center justify-center">
                <div className="bg-yellow-50 text-yellow-600 p-8 rounded-3xl inline-block border border-yellow-100 shadow-sm max-w-lg">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📝</div>
                  <p className="font-black text-2xl mb-3 text-yellow-700">No Mock Tests Available</p>
                  <p className="text-sm font-medium text-yellow-600/80 leading-relaxed">Admin has not added any mock tests yet. Check back later!</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          {currentQ && (
            <div className="p-4 bg-white/80 border-t border-gray-100 flex justify-between items-center shrink-0">
              <div className="flex gap-3">
                <button 
                  onClick={handleMarkForReview}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl border border-purple-200 transition-colors"
                >
                  <Bookmark size={18} /> Mark for Review
                </button>
                <button 
                  onClick={handleClearResponse}
                  className="px-6 py-3 text-gray-600 hover:text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors"
                >
                  Clear Response
                </button>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={handlePrev}
                  disabled={currentQuestionIdx === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-white disabled:opacity-50 hover:bg-gray-50 text-gray-700 font-bold rounded-xl border border-gray-200 transition-colors shadow-sm"
                >
                  <ChevronLeft size={18} /> Previous
                </button>
                <button 
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md border border-green-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  {currentQuestionIdx === (testData?.questions?.length || 0) - 1 ? 'Save' : 'Save & Next'} <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Question Palette */}
        <div className="w-80 glass-panel rounded-3xl flex flex-col shadow-sm relative z-0">
          
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white/50 rounded-t-3xl">
            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'Aman'}&backgroundColor=f87171`} alt="Student" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
            <div>
              <p className="font-bold text-gray-900 leading-tight">{user?.name || 'Student'}</p>
              <p className="text-xs font-semibold text-gray-500">{user?.role === 'admin' ? 'Administrator' : 'Student'}</p>
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 border-b border-gray-100 grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-bold text-gray-600">
            <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-md bg-green-500 border border-green-600 flex items-center justify-center text-white"><CheckCircle2 size={12}/></div> Answered</div>
            <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-md bg-red-500 border border-red-600"></div> Not Answered</div>
            <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-md bg-white border border-gray-300"></div> Not Visited</div>
            <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-md bg-purple-500 border border-purple-600 flex items-center justify-center text-white"><Bookmark size={12}/></div> Review</div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
              Questions
              <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">{testData?.questions?.length || 0} Qs</span>
            </h3>
            {testData?.questions ? (
              <div className="grid grid-cols-5 gap-2">
                {testData.questions.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${getStatusColor(statuses[idx] || 'unvisited')} ${currentQuestionIdx === idx ? 'ring-2 ring-blue-500 ring-offset-2 scale-110 z-10' : ''} border`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-center p-4">
                <p className="text-xs text-gray-400 font-medium">Palette will appear when questions are uploaded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTest;
