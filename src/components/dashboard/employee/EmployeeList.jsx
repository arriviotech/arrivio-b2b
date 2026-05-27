import React, { useState, useMemo } from 'react';
import { MoreHorizontal, Home, MapPin, Mail, Phone, Calendar, Shield, Briefcase, FileText, CheckCircle2, X, User } from 'lucide-react';
import { MOCK_EMPLOYEES } from '../../../data/mockEmployees';

const EmployeeList = ({ searchTerm }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const ITEMS_PER_PAGE = 8;

    // Reset pagination to page 1 when search term changes
    useMemo(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Filter employees based on search
    const filteredEmployees = useMemo(() => {
        const query = (searchTerm || '').trim().toLowerCase();
        if (!query) return MOCK_EMPLOYEES;
        return MOCK_EMPLOYEES.filter(emp => 
            emp.name.toLowerCase().includes(query) ||
            emp.role.toLowerCase().includes(query) ||
            (emp.property || '').toLowerCase().includes(query) ||
            emp.email.toLowerCase().includes(query)
        );
    }, [searchTerm]);

    // Paginate filtered employees
    const totalItems = filteredEmployees.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
    const paginatedEmployees = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredEmployees.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredEmployees, currentPage]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Inactive': return 'bg-gray-50 text-gray-400 border-gray-150';
            default: return 'bg-gray-50 text-gray-400';
        }
    };

    const getAvatarInitials = (name) => {
        return 'E' + name.split(' ')[1];
    };

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50 bg-gray-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Employee / Resident</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Department Link</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Assigned Property</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedEmployees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#0f4c3a]/10 flex items-center justify-center text-[#0f4c3a] font-bold text-sm border border-[#0f4c3a]/10 shrink-0">
                                                {getAvatarInitials(emp.name)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{emp.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{emp.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
                                            <Briefcase size={14} className="text-[#0f4c3a]/75" />
                                            {emp.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-700 font-bold">
                                                <Home size={14} className="text-[#0f4c3a]" />
                                                {emp.property}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 ml-5 font-medium">
                                                Unit {emp.unit}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(emp.status)}`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setSelectedEmployee(emp)}
                                            className="text-xs font-bold text-[#0f4c3a] hover:underline bg-[#0f4c3a]/5 hover:bg-[#0f4c3a]/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {paginatedEmployees.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium">
                                        No employees match your search query.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between flex-wrap gap-3">
                    <p className="text-xs text-gray-500 font-semibold">
                        Showing {Math.min(totalItems, (currentPage - 1) * ITEMS_PER_PAGE + 1)} to {Math.min(totalItems, currentPage * ITEMS_PER_PAGE)} of {totalItems} residents
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-3.5 py-1.5 text-xs font-bold text-gray-500 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                            Previous
                        </button>
                        <span className="text-xs font-bold text-gray-500 px-1">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3.5 py-1.5 text-xs font-bold text-[#0f4c3a] bg-white hover:bg-[#0f4c3a]/5 border border-gray-200 rounded-lg shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* PREMIUM HR INSPECTOR MODAL */}
            {selectedEmployee && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300" onClick={() => setSelectedEmployee(null)} />
                    <div className="relative w-full max-w-[380px] bg-white/95 rounded-[24px] shadow-2xl border border-gray-100 overflow-hidden transform transition-all p-5 animate-in zoom-in-95 duration-200">
                        
                        {/* Absolute Close Button */}
                        <button 
                            onClick={() => setSelectedEmployee(null)}
                            className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-all active:scale-90 cursor-pointer"
                            aria-label="Close"
                        >
                            <X size={14} />
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#0f4c3a] font-extrabold text-sm border border-[#0f4c3a]/10 shrink-0 shadow-inner">
                                {getAvatarInitials(selectedEmployee.name)}
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-base font-bold text-gray-900 tracking-tight leading-snug truncate pr-6">{selectedEmployee.name}</h2>
                                <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#0f4c3a] mt-0.5 truncate">{selectedEmployee.role}</p>
                            </div>
                        </div>

                        {/* Details Sections */}
                        <div className="space-y-3.5">
                            {/* Personal & Corporate Metadata */}
                            <div className="bg-gradient-to-br from-emerald-50/30 to-gray-50/50 border border-emerald-100/30 rounded-xl p-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
                                <div>
                                    <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Corporate Email</span>
                                    <div className="flex items-center gap-1 text-[11px] text-gray-800 font-bold truncate">
                                        <Mail size={11} className="text-[#0f4c3a] shrink-0" />
                                        <span className="truncate">{selectedEmployee.email}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Expat ID Ref</span>
                                    <div className="flex items-center gap-1 text-[11px] text-gray-800 font-bold truncate">
                                        <User size={11} className="text-[#0f4c3a] shrink-0" />
                                        <span>AX-2026-00{selectedEmployee.name.split(' ')[1]}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Check-in / Arrival</span>
                                    <div className="flex items-center gap-1 text-[11px] text-gray-800 font-bold truncate">
                                        <Calendar size={11} className="text-[#0f4c3a] shrink-0" />
                                        <span>{selectedEmployee.arrivingOn}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Status</span>
                                    <div className="mt-0.5">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${getStatusColor(selectedEmployee.status)}`}>
                                            {selectedEmployee.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Staged Housing Details */}
                            <div>
                                <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <Home size={10} className="text-[#0f4c3a]" />
                                    Staged Housing Details
                                </h3>
                                <div className="border border-gray-150 rounded-xl p-2.5 flex items-center justify-between bg-white shadow-sm hover:border-[#0f4c3a]/20 transition-colors">
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-bold text-gray-900 truncate">{selectedEmployee.property}</p>
                                        <p className="text-[9px] text-gray-500 font-medium mt-0.5 truncate">
                                            Unit {selectedEmployee.unit} · {selectedEmployee.property.toLowerCase().includes('residences') ? 'Private Studio' : 'Shared Room'}
                                        </p>
                                    </div>
                                    <div className="shrink-0 ml-2">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold rounded-full border border-emerald-100">
                                            <CheckCircle2 size={9} />
                                            Ready
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Administrative Checklist */}
                            <div>
                                <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <Shield size={10} className="text-[#0f4c3a]" />
                                    Relocation Administrative File
                                </h3>
                                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 text-[10px] shadow-sm">
                                    <div className="px-3 py-2 bg-white flex items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center gap-2 font-semibold text-gray-700">
                                            <FileText size={11} className="text-gray-400" />
                                            Address Registration (Anmeldung)
                                        </div>
                                        <span className="text-[8px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                            Booked
                                        </span>
                                    </div>
                                    <div className="px-3 py-2 bg-white flex items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center gap-2 font-semibold text-gray-700">
                                            <FileText size={11} className="text-gray-400" />
                                            Steuer-ID Tax Number File
                                        </div>
                                        <span className="text-[8px] font-extrabold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                                            Submitted
                                        </span>
                                    </div>
                                    <div className="px-3 py-2 bg-white flex items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center gap-2 font-semibold text-gray-700">
                                            <FileText size={11} className="text-gray-400" />
                                            Health Insurance Verification
                                        </div>
                                        <span className="text-[8px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                            TK Enrolled
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                            <button 
                                onClick={() => setSelectedEmployee(null)}
                                className="w-full py-2 bg-[#0f4c3a] hover:bg-[#0a3120] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-emerald-950/20 active:scale-[0.98] duration-150 cursor-pointer text-center"
                            >
                                Close File
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EmployeeList;
