import { Mail, MapPin, Send, MessageCircle, Video, Shield, BookOpen, FileSpreadsheet, Headset, Atom } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0B1120] text-slate-300 py-12 px-6 lg:px-12 mt-10 rounded-3xl mx-6 mb-6 shadow-2xl relative overflow-hidden border border-white/5 shrink-0">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Top Section: Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12 border-b border-white/10 pb-12">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/40 border border-white/10">
                <Atom size={24} className="text-white" />
              </div>
              <h1 className="font-extrabold text-2xl tracking-tight">
                <span className="text-red-500">R.K.</span> <span className="text-white">W🌎RLD</span>
              </h1>
            </div>
            
            <p className="text-indigo-400 font-bold text-sm tracking-widest uppercase">
              Learn <span className="text-red-500 mx-1">•</span> Practice <span className="text-red-500 mx-1">•</span> Succeed
            </p>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              R.K. W🌎RLD is your all-in-one learning platform. Learn, practice, take tests and achieve your goals with the best resources and expert guidance.
            </p>
            
            <div className="space-y-4 pt-4">
              <a href="mailto:raushan9031@gmail.com" className="flex items-center gap-3 text-sm text-slate-300 hover:text-white group transition-colors w-fit">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all border border-indigo-500/10"><Mail size={16} /></div>
                <span className="font-medium tracking-wide">raushan9031@gmail.com</span>
              </a>
              <a href="https://wa.me/919304327577" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-300 hover:text-green-400 group transition-colors w-fit">
                <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500/20 group-hover:scale-110 transition-all border border-green-500/10"><MessageCircle size={16} /></div>
                <span className="font-medium tracking-wide">+91 93043 27577 <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full ml-1 border border-green-500/20 group-hover:bg-green-500 group-hover:text-white transition-colors">WhatsApp</span></span>
              </a>
              <div className="flex items-center gap-3 text-sm text-slate-300 w-fit">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/10"><MapPin size={16} /></div>
                <span className="font-medium tracking-wide">India</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {['Home', 'Courses', 'Live Classes', 'Mock Tests', 'Assignments', 'E-Library', 'Doubt Engine'].map((link) => (
                <li key={link} className="hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-2">
                  <span className="text-indigo-600 text-xs">›</span> {link}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Resources</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {['Notes', 'Study Material', 'Previous Year Papers', 'Quiz & Tests', 'Downloads', 'Blog', 'Exam Updates'].map((link) => (
                <li key={link} className="hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-2">
                  <span className="text-indigo-600 text-xs">›</span> {link}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Support</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {['Help Center', 'FAQs', 'Privacy Policy', 'Terms & Conditions', 'Refund Policy', 'Report an Issue', 'Contact Support'].map((link) => (
                <li key={link} className="hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-2">
                  <span className="text-indigo-600 text-xs">›</span> {link}
                </li>
              ))}
            </ul>
          </div>
          {/* Column 5: Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold text-lg mb-6">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Subscribe to our newsletter and get the latest updates, courses and offers.
            </p>
            <div className="relative mb-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <Mail className="absolute right-4 top-3.5 text-slate-500" size={16} />
            </div>
            <button className="w-full bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 text-sm">
              Subscribe Now <Send size={14} />
            </button>
            <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1.5">
              We never spam <Shield size={12} className="text-indigo-400" />
            </p>
          </div>
        </div>

        {/* Middle Section: Features & Social */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-10">
          
          {/* Social Icons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 lg:mb-0">
            <span className="text-white font-semibold sm:mr-2">Follow Us On</span>
            <div className="flex items-center gap-3">
            <a href="https://instagram.com/aman__yadav_.04" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://youtube.com/@rkW🌎RLDofenglish?si=aysu9V6E-iWMVwvh" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
            <a href="https://t.me/rkenglishclasses" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </a>
            <button className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap justify-center lg:justify-end gap-6 lg:gap-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20"><Video size={24} /></div>
              <div>
                <h4 className="text-white font-bold text-sm">Live Classes</h4>
                <p className="text-[10px] text-slate-400">Interactive Sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/20"><BookOpen size={24} /></div>
              <div>
                <h4 className="text-white font-bold text-sm">Quality Content</h4>
                <p className="text-[10px] text-slate-400">Well Structured Notes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/20"><FileSpreadsheet size={24} /></div>
              <div>
                <h4 className="text-white font-bold text-sm">Mock Tests</h4>
                <p className="text-[10px] text-slate-400">Detailed Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/20"><Headset size={24} /></div>
              <div>
                <h4 className="text-white font-bold text-sm">24/7 Support</h4>
                <p className="text-[10px] text-slate-400">Get Help Anytime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/5 text-xs text-slate-500">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p>© 2026 R.K. W🌎RLD. All Rights Reserved.</p>
            <p className="mt-1">Made with <span className="text-red-500">❤️</span> by <span className="text-indigo-400 font-semibold">Aman Raj</span></p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 md:mt-0">
            <span className="flex items-center gap-1 whitespace-nowrap"><Shield size={14} className="text-emerald-400" /> Secure Payments</span>
            <div className="flex flex-wrap justify-center gap-2">
              <div className="px-2 py-1 bg-white rounded text-[#1434CB] font-bold text-[10px]">VISA</div>
              <div className="px-2 py-1 bg-white rounded flex items-center gap-[-2px]"><div className="w-2 h-2 rounded-full bg-red-500"></div><div className="w-2 h-2 rounded-full bg-yellow-500 -ml-1 opacity-80"></div></div>
              <div className="px-2 py-1 bg-white rounded text-blue-600 font-bold text-[10px]">UPI</div>
              <div className="px-2 py-1 bg-white rounded text-blue-400 font-bold text-[10px]">paytm</div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
