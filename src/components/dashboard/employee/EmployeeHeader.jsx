import React from 'react';
import { Search, UserPlus } from 'lucide-react';

const EmployeeHeader = ({ onInviteClick, searchTerm, onSearchChange }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-150 pb-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Employees</h1>
                <p className="text-gray-500 text-sm mt-2 font-medium">Manage your team and department access.</p>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#0f4c3a] transition-colors" />
                    <input 
                        type="text" 
                        value={searchTerm || ''}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        placeholder="Search employees..." 
                        className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/20 focus:border-[#0f4c3a] transition-all w-64 shadow-sm font-medium"
                    />
                </div>
                
                <button 
                    onClick={onInviteClick}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0f4c3a] text-white rounded-xl text-sm font-semibold hover:bg-[#0a3a2b] transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                    <UserPlus size={16} />
                    Invite Employees
                </button>
            </div>
        </div>
    );
};

export default EmployeeHeader;
