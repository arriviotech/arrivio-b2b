import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, Send, CheckCircle2, LifeBuoy, Mail, Headset, 
  Search, ChevronDown, ChevronUp, Phone, Sparkles,
  HelpCircle, MessageCircle, ArrowLeft, Clock, Plus
} from 'lucide-react';

const FAQS = [
  {
    q: "How long does Address Registration (Anmeldung) usually take?",
    a: "Typically between 1 to 2 weeks depending on local city office (Bürgeramt) appointment availability. Arrivio automatically pre-fills documents and secures the earliest possible slot for your employees."
  },
  {
    q: "Can I top up my B2B credits instantly?",
    a: "Yes! Go to the Payments section, click 'Top Up Credits', and enter your card details or select SEPA bank transfer. Credit card top-ups are credited to your account balance immediately."
  },
  {
    q: "What is the cancellation policy for relocation services?",
    a: "Services can be fully cancelled and refunded back to your credit balance up to 48 hours before scheduled service execution. Inside 48 hours, cancellations may incur a 50% coordination fee."
  },
  {
    q: "How do I link an employee to an airport pickup driver?",
    a: "Once an airport pickup service is paid for, it moves to the 'Status & History' tab. Click on the order to expand details, select the employee from the grid, and click 'Secure Call' or 'Secure Chat' to coordinate."
  },
  {
    q: "How are tax IDs generated for new employee arrivals?",
    a: "Upon successful completion of the Address Registration (Anmeldung), the German Federal Tax Office automatically issues the Steuer-ID within 2 to 3 weeks and posts it to the resident's registered address."
  }
];

