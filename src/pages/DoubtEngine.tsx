import { useState, useRef, useEffect } from 'react';
import { Camera, Send, Sparkles, Image as ImageIcon, Loader2, X, Bot, User, Copy, Share2, Trash2 } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

type Message = {
  id: string;
  role: 'user' | 'ai';
  text?: string;
  image?: string;
};

const DoubtEngine = () => {
  const [query, setQuery] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('doubtHistory');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [isSolving, setIsSolving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync messages to local storage
  useEffect(() => {
    localStorage.setItem('doubtHistory', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if (!query.trim() && !imagePreview) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      image: imagePreview || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setImageFile(null);
    setImagePreview(null);
    setIsSolving(true);

    try {
      // Send to backend solve endpoint
      const response = await axios.post('https://rk-world.onrender.com/api/doubts/solve', {
        text: userMessage.text,
        imageBase64: userMessage.image
      });

      // Add AI response to chat
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: response.data.solution
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Failed to get solution:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: "Sorry, I couldn't process that right now. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSolving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSolving) {
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.24))] max-w-5xl mx-auto">
      
      {/* Main Chat / Doubt Area */}
      <div className="flex-1 flex flex-col glass-panel rounded-3xl overflow-hidden shadow-sm">
        
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md p-6 border-b border-gray-100 flex items-center justify-between z-10 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Sparkles className="text-purple-500" /> AI Doubt Engine
            </h1>
            <p className="text-gray-500 font-medium mt-1">Snap a photo or type your question for an instant step-by-step solution.</p>
          </div>
          <div className="flex items-center gap-3">
            {messages.length > 0 && (
              <button onClick={() => setMessages([])} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors border border-transparent hover:border-red-100 hidden sm:flex">
                <Trash2 size={16} /> Clear History
              </button>
            )}
            <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl font-bold border border-purple-100 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              AI Active
            </div>
          </div>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50 pb-12">
          
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-6">
                <Camera size={40} className="text-gray-300" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">How can I help you today?</h2>
              <p className="text-gray-500 max-w-md font-medium leading-relaxed">
                Upload a picture of any question from your book, or type it below. Our AI will solve it instantly!
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'}`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                
                <div className={`max-w-[85%] rounded-3xl p-5 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-sm shadow-indigo-500/20' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-gray-200/50'
                }`}>
                  {msg.image && (
                    <img src={msg.image} alt="User upload" className="max-w-full rounded-lg mb-3 shadow-sm border border-black/10" />
                  )}
                  {msg.text && (
                    <div className={msg.role === 'user' ? 'text-white text-[15px]' : 'prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:text-gray-900 prose-strong:text-gray-900 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none'}>
                      {msg.role === 'user' ? (
                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                      ) : (
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      )}
                    </div>
                  )}
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100/50">
                      <button 
                        onClick={() => { 
                          navigator.clipboard.writeText(msg.text || '');
                          alert('Answer copied to clipboard!');
                        }} 
                        className="text-gray-400 hover:text-indigo-600 flex items-center gap-1 text-xs font-bold transition-colors"
                      >
                        <Copy size={14} /> Copy Answer
                      </button>
                      <button 
                        onClick={() => { 
                          if(navigator.share) {
                            navigator.share({title: 'AI Answer', text: msg.text});
                          } else {
                            navigator.clipboard.writeText(msg.text || '');
                            alert('Answer copied to clipboard!');
                          }
                        }} 
                        className="text-gray-400 hover:text-indigo-600 flex items-center gap-1 text-xs font-bold transition-colors"
                      >
                        <Share2 size={14} /> Share
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          {isSolving && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot size={20} />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm rounded-tl-sm flex items-center gap-3">
                <Loader2 size={18} className="animate-spin text-purple-500" />
                <span className="text-gray-500 font-medium">Analyzing question and solving...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
          
          {/* Image Preview Area */}
          {imagePreview && (
            <div className="mb-4 relative inline-block">
              <img src={imagePreview} alt="Preview" className="h-24 rounded-xl border-2 border-purple-100 shadow-sm" />
              <button 
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="relative flex items-center">
            {/* Hidden File Input */}
            <input 
              type="file" 
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageSelect}
              className="hidden"
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-4 p-2 text-gray-400 hover:text-purple-600 bg-gray-50 hover:bg-purple-50 rounded-full transition-colors shadow-sm border border-gray-100 hover:border-purple-200"
              title="Upload image"
            >
              <ImageIcon size={20} />
            </button>
            
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your question here or upload a photo of the problem..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-16 pr-16 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 shadow-inner transition-all font-medium"
            />
            
            <button 
              onClick={handleSend}
              disabled={isSolving || (!query.trim() && !imagePreview)}
              className={`absolute right-4 p-3 rounded-xl transition-all shadow-md flex items-center justify-center ${
                (query.trim() || imagePreview) && !isSolving
                  ? 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:-translate-y-0.5' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default DoubtEngine;
