import { useState, useEffect } from 'react';
import { Search, Download, Book, FileText, Video, Filter, Star, Clock, Loader2 } from 'lucide-react';
import axios from 'axios';

const Library = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const { data } = await axios.get('https://rk-world.onrender.com/api/library');
        setMaterials(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching materials:', error);
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const filters = ['All', 'Physics', 'Maths', 'Chemistry'];

  const filteredMaterials = activeFilter === 'All' 
    ? materials 
    : materials.filter(m => m.subject === activeFilter || m.subject === 'All');

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header Section */}
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">E-Library Hub</h1>
            <p className="text-indigo-100 text-lg max-w-xl font-medium">
              Access thousands of premium study materials, notes, and previous year papers carefully curated for your success.
            </p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md p-1 rounded-2xl flex border border-white/30 shadow-inner w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search for notes, videos..." 
              className="bg-transparent border-none text-white placeholder-white/70 px-4 py-2 outline-none w-full md:w-64 font-medium"
            />
            <button className="bg-white text-indigo-600 p-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm font-bold">
              <Search size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-gray-500 font-bold mr-2">
          <Filter size={20} />
          <span>Filters:</span>
        </div>
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
              activeFilter === filter
                ? 'bg-purple-600 text-white shadow-purple-200 border-transparent'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-purple-600" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map(material => (
              <div key={material._id} className="glass-panel p-6 rounded-3xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 relative overflow-hidden">
                {/* Background Hover Effect */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 z-0"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${
                      material.type === 'PDF' ? 'bg-red-50 text-red-500' :
                      material.type === 'Video' ? 'bg-blue-50 text-blue-500' :
                      'bg-green-50 text-green-500'
                    }`}>
                      {material.type === 'PDF' ? <FileText size={24} /> : 
                       material.type === 'Video' ? <Video size={24} /> : 
                       <Book size={24} />}
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
                      {material.subject}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-extrabold text-gray-900 mb-2 leading-tight group-hover:text-purple-600 transition-colors">
                    {material.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm font-semibold text-gray-500 mb-6">
                    <span className="flex items-center gap-1.5"><Star size={16} className="text-yellow-400 fill-yellow-400" /> {material.rating}</span>
                    <span className="flex items-center gap-1.5"><Download size={16} /> {material.downloads}</span>
                    <span className="flex items-center gap-1.5"><Clock size={16} /> {material.size}</span>
                  </div>
                  
                  <button className="w-full py-3 rounded-xl bg-gray-50 text-gray-700 font-bold border border-gray-200 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all flex items-center justify-center gap-2">
                    <Download size={18} />
                    Download Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white/50 rounded-3xl border border-dashed border-gray-200">
              <Book size={48} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900">No Study Materials Found</h3>
              <p className="text-gray-500 mt-2 text-center max-w-md">There are currently no materials available for this filter. Please check back later.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Library;
