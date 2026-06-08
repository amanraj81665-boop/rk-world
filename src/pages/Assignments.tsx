import { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, Clock, UploadCloud, AlertCircle } from 'lucide-react';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header Section */}
      <section className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-gradient-x rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Assignments</h1>
            <p className="text-emerald-50 text-lg max-w-xl font-medium">
              Track, complete, and upload your assignments here to stay ahead in your courses.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex flex-col items-center justify-center">
        {assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <ClipboardList size={48} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">No Assignments Yet!</h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              You're all caught up! There are currently no pending assignments for your enrolled courses.
            </p>
          </div>
        ) : (
          <div className="w-full">
            {/* Map assignments here when backend is ready */}
          </div>
        )}
      </div>

    </div>
  );
};

export default Assignments;
