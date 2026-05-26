import React, { useState, useEffect, useRef } from "react";
import { Send, Phone, ShieldCheck, X, Mic, Volume2, Grid, PhoneOff, User } from "lucide-react";

export default function SecureChatDrawer({ isOpen, onClose, recipient }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState("Connecting via secure proxy..."); // 'Connecting...', 'Ringing...', 'Connected', 'Ended'
  
  const chatEndRef = useRef(null);
  const durationTimer = useRef(null);

  // Initialize secure message history based on recipient
  useEffect(() => {
    if (!recipient) return;
    
    let defaultMsg = "";
    if (recipient.category === "transport") {
      defaultMsg = `Hello! I am your driver, ${recipient.name || "Thomas"}. I've received your request for the airport transfer. I'll coordinate everything directly for the employee(s)!`;
    } else {
      defaultMsg = `Hi! I am your dedicated relocation expert, ${recipient.name || "Elena"}. I'm handling the ${recipient.serviceName || "administrative"} setup. How can I help you keep your employees' transition seamless?`;
    }

    setMessages([
      {
        id: "welcome-1",
        sender: "specialist",
        text: defaultMsg,
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
    
    // Reset state
    setInputText("");
    setIsCalling(false);
    setCallDuration(0);
  }, [recipient]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Timer for secure calling proxy simulation
  useEffect(() => {
    if (isCalling && callStatus === "Connected") {
      durationTimer.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(durationTimer.current);
    }
    return () => clearInterval(durationTimer.current);
  }, [isCalling, callStatus]);

  if (!isOpen || !recipient) return null;

  // Format call duration to MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Simulate Call Flow
  const startCall = () => {
    setIsCalling(true);
    setCallStatus("Connecting secure line...");
    setCallDuration(0);
    
    // Ringing state after 1.5s
    setTimeout(() => {
      setCallStatus("Ringing...");
      
      // Connect after 2s
      setTimeout(() => {
        setCallStatus("Connected");
      }, 2000);
    }, 1500);
  };

  const endCall = () => {
    setCallStatus("Call Ended");
    clearInterval(durationTimer.current);
    setTimeout(() => {
      setIsCalling(false);
      setCallDuration(0);
    }, 1200);
  };

  // Intelligent responder logic based on B2B query patterns
  const getSmartReply = (userText) => {
    const txt = userText.toLowerCase();
    
    if (recipient.category === "transport") {
      if (txt.includes("where") || txt.includes("status") || txt.includes("reached")) {
        return "I am currently at the arrivals terminal holding the Arrivio welcome sign. The flight has landed and I expect the employees to pass through baggage claim shortly!";
      }
      if (txt.includes("delay") || txt.includes("flight")) {
        return "Don't worry, I monitor the flight status in real-time. Even if there is a delay, I will wait at the arrivals gate to ensure a smooth pickup.";
      }
      if (txt.includes("number") || txt.includes("contact")) {
        return "My secure line is fully open through this app. For security and company logging, please keep all communication on the Arrivio dashboard.";
      }
      return "Got it! I am fully on track to provide a high-end, comfortable airport transfer. I will update the status indicator as soon as the pickup is complete.";
    } else {
      // Consultancy responses
      if (txt.includes("tax") || txt.includes("steuer") || txt.includes("id")) {
        return `I am finalizing the Tax ID filings for the employees. German tax offices usually issue these within 2-3 weeks, and I will upload the registration details here as soon as they are assigned!`;
      }
      if (txt.includes("insurance") || txt.includes("health") || txt.includes("tk")) {
        return "The health insurance applications have been successfully pre-filed with Techniker Krankenkasse (TK). All employees are fully covered from their official start date.";
      }
      if (txt.includes("anmeldung") || txt.includes("address") || txt.includes("register")) {
        return "We have successfully booked the address registration (Anmeldung) appointments. I will meet the employees directly at the Bürgeramt to assist with their paperwork!";
      }
      if (txt.includes("status") || txt.includes("update") || txt.includes("how is")) {
        return `Everything is moving perfectly ahead of schedule. The document folders are 100% complete and fully verified. I will submit the official dossiers today.`;
      }
      if (txt.includes("thank") || txt.includes("great") || txt.includes("awesome")) {
        return "You're very welcome! Providing a premium, stress-free settling experience for your team is my priority. Let me know if there's anything else you need.";
      }
      return "Absolutely. I am on top of this file and reviewing the latest administrative details now. I will make sure everything is handled flawlessly.";
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: "employer",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate smart expert response with elegant delay
    setTimeout(() => {
      setIsTyping(false);
      const replyText = getSmartReply(userMessage.text);
      setMessages(prev => [...prev, {
        id: `msg-${Date.now() + 1}`,
        sender: "specialist",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1800);
  };

  return (
    <>
      {/* ── MESSAGING SLIDE-OUT DRAWER ── */}
      <div className="fixed inset-y-0 right-0 z-[9990] w-full sm:w-[420px] bg-white border-l border-gray-150 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out translate-x-0 animate-in slide-in-from-right duration-300">
        
        {/* Header Section */}
        <div className="p-4 border-b border-gray-100 bg-[#0f4c3a]/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Safe avatar initials */}
            <div className="w-10 h-10 rounded-full bg-[#0f4c3a] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {recipient.name ? recipient.name.split(" ").map(n => n[0]).join("") : "SP"}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-gray-900 text-sm">{recipient.name}</h4>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-[#0f4c3a] font-bold uppercase tracking-wider mt-0.5">
                {recipient.category === "transport" ? "Verified Arrivio Driver" : "Dedicated Relocation Expert"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            {/* Secure Call Action */}
            <button 
              type="button"
              onClick={startCall}
              className="p-2 text-gray-500 hover:text-[#0f4c3a] hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
              title="Secure Call"
            >
              <Phone size={17} className="stroke-[2.5]" />
            </button>
            {/* Close Drawer */}
            <button 
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Security Shield Banner - Reassures user and details hidden rationale */}
        <div className="bg-emerald-50/50 border-b border-emerald-100/30 px-4 py-2 flex items-center gap-2 text-emerald-800 text-[10px] font-bold">
          <ShieldCheck size={14} className="shrink-0 text-emerald-600 stroke-[2.5]" />
          <span className="uppercase tracking-wider">Secure Arrivio Proxy Channel • Logs Preserved</span>
        </div>

        {/* Message History Block */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
          {messages.map((m) => {
            const isMe = m.sender === "employer";
            return (
              <div 
                key={m.id} 
                className={`flex flex-col max-w-[82%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                  isMe 
                    ? "bg-[#0f4c3a] text-white rounded-br-none shadow-sm" 
                    : "bg-white text-gray-800 border border-gray-150 rounded-bl-none shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                }`}>
                  {m.text}
                </div>
                <span className="text-[9px] text-gray-400 mt-1 px-1 font-bold">
                  {m.timestamp}
                </span>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex flex-col max-w-[82%] mr-auto items-start animate-pulse">
              <div className="p-3 bg-white text-gray-400 border border-gray-150 rounded-2xl rounded-bl-none shadow-sm text-xs font-bold flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wider">{recipient.name.split(" ")[0]} is typing</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce duration-500" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce duration-500 delay-75" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce duration-500 delay-150" />
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Chat Input form */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask ${recipient.name.split(" ")[0]} an update...`}
            className="flex-1 h-10 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0f4c3a] focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-xl bg-[#0f4c3a] text-white hover:bg-[#0a3120] flex items-center justify-center transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-sm"
          >
            <Send size={15} />
          </button>
        </form>
      </div>

      {/* ── SECURE DIALER PROXY OVERLAY ── */}
      {isCalling && (
        <div className="fixed inset-0 z-[9999] bg-[#071911]/95 backdrop-blur-lg flex flex-col items-center justify-between p-8 text-white animate-in fade-in duration-300">
          
          {/* Dialer Header */}
          <div className="text-center pt-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-900/60 rounded-full text-emerald-400 text-[9px] font-black uppercase tracking-widest shadow-inner mb-3">
              <ShieldCheck size={12} className="stroke-[2.5]" />
              Secure Arrivio Proxy Call
            </div>
            <p className="text-xs text-emerald-400/80 font-bold uppercase tracking-widest mt-1">
              Encrypted Proxy Active
            </p>
          </div>

          {/* Caller Details & Animated Ripple Circle */}
          <div className="flex flex-col items-center justify-center my-auto gap-5">
            <div className="relative flex items-center justify-center">
              {/* Ripple circles */}
              <div className="absolute w-32 h-32 rounded-full border border-emerald-500/20 animate-ping duration-1000" />
              <div className="absolute w-44 h-44 rounded-full border border-emerald-500/10 animate-pulse duration-2000" />
              
              <div className="w-24 h-24 rounded-full bg-[#0f4c3a] border-4 border-emerald-500/30 flex items-center justify-center text-white text-3xl font-extrabold shadow-2xl relative z-10">
                {recipient.name ? recipient.name.split(" ").map(n => n[0]).join("") : <User size={35} />}
              </div>
            </div>

            <div className="text-center mt-3 z-10">
              <h3 className="text-2xl font-black tracking-tight">{recipient.name}</h3>
              <p className="text-xs text-gray-400 mt-1 font-semibold uppercase tracking-wider">
                {recipient.category === "transport" ? "Arrivio Airport Shuttle Driver" : "Relocation Coordinator"}
              </p>
              
              {/* Status or duration timer */}
              <div className="mt-4 h-6 flex items-center justify-center">
                {callStatus === "Connected" ? (
                  <span className="text-emerald-400 font-extrabold font-mono text-sm flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-950/30 border border-emerald-900/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {formatTime(callDuration)}
                  </span>
                ) : (
                  <span className="text-sm font-bold text-gray-300 animate-pulse">
                    {callStatus}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Call controls UI & End button */}
          <div className="w-full max-w-xs flex flex-col items-center gap-8 pb-8">
            <div className="grid grid-cols-3 gap-8 w-full justify-items-center">
              <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center text-white cursor-pointer" title="Mute">
                <Mic size={18} />
              </button>
              <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center text-white cursor-pointer" title="Keypad">
                <Grid size={18} />
              </button>
              <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center text-white cursor-pointer" title="Speaker">
                <Volume2 size={18} />
              </button>
            </div>

            <button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-90 transition-all flex items-center justify-center text-white cursor-pointer shadow-lg shadow-rose-950/40 hover:shadow-rose-900/50"
              title="Hang Up"
            >
              <PhoneOff size={26} className="stroke-[2.5]" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
