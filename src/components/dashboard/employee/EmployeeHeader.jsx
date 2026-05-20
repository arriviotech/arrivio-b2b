import React from 'react';
import { Search, UserPlus } from 'lucide-react';

const EmployeeHeader = ({ onInviteClick }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your team and department access</p>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1e6f50] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search employees..." 
                        className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e6f50]/20 focus:border-[#1e6f50] transition-all w-64 shadow-sm"
                    />
                </div>
                
                <button 
                    onClick={onInviteClick}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1e6f50] text-white rounded-xl text-sm font-semibold hover:bg-[#165a40] transition-all shadow-lg shadow-[#1e6f50]/20 active:scale-95"
                >
                    <UserPlus size={18} />
                    Invite Employees
                </button>
            </div>
        </div>
    );
};

export default EmployeeHeader;
