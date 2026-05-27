import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    Users,
    CreditCard,
    Receipt,
    Wallet,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Folder,
    FileSignature,
    UserCog,
    LifeBuoy
} from 'lucide-react';
import whiteLogo from '../../assets/whitelogo.png';
import singleWhite from '../../assets/singlewhite.png';

const DashboardSidebar = ({ isCollapsed, toggleSidebar }) => {
    const [financialOpen, setFinancialOpen] = useState(false);

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-5 py-3 transition-all relative group text-[13.5px] font-medium leading-none select-none ${isActive
            ? 'bg-white/10 text-white font-bold border-l-[4px] border-white'
            : 'text-emerald-100/70 hover:text-white hover:bg-white/5 border-l-[4px] border-transparent'
        } ${isCollapsed ? 'justify-center px-0' : ''}`;

    const subNavLinkClass = ({ isActive }) =>
        `flex items-center gap-3 pl-8 pr-5 py-2.5 mt-0.5 transition-all text-[12.5px] font-medium leading-none select-none ${isActive
            ? 'text-white font-bold bg-white/10 border-l-[4px] border-white'
            : 'text-emerald-100/60 hover:text-white hover:bg-white/5 border-l-[4px] border-transparent'
        } ${isCollapsed ? 'justify-center px-0' : ''}`;

    // Helper for Tooltips when collapsed
    const Tooltip = ({ text }) => (
        <div className="absolute left-full ml-3 px-2 py-1 bg-white text-gray-800 text-[10px] font-bold rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none shadow-md border border-gray-200">
            {text}
        </div>
    );

    return (
        <aside className={`${isCollapsed ? 'w-20 animate-in fade-in duration-350' : 'w-64'} transition-all duration-300 h-screen bg-gradient-to-b from-[#0f4c3a] to-[#0a2c20] flex flex-col fixed left-0 top-0 overflow-y-auto overflow-x-hidden z-20 select-none shadow-2xl sidebar-scroller`}>
            
            {/* Custom Webkit scrollbar styles to fit green branding */}
            <style dangerouslySetInnerHTML={{__html: `
                .sidebar-scroller::-webkit-scrollbar {
                    width: 4px;
                }
                .sidebar-scroller::-webkit-scrollbar-track {
                    background: transparent;
                }
                .sidebar-scroller::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.12);
                    border-radius: 10px;
                }
                .sidebar-scroller::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.25);
                }
            `}} />

            {/* Header & Logo */}
            <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-2`}>
                <NavLink to="/dashboard" className="flex items-center gap-3 transition-all">
                    {isCollapsed ? (
                        <img src={singleWhite} alt="Arrivio Logo" className="w-8 h-auto object-contain" />
                    ) : (
                        <img src={whiteLogo} alt="Arrivio Logo" className="h-9 w-auto object-contain" />
                    )}
                </NavLink>
            </div>

            <nav className={`flex-1 space-y-5 overflow-y-auto overflow-x-hidden scrollbar-hide sidebar-scroller`}>

                {/* Menu Section */}
                <div>
                    {!isCollapsed && <p className="px-5 text-[10px] font-black text-emerald-200/50 uppercase tracking-[0.25em] mb-2.5">Menu</p>}
                    <div className="space-y-0.5">
                        <NavLink to="/dashboard" end className={navLinkClass}>
                            <LayoutDashboard className="w-4 h-4 min-w-[16px] stroke-[2.25]" />
                            {!isCollapsed && <span>Dashboard</span>}
                            {isCollapsed && <Tooltip text="Dashboard" />}
                        </NavLink>
                        <NavLink to="/dashboard/properties" className={navLinkClass}>
                            <Building2 className="w-4 h-4 min-w-[16px] stroke-[2.25]" />
                            {!isCollapsed && <span className="whitespace-nowrap">Properties</span>}
                            {isCollapsed && <Tooltip text="Properties" />}
                        </NavLink>
                        <NavLink to="/dashboard/contracts" className={navLinkClass}>
                            <FileSignature className="w-4 h-4 min-w-[16px] stroke-[2.25]" />
                            {!isCollapsed && <span>Contracts</span>}
                            {isCollapsed && <Tooltip text="Contracts" />}
                        </NavLink>
                        <NavLink to="/dashboard/employees" className={navLinkClass}>
                            <Users className="w-4 h-4 min-w-[16px] stroke-[2.25]" />
                            {!isCollapsed && <span>Employees</span>}
                            {isCollapsed && <Tooltip text="Employees" />}
                        </NavLink>
                        <NavLink to="/dashboard/services" className={navLinkClass}>
                            <Folder className="w-4 h-4 min-w-[16px] stroke-[2.25]" />
                            {!isCollapsed && <span>Services</span>}
                            {isCollapsed && <Tooltip text="Services" />}
                        </NavLink>
                        <NavLink to="/dashboard/team" className={navLinkClass}>
                            <UserCog className="w-4 h-4 min-w-[16px] stroke-[2.25]" />
                            {!isCollapsed && <span>Team</span>}
                            {isCollapsed && <Tooltip text="Team" />}
                        </NavLink>
                        <NavLink to="/dashboard/support" className={navLinkClass}>
                            <LifeBuoy className="w-4 h-4 min-w-[16px] stroke-[2.25]" />
                            {!isCollapsed && <span>Support</span>}
                            {isCollapsed && <Tooltip text="Support" />}
                        </NavLink>
                    </div>
                </div>

                {/* Financial Section */}
                <div>
                    <button
                        onClick={() => !isCollapsed && setFinancialOpen(!financialOpen)}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-5'} text-[10px] font-black text-emerald-200/50 uppercase tracking-[0.25em] mb-2.5 hover:text-white transition-colors group relative cursor-pointer outline-none`}
                    >
                        {!isCollapsed ? (
                            <>
                                <span>Financial</span>
                                {financialOpen ? <ChevronUp className="w-3 h-3 text-emerald-350" /> : <ChevronDown className="w-3 h-3 text-emerald-350" />}
                            </>
                        ) : (
                            <div className="w-full flex justify-center border-t border-white/5 pt-4 mt-2">
                                <Tooltip text="Financial" />
                            </div>
                        )}
                    </button>

                    <div className="space-y-0.5">
                        {(financialOpen || isCollapsed) && (
                            <div className="space-y-0.5">
                                <NavLink to="/dashboard/billing" className={subNavLinkClass}>
                                    <Receipt className="w-3.5 h-3.5 min-w-[14px] stroke-[2.25]" />
                                    {!isCollapsed && <span>Billing</span>}
                                    {isCollapsed && <Tooltip text="Billing" />}
                                </NavLink>
                                <NavLink to="/dashboard/invoices" className={subNavLinkClass}>
                                    <CreditCard className="w-3.5 h-3.5 min-w-[14px] stroke-[2.25]" />
                                    {!isCollapsed && <span>Invoices</span>}
                                    {isCollapsed && <Tooltip text="Invoices" />}
                                </NavLink>
                                <NavLink to="/dashboard/payments" className={subNavLinkClass}>
                                    <Wallet className="w-3.5 h-3.5 min-w-[14px] stroke-[2.25]" />
                                    {!isCollapsed && <span>Payments</span>}
                                    {isCollapsed && <Tooltip text="Payments" />}
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Bottom Section: Collapse Control only */}
            <div className="mt-auto p-4 border-t border-white/10 bg-[#0a2c20]/50 space-y-1">
                <button
                    onClick={toggleSidebar}
                    className={`flex items-center gap-3 w-full px-5 py-3 text-emerald-100/70 hover:text-white hover:bg-white/5 rounded-xl transition-all group relative cursor-pointer ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                    {isCollapsed ? (
                        <>
                            <ChevronRight size={18} className="stroke-[2.25]" />
                            <Tooltip text="Expand" />
                        </>
                    ) : (
                        <>
                            <ChevronLeft size={18} className="stroke-[2.25]" />
                            <span className="text-xs font-bold uppercase tracking-wider">Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
