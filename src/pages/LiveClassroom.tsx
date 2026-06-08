import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, Send, MessageSquare, HelpCircle, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Connect to local Node.js backend
const SOCKET_URL = 'http://localhost:5001';

type ChatMessage = {
  id: number;
  sender: string;
  text: string;
  isTeacher: boolean;
};

const LiveClassroom = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'qa'>('chat');
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  
  // Camera state
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [liveData, setLiveData] = useState<any>(null);

  useEffect(() => {
    // Fetch initial data
    const fetchLiveData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/live');
        setLiveData(data);
        if (data && data.chatMessages) {
          setChatMessages(data.chatMessages);
        }
      } catch (err) {
        console.error('Error fetching live data:', err);
      }
    };
    fetchLiveData();

    // Initialize Socket Connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Join a specific class room (dummy ID for now)
    newSocket.emit('join-class', 'physics-101');

    // Listen for incoming messages
    newSocket.on('receive-message', (data: ChatMessage) => {
      setChatMessages((prev) => [...prev, data]);
      // Auto scroll
      setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      }, 100);
    });

    // Start Camera
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    return () => {
      newSocket.disconnect();
      // Stop camera tracks when leaving
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Toggle Video/Audio Tracks
  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOff;
      });
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [isVideoOff, isMuted, localStream]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;
    
    // Emit message to backend
    socket.emit('send-message', {
      classId: 'physics-101',
      sender: user?.name || 'Student',
      text: message,
      isTeacher: user?.role === 'admin'
    });
    
    setMessage('');
    
    // Auto scroll for sender
    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 100);
  };

  return (
    <div className="h-screen w-full flex bg-gray-950 font-sans overflow-hidden">
      
      {/* Left Area: Main Video Container */}
      <div className="flex-1 flex flex-col relative h-full">
        
        {/* Modern Top Header overlay on video */}
        <div className="absolute top-0 left-0 right-0 p-6 z-10 flex justify-between items-start pointer-events-none">
          <div className="bg-gray-900/80 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shadow-2xl">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mb-1.5">{liveData?.title || 'Waiting for Class...'}</h2>
            <div className="flex items-center gap-4">
              <div className="bg-red-500/20 px-2.5 py-1 rounded-md border border-red-500/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                <span className="text-red-500 text-xs font-black uppercase tracking-widest">LIVE NOW</span>
              </div>
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
              <p className="text-gray-300 text-sm font-bold flex items-center gap-1.5">
                <span className="text-gray-500 font-normal">Instructor:</span> {liveData?.teacher || '...'}
              </p>
            </div>
          </div>
          
          <div className="bg-gray-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl flex items-center gap-2 border border-white/10 pointer-events-auto shadow-xl">
            <Users size={16} className="text-gray-400" />
            <span className="text-sm font-bold text-white">{liveData?.viewers ? liveData.viewers.toLocaleString() : 0} watching</span>
          </div>
        </div>

        {/* Big Video Player Background */}
        <div className="flex-1 w-full h-full relative flex items-center justify-center p-6 pb-28">
          
          <div className="w-full h-full max-w-5xl max-h-[80vh] bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-gray-800 flex flex-col items-center justify-center">
            
            {/* The Main Screen Video placeholder */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-inner">
                <Video size={40} className="text-gray-600" />
              </div>
              <p className="text-gray-500 font-bold tracking-wide">Waiting for instructor to broadcast screen...</p>
            </div>

            {/* User Mini-cam (Real WebCam) */}
            <div className="absolute bottom-6 right-6 w-48 md:w-60 aspect-video bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300 z-20">
               <video 
                 ref={localVideoRef}
                 autoPlay 
                 playsInline 
                 muted 
                 className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'} scale-x-[-1]`}
               ></video>
               {isVideoOff ? (
                 <div className="w-full h-full flex items-center justify-center text-red-500 bg-gray-900">
                    <VideoOff size={32} />
                 </div>
               ) : null}
            </div>
          </div>
        </div>

        {/* Floating Bottom Control Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-gray-900/90 backdrop-blur-xl px-6 py-4 rounded-full flex items-center justify-center gap-3 md:gap-5 shadow-2xl border border-white/10">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3.5 rounded-full transition-all duration-300 ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <button 
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3.5 rounded-full transition-all duration-300 ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
            
            <button className="p-3.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300">
              <MonitorUp size={20} />
            </button>

            <button className="p-3.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300">
              <Settings size={20} />
            </button>
            
            <div className="w-px h-8 bg-gray-700 mx-1"></div>
            
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-105 ml-1"
            >
              <PhoneOff size={18} />
              <span className="hidden md:inline">Leave</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Area: White Sidebar Chat (Modern UI) */}
      <div className="w-80 md:w-96 bg-white border-l border-gray-200 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-30">
        
        {/* Chat Tabs */}
        <div className="flex border-b border-gray-100 px-4 pt-4 pb-0 bg-gray-50/50">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'chat' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <MessageSquare size={16} /> Public Chat
          </button>
          <button 
            onClick={() => setActiveTab('qa')}
            className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'qa' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <HelpCircle size={16} /> Q & A
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white" ref={chatScrollRef}>
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
              <MessageSquare size={32} className="opacity-50" />
              <p className="text-sm font-medium">No messages yet. Be the first!</p>
            </div>
          ) : (
            chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === (user?.name || 'Student') ? 'items-end' : 'items-start'}`}>
                {msg.sender !== (user?.name || 'Student') && (
                  <span className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider flex items-center gap-1">
                    {msg.sender} {msg.isTeacher && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[8px]">FACULTY</span>}
                  </span>
                )}
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                    msg.sender === (user?.name || 'Student') 
                      ? 'bg-red-600 text-white rounded-tr-sm' 
                      : msg.isTeacher
                        ? 'bg-blue-50 text-blue-900 border border-blue-100 rounded-tl-sm font-medium'
                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chat Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..." 
              className="w-full bg-gray-100 border-none text-gray-800 text-sm rounded-full py-3.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
            <button 
              type="submit" 
              disabled={!message.trim()}
              className="absolute right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:hover:bg-red-600"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default LiveClassroom;
