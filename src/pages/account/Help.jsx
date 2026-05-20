import React, { useState } from 'react';
import AccountLayout from '../../components/layout/AccountLayout';
import { MessageSquare, Send, CheckCircle2, LifeBuoy, Mail, Headset } from 'lucide-react';

const Help = () => {
    const [submitted, setSubmitted] = useState(false);

    // Mock previous tickets
    const [previousTickets] = useState([
        {
            id: 'TK-8492',
            subject: 'Missing capacity for Berlin property',
            status: 'In Progress',
            date: 'Mar 14, 2026',
            time: '10:30 AM'
        },
        {
            id: 'TK-8210',
            subject: 'Payment receipt not generated',
            status: 'Resolved',
            date: 'Mar 10, 2026',
            time: '02:15 PM'
        }
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <AccountLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
                <div>
                    <h1 className="text-3xl font-serif text-[#0f4c3a] mb-2 font-medium">Help & Support</h1>
                    <p className="text-gray-500 text-sm">We're here to help you with any questions or issues.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form and Previous Tickets */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Support Ticket Section */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-[#1e2d24]/5 rounded-xl flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-[#0f4c3a]" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Raise a Support Ticket</h2>
                            </div>

                            {submitted ? (
                                <div className="py-12 text-center space-y-4 animate-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Ticket Sent Successfully!</h3>
                                    <p className="text-sm text-gray-400 max-w-xs mx-auto">
                                        A support specialist will reach out to you within the next 24 hours.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="text-[#1e6f50] font-semibold text-sm hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Subject</label>
                                        <input
                                            type="text"
                                            placeholder="What is this regarding?"
                                            className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:outline-none transition-all duration-200 text-gray-800 font-medium"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Message</label>
                                        <textarea
                                            placeholder="Describe your issue in detail..."
                                            className="w-full min-h-[160px] p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:outline-none transition-all duration-200 text-gray-800 resize-none font-medium text-sm"
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 bg-[#1e2d24] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#15201a] transition-all duration-200 shadow-md shadow-black/10 group"
                                        >
                                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            Send Ticket
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Previously Sent Tickets */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                                <h3 className="font-bold text-gray-900">Previous Support Tickets</h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {previousTickets.map((ticket) => (
                                    <div key={ticket.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ticket.id}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${ticket.status === 'Resolved' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                                                        }`}>
                                                        {ticket.status}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-gray-900">{ticket.subject}</h4>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-gray-700">{ticket.date}</p>
                                                <p className="text-[11px] text-gray-400">{ticket.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Info Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-[#1e2d24] rounded-2xl p-8 text-white shadow-xl shadow-black/10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                    <LifeBuoy className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-xl font-bold text-white">Support</div>
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed mb-6">
                                You have access to our priority 24/7 support line.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <Headset className="w-4 h-4 text-white/80" />
                                    </div>
                                    <span className="text-sm font-medium">1800-ARRIVIO-ELITE</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-white/80" />
                                    </div>
                                    <span className="text-sm font-medium">priority@arrivio.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AccountLayout>
    );
};

export default Help;
