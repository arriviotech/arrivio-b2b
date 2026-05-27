import React, { useState, useRef } from 'react';
import { Mail, Send, X, AlertCircle, CheckCircle2, Plus, Upload, FileText, Trash2, Link, Copy, Check } from 'lucide-react';

const EmployeeInvitations = ({ isOpen, onClose }) => {
    const [manualEmail, setManualEmail] = useState('');
    const [emailList, setEmailList] = useState([]);
    const [status, setStatus] = useState('idle'); // idle, sending, success
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const [isCopied, setIsCopied] = useState(false);

    const inviteLink = "https://arrivio.com/join/acme-corp-123"; // Mock invite link

    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };

    const handleAddManual = () => {
        if (manualEmail && validateEmail(manualEmail)) {
            if (!emailList.includes(manualEmail.toLowerCase())) {
                setEmailList([...emailList, manualEmail.toLowerCase()]);
            }
            setManualEmail('');
        }
    };

    const handleRemoveEmail = (emailToRemove) => {
        setEmailList(emailList.filter(email => email !== emailToRemove));
    };

    const processFiles = (files) => {
        const csvFiles = Array.from(files).filter(file => file.name.endsWith('.csv') || file.type === 'text/csv');

        csvFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                // Regex to find all email-like strings
                const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
                const matches = text.match(emailRegex) || [];

                const newEmails = matches.map(email => email.toLowerCase()).filter(email => !emailList.includes(email));
                if (newEmails.length > 0) {
                    setEmailList(prev => [...new Set([...prev, ...newEmails])]);
                }
            };
            reader.readAsText(file);
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddManual();
        }
    };

    const handleSend = () => {
        if (emailList.length === 0) return;

        setStatus('sending');
        // Simulate bulk sending
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setEmailList([]);
                setManualEmail('');
            }, 2000);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-5xl rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-[#e5e7eb] flex flex-col md:flex-row h-auto max-h-[90vh]">
                {/* Left Side: Entry & Stuff */}
                <div className="flex-1 p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/30 overflow-y-auto">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-[#0f4c3a] flex items-center justify-center text-white shadow-md shadow-[#0f4c3a]/10">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Invite Residents</h2>
                            <p className="text-sm text-gray-500 font-medium">Add manually or bulk upload directory</p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Manual Entry */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-4 uppercase tracking-[0.2em]">
                                Add One by One
                            </label>
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={manualEmail}
                                        onChange={(e) => setManualEmail(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="resident@example.com"
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-[15px] focus:outline-none focus:ring-4 focus:ring-[#0f4c3a]/10 focus:border-[#0f4c3a] transition-all font-medium shadow-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleAddManual}
                                    disabled={!manualEmail || !validateEmail(manualEmail)}
                                    className="px-6 py-4 bg-[#0f4c3a] text-white rounded-2xl font-bold hover:bg-[#0a3a2b] transition-all shadow-md shadow-[#0f4c3a]/10 disabled:opacity-50 flex items-center gap-2 active:scale-95 cursor-pointer"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* CSV Dropzone */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-4 uppercase tracking-[0.2em]">
                                Bulk Upload Directory
                            </label>
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative cursor-pointer group border-2 border-dashed rounded-[2rem] p-6 transition-all flex flex-col items-center justify-center text-center ${isDragging
                                    ? 'border-[#0f4c3a] bg-[#0f4c3a]/5 ring-8 ring-[#0f4c3a]/5'
                                    : 'border-gray-200 bg-white hover:border-[#0f4c3a]/30 hover:bg-gray-50/50 shadow-sm'
                                    }`}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".csv"
                                    onChange={(e) => processFiles(e.target.files)}
                                />
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${isDragging ? 'bg-[#0f4c3a] text-white scale-110 shadow-xl' : 'bg-gray-100 text-gray-400 group-hover:bg-[#0f4c3a]/10 group-hover:text-[#0f4c3a]'
                                    }`}>
                                    <Upload size={24} />
                                </div>
                                <h4 className="font-bold text-gray-900 text-base">Drop your Excel here</h4>
                                <p className="text-xs text-gray-500 mt-0.5 font-medium">Or click to browse files</p>
                            </div>
                        </div>

                        {/* Invite via Link */}
                        <div className="pt-2 border-t border-gray-100">
                            <label className="block text-xs font-bold text-gray-400 mb-4 uppercase tracking-[0.2em]">
                                Invite via Link
                            </label>
                            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm group hover:border-[#0f4c3a]/30 transition-all">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-10 h-10 rounded-xl bg-[#0f4c3a]/5 flex items-center justify-center text-[#0f4c3a] group-hover:bg-[#0f4c3a]/10 transition-colors">
                                        <Link size={18} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Shareable Link</p>
                                        <p className="text-sm font-medium text-gray-700 truncate">{inviteLink}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCopyLink}
                                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${isCopied
                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                        : 'bg-gray-900 text-white hover:bg-black shadow-md shadow-black/10'
                                        }`}
                                >
                                    {isCopied ? (
                                        <><Check size={14} /> Copied</>
                                    ) : (
                                        <><Copy size={14} /> Copy Link</>
                                    )}
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-3 font-medium flex items-center gap-1.5 ml-1">
                                <AlertCircle size={12} /> Invite the team through this link.
                            </p>
                        </div>

                        {/* Tips */}
                        <div className="p-5 bg-[#0f4c3a]/5 rounded-2xl border border-[#0f4c3a]/10 flex items-start gap-4">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#0f4c3a] border border-[#0f4c3a]/10 shadow-sm shrink-0">
                                <AlertCircle size={18} />
                            </div>
                            <p className="text-sm text-[#0f4c3a] font-medium leading-relaxed">
                                Our system automatically detects valid email addresses from any column. Total unique recipients will be shown on the right.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: List & Send */}
                <div className="w-full md:w-[400px] flex flex-col bg-white">
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-900">Review List</span>
                            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                                {emailList.length}
                            </span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-all cursor-pointer">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col">
                        {status === 'success' ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-500">
                                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 ring-8 ring-emerald-50">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
                                <p className="text-sm text-gray-500 mt-2 font-medium">
                                    Invitations are on their way.
                                </p>
                            </div>
                        ) : emailList.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center text-gray-400">
                                <FileText size={48} strokeWidth={1} className="mb-4 opacity-20" />
                                <p className="text-sm font-medium">No recipients added yet</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-3 custom-scrollbar">
                                    <div className="flex items-center justify-between mb-4 sticky top-0 bg-white/90 backdrop-blur-sm py-2">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Emails</span>
                                        <button
                                            onClick={() => setEmailList([])}
                                            className="text-[10px] font-black text-red-500 hover:text-red-650 uppercase tracking-widest cursor-pointer"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                    {emailList.map((email) => (
                                        <div key={email} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl group hover:border-[#0f4c3a]/20 hover:bg-white transition-all shadow-sm shadow-black/[0.02]">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[#0f4c3a] group-hover:bg-[#0f4c3a]/5 shadow-sm shrink-0">
                                                    <FileText size={14} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-750 truncate">{email}</span>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveEmail(email)}
                                                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0 cursor-pointer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Send Button */}
                                <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                                    <button
                                        onClick={handleSend}
                                        disabled={status === 'sending'}
                                        className={`w-full py-5 rounded-[1.5rem] font-bold text-white transition-all flex items-center justify-center gap-3 text-lg shadow-xl cursor-pointer ${status === 'sending'
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-black hover:bg-[#0f4c3a] shadow-black/10 hover:shadow-[#0f4c3a]/20 active:scale-[0.98]'
                                            }`}
                                    >
                                        {status === 'sending' ? (
                                            <>
                                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={20} />
                                                Send Invitations
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest">
                                        Secure bulk process
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeInvitations;
