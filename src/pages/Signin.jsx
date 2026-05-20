import React, { useState } from 'react';
import { X, Mail, Phone } from 'lucide-react';
import { MOCK_SIGNIN_DATA } from '../data/MockSignin';
import { useAuth } from '../context/AuthContext';

const Signin = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [step, setStep] = useState('input'); // 'input' or 'verify'
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleContinue = () => {
    if (!inputValue) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setStep('verify');
  };

  const handleVerify = () => {
    if (password) {
      // Success - allow any non-empty password
      login({
        type: 'email',
        identifier: inputValue,
        name: 'Guest',
        initial: inputValue[0].toUpperCase()
      });
      onClose();
      // Reset state
      setStep('input');
      setInputValue('');
      setPassword('');
      setError('');
    } else {
      setError('Please enter your password.');
    }
  };

  const handleClose = () => {
    onClose();
    setStep('input');
    setInputValue('');
    setPassword('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[400px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-serif text-[#0f4c3a] font-medium leading-tight">
            Login to Arrivio
          </h2>
          <button 
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors group"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {step === 'input' ? (
            /* --- INPUT STEP --- */
            <>
              <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</span>
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 transition-all text-sm placeholder:text-gray-300 font-medium"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

              {/* Continue Button */}
              <button 
                onClick={handleContinue}
                className="w-full h-12 bg-[#1e2d24] text-white rounded-lg font-semibold text-base hover:bg-[#15201a] transition-colors shadow-lg shadow-black/10"
              >
                Continue
              </button>
            </>
          ) : (
            /* --- PASSWORD STEP --- */
            <div className="space-y-6 animate-in slide-in-from-right-2 duration-300 py-2">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-[#1e2d24]">Enter Password</h3>
                <p className="text-sm text-gray-500">
                  Welcome back, <span className="font-semibold text-gray-700">{inputValue}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</span>
                  <input 
                    type="password" 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 transition-all text-sm placeholder:text-gray-300 font-medium"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}

              <button 
                onClick={handleVerify}
                className="w-full h-12 bg-[#1e2d24] text-white rounded-lg font-semibold text-base hover:bg-[#15201a] transition-colors shadow-lg shadow-black/10"
              >
                Login
              </button>

              <div className="flex justify-between items-center px-1">
                <button 
                  onClick={() => { setStep('input'); setPassword(''); setError(''); }}
                  className="text-[13px] font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Change Email
                </button>
                <button 
                  className="text-[13px] font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          )}

          {/* Common Checkboxes (only on first step) */}
          {step === 'input' && (
            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="w-4 h-4 border-2 border-gray-300 rounded peer-checked:bg-[#1e2d24] peer-checked:border-[#1e2d24] transition-all"></div>
                  <svg className="absolute inset-0 w-4 h-4 text-white scale-0 peer-checked:scale-100 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-gray-600 text-[13px] font-medium">Keep me signed in</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="w-4 h-4 border-2 border-gray-300 rounded peer-checked:bg-[#1e2d24] peer-checked:border-[#1e2d24] transition-all"></div>
                  <svg className="absolute inset-0 w-4 h-4 text-white scale-0 peer-checked:scale-100 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-gray-500 text-[11px] leading-tight">
                  By signing in you agree to our <span className="text-gray-800 font-semibold underline">Privacy Policy</span> and <span className="text-gray-800 font-semibold underline">Terms & Conditions</span>
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signin;
