import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Target, Award, ArrowUp, Activity, Loader2 } from 'lucide-react';
import axios from 'axios';

const Analytics = () => {
  const [data, setData] = useState<{ stats: any, leaderboard: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const userInfoStr = localStorage.getItem('userInfo');
        const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
        const token = userInfo?.token;

        const res = await axios.get('http://localhost:5001/api/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analytics & Leaderboard</h1>
          <p className="text-gray-500 font-medium mt-1">Track your progress and compete with your batchmates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Charts */}
        <div className="lg:col-span-2 space-y-6">
          
            {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
              <Target size={32} className="mb-4 text-blue-200" />
              <p className="text-blue-100 font-medium text-sm">Accuracy Rate</p>
              <h3 className="text-3xl font-black mt-1">{data?.stats.accuracy ?? 0}%</h3>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
              <TrendingUp size={32} className="mb-4 text-emerald-200" />
              <p className="text-emerald-100 font-medium text-sm">Tests Attempted</p>
              <h3 className="text-3xl font-black mt-1">{data?.stats.testsAttempted ?? 0}</h3>
            </div>

            <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
              <Activity size={32} className="mb-4 text-orange-200" />
              <p className="text-orange-100 font-medium text-sm">Total Study Time</p>
              <h3 className="text-3xl font-black mt-1">{data?.stats.hoursLearned ?? 0}h</h3>
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="text-indigo-500" /> Performance Growth
            </h3>
            <div className="h-64 flex items-end justify-between gap-2 border-b border-l border-gray-200 pb-2 pl-2 relative">
              {/* Mock Bar Chart */}
              {(data?.stats.performance || [0, 0, 0, 0, 0, 0, 0]).map((height: number, i: number) => (
                <div key={i} className="w-full bg-indigo-100 rounded-t-lg relative group flex-1 mx-1 hover:bg-indigo-200 transition-colors" style={{ height: `${height}%` }}>
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {height}%
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-400 mt-3 px-2">
              <span>Test 1</span>
              <span>Test 2</span>
              <span>Test 3</span>
              <span>Test 4</span>
              <span>Test 5</span>
              <span>Test 6</span>
              <span>Test 7</span>
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="glass-panel rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-100 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
           
           <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10">
             <Trophy className="text-yellow-500" /> Batch Leaderboard
           </h3>

            {loading ? (
             <div className="flex justify-center py-10 relative z-10">
               <Loader2 className="animate-spin text-yellow-500" size={32} />
             </div>
           ) : (
             <div className="space-y-4 relative z-10">
               {data?.leaderboard && data.leaderboard.length > 0 ? (
                 data.leaderboard.map((student: any) => (
                   <div 
                     key={student._id || student.rank}
                     className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                       student.isCurrentUser 
                         ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-sm transform scale-[1.02]' 
                         : 'bg-white border-gray-100 hover:border-gray-200'
                     }`}
                   >
                     <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                         student.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                         student.rank === 2 ? 'bg-gray-100 text-gray-600' :
                         student.rank === 3 ? 'bg-orange-100 text-orange-600' :
                         'bg-slate-50 text-slate-500'
                       }`}>
                         #{student.rank}
                       </div>
                       <div>
                         <p className={`font-bold ${student.isCurrentUser ? 'text-gray-900' : 'text-gray-700'}`}>
                           {student.name}
                         </p>
                         <p className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                           <Award size={12} /> {student.percentile ? `Top ${student.percentile}%` : `Top ${Math.max(1, student.rank)}%`}
                         </p>
                       </div>
                     </div>
                     
                     <div className="text-right">
                       <p className="font-black text-lg text-gray-900">{student.score}</p>
                       {student.trend === 'up' && <p className="text-[10px] font-bold text-green-500 flex items-center justify-end"><ArrowUp size={10} /> +{student.trendValue || 1.5}</p>}
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-8">
                   <p className="text-gray-400 font-medium text-sm">Take a mock test to appear on the leaderboard!</p>
                 </div>
               )}
             </div>
           )}
           
           <button className="w-full mt-6 py-3 rounded-xl bg-gray-50 text-gray-600 font-bold hover:bg-gray-100 transition-colors border border-gray-200">
             View Full Leaderboard
           </button>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
