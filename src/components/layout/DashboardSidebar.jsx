import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Home,
    Building2,
    Users,
    CreditCard,
    Receipt,
    Wallet,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    CircleSlash,
    Folder,
    CheckCircle2
} from 'lucide-react';
import greenLogo from '../../assets/whitelogo.png';
import singleGreen from '../../assets/singlewhite.png';

const DashboardSidebar = ({ isCollapsed, toggleSidebar }) => {
    const [financialOpen, setFinancialOpen] = useState(false);
    const [projectsOpen, setProjectsOpen] = useState(true);

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative group ${isActive
            ? 'bg-white/10 text-white font-medium'
            : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
        } ${isCollapsed ? 'justify-center px-0' : ''}`;

    const subNavLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 mt-1 rounded-lg transition-all text-sm relative group ${isActive
            ? 'text-white font-semibold bg-white/10'
            : 'text-slate-500 hover:text-slate-100 hover:bg-white/5'
        } ${isCollapsed ? 'justify-center px-0' : ''}`;

    // Helper for Tooltips when collapsed
    const Tooltip = ({ text }) => (
        <div className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none shadow-xl border border-white/10">
            {text}
        </div>
    );

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 h-screen bg-[#0a1a12] flex flex-col fixed left-0 top-0 overflow-y-auto overflow-x-hidden z-20 border-r border-white/5`}>

            {/* Header & Logo */}
            <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-2`}>
                <NavLink to="/dashboard" className="flex items-center gap-3 transition-all">
                    {isCollapsed ? (
                        <img src={singleGreen} alt="Arrivio Logo" className="w-8 h-auto object-contain" />
                    ) : (
                        <img src={greenLogo} alt="Arrivio Logo" className="h-10 w-auto object-contain" />
                    )}
                </NavLink>
            </div>

            <nav className={`flex-1 ${isCollapsed ? 'px-3' : 'px-4'} py-2 space-y-6 overflow-y-auto overflow-x-hidden scrollbar-hide`}>

                {/* Menu Section */}
                <div>
                    {!isCollapsed && <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Menu</p>}
                    <div className="space-y-1">
                        <NavLink to="/dashboard" end className={navLinkClass}>
                            <LayoutDashboard className="w-5 h-5 min-w-[20px]" />
                            {!isCollapsed && <span>Dashboard</span>}
                            {isCollapsed && <Tooltip text="Dashboard" />}
                        </NavLink>
                        <NavLink to="/dashboard/properties" className={navLinkClass}>
                            <Building2 className="w-5 h-5 min-w-[20px]" />
                            {!isCollapsed && <span className="whitespace-nowrap">Properties</span>}
                            {isCollapsed && <Tooltip text="Properties" />}
                        </NavLink>
                        <NavLink to="/dashboard/employees" className={navLinkClass}>
                            <Users className="w-5 h-5 min-w-[20px]" />
                            {!isCollapsed && <span>Employees</span>}
                            {isCollapsed && <Tooltip text="Employees" />}
                        </NavLink>
                        <NavLink to="/dashboard/services" className={navLinkClass}>
                            <Folder className="w-5 h-5 min-w-[20px]" />
                            {!isCollapsed && <span>Services</span>}
                            {isCollapsed && <Tooltip text="Services" />}
                        </NavLink>
                    </div>
                </div>

                {/* Financial Section */}
                <div>
                    <button
                        onClick={() => !isCollapsed && setFinancialOpen(!financialOpen)}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-3'} text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 hover:text-slate-300 transition-colors group relative`}
                    >
                        {!isCollapsed ? (
                            <>
                                <span>Financial</span>
                                {financialOpen ? <ChevronUp className="w-3 h-3 text-slate-500" /> : <ChevronDown className="w-3 h-3 text-slate-500" />}
                            </>
                        ) : (
                            <div className="w-full flex justify-center border-t border-white/5 pt-4 mt-2">
                                <Tooltip text="Financial" />
                            </div>
                        )}
                    </button>

                    <div className="space-y-1">
                        {(financialOpen || isCollapsed) && (
                            <div className={`${isCollapsed ? 'space-y-1' : 'pl-2 space-y-1'}`}>
                                <NavLink to="/dashboard/billing" className={subNavLinkClass}>
                                    <Receipt className="w-4 h-4 min-w-[16px]" />
                                    {!isCollapsed && <span>Billing</span>}
                                    {isCollapsed && <Tooltip text="Billing" />}
                                </NavLink>
                                <NavLink to="/dashboard/invoices" className={subNavLinkClass}>
                                    <CreditCard className="w-4 h-4 min-w-[16px]" />
                                    {!isCollapsed && <span>Invoices</span>}
                                    {isCollapsed && <Tooltip text="Invoices" />}
                                </NavLink>
                                <NavLink to="/dashboard/payments" className={subNavLinkClass}>
                                    <Wallet className="w-4 h-4 min-w-[16px]" />
                                    {!isCollapsed && <span>Payments</span>}
                                    {isCollapsed && <Tooltip text="Payments" />}
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Bottom Section: Collapse Control */}
            <div className="mt-auto p-4 border-t border-white/5">
                <button
                    onClick={toggleSidebar}
                    className={`flex items-center gap-3 w-full px-3 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group relative ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                    {isCollapsed ? (
                        <>
                            <ChevronRight size={20} />
                            <Tooltip text="Expand" />
                        </>
                    ) : (
                        <>
                            <ChevronLeft size={20} />
                            <span className="text-sm font-medium">Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
