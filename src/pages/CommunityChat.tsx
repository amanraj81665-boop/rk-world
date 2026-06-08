import { useState, useEffect, useRef } from 'react';
import { Send, Users, ShieldAlert, BadgeCheck } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const socket = io('http://localhost:5001'); // Changed port to 5001 to match backend

const CommunityChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Fetch initial chat history
    const fetchChatHistory = async () => {
      try {
        const userInfoStr = localStorage.getItem('userInfo');
        const token = userInfoStr ? JSON.parse(userInfoStr).token : '';
        const res = await axios.get('http://localhost:5001/api/chat', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error('Error fetching chat history', error);
      }
    };
    fetchChatHistory();

    // Socket listeners
    socket.emit('join-community');

    socket.on('receive-community-message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      setTimeout(scrollToBottom, 100);
    });

    return () => {
      socket.off('receive-community-message');
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    socket.emit('send-community-message', {
      senderName: user.name,
      senderRole: user.role,
      text: input.trim()
    });

    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.24))] max-w-5xl mx-auto glass-panel rounded-3xl overflow-hidden shadow-sm animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-200 shrink-0">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">Live Community</h1>
            <p className="text-sm font-medium text-green-600 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <div className="hidden sm:flex bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold border border-indigo-100 shadow-sm text-sm">
          Strictly for Educational Use
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
            <Users size={48} className="opacity-20" />
            <p className="font-medium text-lg">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderName === user?.name;
            const isAdminOrTeacher = msg.senderRole === 'admin' || msg.senderRole === 'teacher';

            return (
              <div key={msg._id || idx} className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                
                {/* Avatar */}
                <div className="shrink-0 mt-1">
                  <div className={`w-8 h-8 rounded-full border shadow-sm overflow-hidden flex items-center justify-center ${
                    isAdminOrTeacher ? 'bg-amber-100 border-amber-300' : 'bg-white border-gray-200'
                  }`}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderName}`} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {/* Sender Name & Badge */}
                  <div className={`flex items-center gap-1.5 mb-1 mx-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs font-bold text-gray-600">{isMe ? 'You' : msg.senderName}</span>
                    {isAdminOrTeacher && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-200">
                        <ShieldAlert size={10} /> {msg.senderRole === 'admin' ? 'Admin' : 'Teacher'}
                      </span>
                    )}
                  </div>

                  {/* Bubble content */}
                  <div className={`px-4 py-2.5 rounded-2xl shadow-sm relative group ${
                    isMe 
                      ? 'bg-indigo-600 text-white rounded-tr-sm' 
                      : isAdminOrTeacher 
                        ? 'bg-white border border-amber-200 rounded-tl-sm'
                        : 'bg-white border border-gray-100 rounded-tl-sm text-gray-800'
                  }`}>
                    <p className={`text-[15px] leading-snug whitespace-pre-wrap break-words ${isMe ? 'text-white' : 'text-gray-800'}`}>
                      {msg.text}
                    </p>
                    <span className={`text-[10px] mt-2 block font-medium ${isMe ? 'text-indigo-200' : 'text-gray-400'} ${isMe ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 shrink-0">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-slate-50 border border-gray-200 rounded-full pl-6 pr-16 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-[15px] font-medium placeholder:text-gray-400"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className={`absolute right-2 p-2.5 rounded-full transition-all shadow-sm flex items-center justify-center ${
              input.trim() 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={18} className={input.trim() ? 'ml-0.5' : ''} />
          </button>
        </form>
      </div>
      
    </div>
  );
};

export default CommunityChat;
