import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, Shield, Zap, BookOpen, Star, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// We need to declare Razorpay globally since it's injected via script
declare global {
  interface Window {
    Razorpay: any;
  }
}

const UpgradePro = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(999);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/settings');
        if (res.data && res.data.proSubscriptionPrice) {
          setPrice(res.data.proSubscriptionPrice);
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };
    fetchSettings();
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      const token = userInfoStr ? JSON.parse(userInfoStr).token : '';

      // 1. Create Order on Backend
      const { data } = await axios.post('http://localhost:5001/api/payment/orders', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 2. Initialize Razorpay Checkout
      if (data.mock) {
        // SIMULATE SUCCESSFUL PAYMENT (Because we are using dummy keys)
        toast('Simulating payment (Test Mode)...', { icon: '🔄' });
        
        setTimeout(async () => {
          try {
            const verifyRes = await axios.post('http://localhost:5001/api/payment/verify', {
              mock: true
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (verifyRes.data.isPro) {
              toast.success('Welcome to Pro! Payment simulated successfully. 🎉', { duration: 5000 });
              if (user) {
                const updatedUser = { ...user, isPro: true };
                login(updatedUser);
              }
              navigate('/');
            }
          } catch (error) {
            toast.error('Payment simulation failed.');
          } finally {
            setLoading(false);
          }
        }, 2000);
        return; // Don't try to open real Razorpay
      }

      // NORMAL RAZORPAY FLOW
      const options = {
        key: 'rzp_test_MOCK_KEY_ID_123', // This should be imported from env ideally
        amount: data.order.amount,
        currency: "INR",
        name: "R.K. W🌎RLD Academy",
        description: "Pro Subscription",
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await axios.post('http://localhost:5001/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (verifyRes.data.isPro) {
              toast.success('Welcome to Pro! Your payment was successful. 🎉', { duration: 5000 });
              // Update local context
              if (user) {
                const updatedUser = { ...user, isPro: true };
                login(updatedUser);
              }
              navigate('/');
            }
          } catch (error) {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: user?.name || "Student",
          email: user?.email || "",
          contact: ""
        },
        theme: {
          color: "#4F46E5" // Indigo 600
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (error) {
      toast.error('Could not initialize payment. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 pt-8">
      
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-full mb-2 shadow-sm border border-indigo-200">
          <Star size={32} fill="currentColor" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Pro</span></h1>
        <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">Unlock your full potential with unlimited access to premium courses, ad-free mock tests, and top-tier library materials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Features List */}
        <div className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">What you get</h3>
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <div className="bg-green-100 p-2 rounded-full text-green-600 shrink-0"><CheckCircle2 size={20} /></div>
              <div>
                <p className="font-bold text-gray-900">Unlimited Mock Tests</p>
                <p className="text-sm text-gray-500">Take as many tests as you want, anytime.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="bg-indigo-100 p-2 rounded-full text-indigo-600 shrink-0"><BookOpen size={20} /></div>
              <div>
                <p className="font-bold text-gray-900">Premium Library Access</p>
                <p className="text-sm text-gray-500">Download exclusive handwritten notes and DPPs.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 shrink-0"><Zap size={20} /></div>
              <div>
                <p className="font-bold text-gray-900">Priority Doubt Solving</p>
                <p className="text-sm text-gray-500">Get your doubts resolved faster by top educators.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="bg-purple-100 p-2 rounded-full text-purple-600 shrink-0"><Shield size={20} /></div>
              <div>
                <p className="font-bold text-gray-900">Ad-Free Experience</p>
                <p className="text-sm text-gray-500">Focus on learning without any distractions.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Pricing Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden transform md:-translate-y-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10 text-center space-y-6">
            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold tracking-widest uppercase">
              Most Popular
            </div>
            
            <div className="flex justify-center items-end gap-1">
              <span className="text-3xl font-bold text-indigo-200">₹</span>
              <span className="text-6xl font-black">{price}</span>
              <span className="text-xl font-medium text-indigo-200 mb-1">/year</span>
            </div>
            
            <p className="text-indigo-100 font-medium pb-6 border-b border-white/20">One time payment, lifetime value.</p>
            
            <button 
              onClick={handlePayment} 
              disabled={loading}
              className="w-full py-4 bg-white text-indigo-600 hover:bg-indigo-50 font-black rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all hover:scale-105 flex justify-center items-center gap-2 text-lg disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Buy Now Securely'}
            </button>
            <p className="text-xs text-indigo-200 mt-4 flex items-center justify-center gap-1">
              <Shield size={12} /> Secured by Razorpay
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UpgradePro;
