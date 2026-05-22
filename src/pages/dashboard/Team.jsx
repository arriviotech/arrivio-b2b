import React from 'react';
import { UserPlus, Mail, Shield, Users } from 'lucide-react';

const Team = () => {
    const members = [
        {
            id: 1,
            name: 'You',
            email: 'you@company.com',
            role: 'Owner',
            initial: 'Y',
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[#0f4c3a] mb-2 font-medium">Team</h1>
                    <p className="text-gray-500 text-sm">People from your company who can access this dashboard.</p>
                </div>
                <button className="flex items-center gap-2 bg-[#0f4c3a] hover:bg-[#1A2E22] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-12 px-6 py-3 border-b border-gray-100 bg-gray-50/50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <div className="col-span-5">Member</div>
                    <div className="col-span-4">Email</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-1 text-right">Status</div>
                </div>

                {members.map((m) => (
                    <div key={m.id} className="grid grid-cols-12 items-center px-6 py-4 border-b border-gray-50 last:border-0">
                        <div className="col-span-5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0f4c3a] flex items-center justify-center text-white font-bold text-sm">
                                {m.initial}
                            </div>
                            <span className="font-semibold text-gray-900">{m.name}</span>
                        </div>
                        <div className="col-span-4 flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="w-4 h-4" />
                            {m.email}
                        </div>
                        <div className="col-span-2 flex items-center gap-2 text-sm">
                            <Shield className="w-4 h-4 text-[#0f4c3a]" />
                            <span className="font-medium text-gray-700">{m.role}</span>
                        </div>
                        <div className="col-span-1 text-right">
                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                                Active
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="py-8 px-6 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500">
                    Invite colleagues to help manage your company's housing portfolio.
                </p>
            </div>
        </div>
    );
};

export default Team;