const Support = () => {
  const [submitted, setSubmitted] = useState(false);
  const [faqSearch, setFaqSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  
  // Form fields
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Mock previous tickets list
  const [tickets, setTickets] = useState([
    {
      id: 'TK-8492',
      subject: 'Missing capacity for Berlin property',
      status: 'In Progress',
      priority: 'urgent',
      date: 'Mar 14, 2026',
      time: '10:30 AM'
    },
    {
      id: 'TK-8210',
      subject: 'Payment receipt not generated',
      status: 'Resolved',
      priority: 'normal',
      date: 'Mar 10, 2026',
      time: '02:15 PM'
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const newTicket = {
      id: `TK-${Math.floor(8000 + Math.random() * 2000)}`,
      subject,
      status: 'In Progress',
      priority: 'normal',
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }),
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };

    setTickets(prev => [newTicket, ...prev]);
    setSubmitted(true);
    setShowTicketForm(false);
    setSubject("");
    setMessage("");
  };

  const filteredFaqs = useMemo(() => {
    return FAQS.filter(
      faq => faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
             faq.a.toLowerCase().includes(faqSearch.toLowerCase())
    );
  }, [faqSearch]);



  return (
    <div className="max-w-[1100px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20 select-none">
      
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 pb-2">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0f4c3a] bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 rounded-full mb-2.5 inline-block shadow-sm">
            ✦ Client Concierge
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 leading-none mt-1">Help & Support</h1>
          <p className="text-gray-500 mt-2 font-medium text-sm">
            Access priority 24/7 corporate support, search FAQs, or coordinate tickets.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-100/30 px-3.5 py-2 rounded-xl shrink-0 shadow-sm">
          <Clock className="w-4 h-4 text-[#0f4c3a] animate-pulse" />
          <span className="text-xs font-bold text-gray-800">Priority Response Window: &lt; 15 mins</span>
        </div>
      </div>

      {submitted ? (
        /* SUCCESS STATE & REVEALED CONCIERGE CARD FLOW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start animate-in zoom-in-95 duration-300">
          {/* Left Side: Success banner & detail check */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-[#0f4c3a] border border-emerald-100/50 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/30 shadow-inner">
                <CheckCircle2 className="w-8 h-8 text-[#0f4c3a]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Ticket Submitted Successfully!</h3>
              <p className="text-sm text-gray-505 max-w-md mx-auto leading-relaxed font-medium">
                We have registered your ticket and flagged your account priority. A dedicated relocation coordinator will reach out via email or phone within 15 minutes.
              </p>
              
              <div className="p-4.5 bg-gray-50 border border-gray-150 rounded-2xl text-xs font-semibold text-gray-700 max-w-sm mx-auto space-y-2">
                <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase">
                  <span>Assigned Team</span>
                  <span>Relocation Operations</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Priority Escalation</span>
                  <span className="text-[#0f4c3a] font-extrabold uppercase">High Priority B2B</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={() => { setSubmitted(false); setShowTicketForm(false); }}
                  className="h-10 px-5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-extrabold text-xs uppercase tracking-wider rounded-xl border border-gray-200 active:scale-95 transition-all cursor-pointer"
                >
                  Back to FAQs
                </button>
                <button
                  onClick={() => { setSubmitted(false); setShowTicketForm(true); }}
                  className="h-10 px-5 bg-[#0f4c3a] hover:bg-[#0a3a2b] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border border-[#0f4c3a] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  Raise Another Ticket
                </button>
              </div>

            </div>

            {/* Support Ticket History */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-sm">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Previous Support Tickets</h3>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Tracking status of recent corporate support submissions</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-gray-150 text-gray-600 text-[9px] font-black uppercase tracking-wider border border-gray-200">
                  History ({tickets.length})
                </span>
              </div>
              
              <div className="divide-y divide-gray-50">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="p-5 hover:bg-gray-50/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-black text-gray-450 tracking-wider uppercase bg-gray-50 border border-gray-150 px-1.5 py-0.5 rounded">
                          {ticket.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border select-none shrink-0 ${
                          ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-705 border-emerald-100/60' : 'bg-blue-50 text-blue-700 border-blue-100/60'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm truncate pr-4">{ticket.subject}</h4>
                    </div>
                    
                    <div className="text-left sm:text-right shrink-0 flex sm:flex-col gap-x-2 gap-y-0.5 text-xs text-gray-400 font-medium">
                      <span className="text-gray-700 font-bold">{ticket.date}</span>
                      <span className="hidden sm:inline text-gray-200 font-light">•</span>
                      <span>{ticket.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Side: REVEALED VIP CONCIERGE CARD */}
          <div className="md:col-span-1 space-y-6">
            {/* VIP Concierge Card */}
            <div className="bg-[#0f4c3a] rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-[#0f4c3a]/25 group animate-in slide-in-from-right duration-550">
              
              <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-white/5 blur-2xl group-hover:bg-white/10 transition-colors duration-500 pointer-events-none" />

              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 bg-white/10 text-white rounded-xl flex items-center justify-center shrink-0 border border-white/5 shadow-sm">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] font-extrabold text-emerald-300 uppercase tracking-widest">Arrivio Elite</span>
                  <h3 className="text-base font-bold text-white leading-none mt-0.5">Your Concierge</h3>
                </div>
              </div>

              {/* Profile Section */}
              <div className="flex items-center gap-3.5 bg-white/5 border border-white/5 rounded-2xl p-3.5 mb-6">
                <div className="w-12 h-12 rounded-full bg-white/15 border-2 border-white/20 flex items-center justify-center font-extrabold text-base tracking-tight shrink-0 select-none shadow-sm">
                  SD
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-white">Sarah Davies</h4>
                  <p className="text-xs text-emerald-350 mt-0.5 font-bold">Dedicated B2B Success Partner</p>
                  <p className="text-[9px] text-gray-300 mt-1 font-medium italic">Priority Support Line Active</p>
                </div>
              </div>

              <div className="space-y-3.5 pt-1">
                <a 
                  href="tel:1800ARRIVIOELITE"
                  className="h-10 px-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                >
                  <Phone size={12} className="text-[#0f4c3a]" />
                  Secure Hot Call
                </a>
                
                <div className="border-t border-white/10 my-4 pt-3 space-y-2.5">
                  <div className="flex items-center gap-3 text-xs text-gray-200">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Headset className="w-3.5 h-3.5 text-emerald-300" />
                    </div>
                    <span className="font-bold tracking-tight">1800-ARRIVIO-ELITE</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-200">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Mail className="w-3.5 h-3.5 text-emerald-300" />
                    </div>
                    <span className="font-bold tracking-tight">priority@arrivio.com</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-5 bg-emerald-50/50 border border-emerald-100/30 rounded-2xl text-[11px] font-medium text-emerald-800 leading-relaxed flex items-start gap-2.5">
              <LifeBuoy className="w-4 h-4 text-[#0f4c3a] shrink-0 mt-0.5 animate-pulse" />
              <span>
                As an Arrivio B2B Elite client, raising a ticket triggers premium escalation. Your dedicated partner (Sarah) is notified immediately and will call you back if needed.
              </span>
            </div>
          </div>
        </div>
      ) : showTicketForm ? (
        /* ── REDESIGNED TICKET FORM ── */
        <div className="animate-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => setShowTicketForm(false)}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors mb-6 cursor-pointer border-0 bg-transparent"
          >
            <ArrowLeft size={13} />
            Back to Help Center
          </button>

          <div className="grid lg:grid-cols-[1fr_340px] gap-6">

            {/* ── LEFT: Form ── */}
            <div className="bg-white rounded-3xl border border-[#e5e7eb] shadow-sm overflow-hidden">
              {/* Form header */}
              <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#0f4c3a]/8 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-[#0f4c3a]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">New Support Request</h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Routed directly to our relocation operations team</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="px-8 py-7 space-y-6">

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What do you need help with?"
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#0f4c3a] focus:ring-2 focus:ring-[#0f4c3a]/10 focus:outline-none transition-all text-gray-800 font-medium text-sm placeholder:text-gray-300"
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">
                    Details
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue in detail — include any affected employee names, property names, or service IDs if relevant..."
                    className="w-full min-h-[180px] p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#0f4c3a] focus:ring-2 focus:ring-[#0f4c3a]/10 focus:outline-none transition-all text-gray-800 font-medium text-sm resize-none placeholder:text-gray-300 leading-relaxed"
                    required
                  />
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between gap-4 pt-1">
                  <p className="text-[11px] text-gray-400 font-medium">
                    <Clock className="inline w-3 h-3 mr-1 -mt-px" />
                    Response within 15 minutes
                  </p>
                  <button
                    type="submit"
                    className="h-11 px-7 bg-[#0f4c3a] hover:bg-[#0a3a2b] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Ticket
                  </button>
                </div>
              </form>
            </div>

            {/* ── RIGHT: Sidebar ── */}
            <div className="space-y-4">

              {/* Recent tickets */}
              <div className="bg-white rounded-3xl border border-[#e5e7eb] overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 text-sm">Recent Tickets</h4>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-full">{tickets.length}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {tickets.length > 0 ? tickets.map((t) => (
                    <div key={t.id} className="px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{t.subject}</p>
                          <p className="text-[10px] text-gray-400 font-medium mt-0.5">{t.id} · {t.date}</p>
                        </div>
                        <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                          t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>{t.status}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="px-5 py-6 text-center text-[11px] text-gray-400 font-medium">No tickets yet</div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* INSTANT FAQS VIEW (DEFAULT STATE) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-500">
          
          {/* Left Column: FAQ Search & Accordions (col-span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-[#e5e7eb] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-gray-50 text-gray-655 border border-gray-150 rounded-xl flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base leading-tight">Instant FAQs</h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Search quick answers to standard relocation inquiries</p>
                </div>
              </div>

              {/* FAQ Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search FAQs (e.g. anmelden, credits, driver)..."
                  value={faqSearch}
                  onChange={(e) => {
                    setFaqSearch(e.target.value);
                    setExpandedFaq(null);
                  }}
                  className="w-full h-11 pl-11 pr-4 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#0f4c3a] focus:ring-2 focus:ring-[#0f4c3a]/20 transition-all"
                />
              </div>

              {/* Accordions */}
              <div className="space-y-3 pr-1">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, idx) => {
                    const isExpanded = expandedFaq === idx;
                    return (
                      <div 
                        key={idx} 
                        className="border border-gray-100 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all duration-300 hover:border-gray-200"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                          className="w-full p-4 flex items-center justify-between gap-3 text-left bg-gray-50/30 hover:bg-gray-50/80 transition-colors cursor-pointer select-none border-0"
                        >
                          <span className="text-xs sm:text-sm font-extrabold text-gray-800 leading-snug">{faq.q}</span>
                          <div className="text-gray-400 shrink-0">
                            {isExpanded ? <ChevronUp size={16} className="text-[#0f4c3a]" /> : <ChevronDown size={16} />}
                          </div>
                        </button>
                        
                        {isExpanded && (
                          <div className="p-4 border-t border-gray-100 bg-white text-xs sm:text-sm font-medium text-gray-550 leading-relaxed animate-in slide-in-from-top-2 duration-200 whitespace-pre-line">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-gray-400 font-bold italic text-xs">
                    No FAQs match your search query. Try another term.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: CTA Widget & Compact Support History (col-span 1) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Call-to-Action for Ticket submission */}
            <div className="bg-emerald-50/20 border border-emerald-100/30 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="w-10 h-10 bg-[#0f4c3a]/10 text-[#0f4c3a] border border-[#0f4c3a]/15 rounded-xl flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-950 text-base leading-tight">Need Direct Help?</h3>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed mt-1">
                  If your question isn't in our FAQs, raise a priority corporate support ticket.
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => { setShowTicketForm(true); }}
                className="w-full h-11 bg-[#0f4c3a] hover:bg-[#0a3120] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-emerald-950/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                Raise a Support Ticket
              </button>
            </div>

            {/* Ticket history panel */}
            <div className="bg-white rounded-3xl border border-[#e5e7eb] overflow-hidden shadow-sm">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Recent Tickets</h3>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Corporate support history</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-gray-150 text-gray-600 text-[8px] font-black uppercase tracking-wider border border-gray-200">
                  {tickets.length}
                </span>
              </div>
              
              <div className="divide-y divide-gray-50">
                {tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <div key={ticket.id} className="p-4.5 hover:bg-gray-50/20 transition-colors flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[8px] font-black text-gray-450 tracking-wider uppercase bg-gray-50 border border-gray-150 px-1 py-0.5 rounded">
                          {ticket.id}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase border select-none shrink-0 ${
                            ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-705 border-emerald-100/60' : 'bg-blue-50 text-blue-700 border-blue-100/60'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-xs truncate">{ticket.subject}</h4>
                        <p className="text-[9px] text-gray-405 mt-1 font-semibold">{ticket.date} • {ticket.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-400 font-bold italic text-xs">
                    No support tickets raised yet.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
