import React from 'react';
import { MoreHorizontal, Home, MapPin } from 'lucide-react';

const EmployeeList = () => {
    const employees = [
        { id: 1, name: 'John Doe', email: 'john@example.com', property: 'Schubert Residences', unit: 'A-101', status: 'Active', avatar: 'JD' },
        { id: 2, name: 'Sarah Wilson', email: 'sarah.w@example.com', property: 'Garden Heights', unit: 'B-204', status: 'Pending', avatar: 'SW' },
        { id: 3, name: 'Michael Chen', email: 'm.chen@example.com', property: 'City Lofts', unit: 'S-302', status: 'Active', avatar: 'MC' },
        { id: 4, name: 'Emma Thompson', email: 'emma.t@example.com', property: 'Riverside Apartments', unit: 'C-005', status: 'Inactive', avatar: 'ET' },
        { id: 5, name: 'Robert Fox', email: 'r.fox@example.com', property: 'Skyline View', unit: 'D-410', status: 'Pending', avatar: 'RF' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Inactive': return 'bg-gray-100 text-gray-500 border-gray-200';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#1e6f50]/10 flex items-center justify-center text-[#1e6f50] font-bold text-sm border border-[#1e6f50]/10">
                                            {emp.avatar}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{emp.name}</p>
                                            <p className="text-xs text-gray-500">{emp.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        Operations HQ
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-700 font-bold">
                                            <Home size={14} className="text-[#1e6f50]" />
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
                                    <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-gray-900 transition-all">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <p className="text-xs text-gray-500 font-medium">Showing {employees.length} residents</p>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30" disabled>Previous</button>
                    <button className="px-3 py-1.5 text-xs font-bold text-gray-900 hover:bg-white rounded-lg shadow-sm transition-all border border-gray-100">Next</button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;
