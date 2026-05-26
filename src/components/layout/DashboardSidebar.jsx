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
import greenLogo from '../../assets/greenlogo.png';
import singleGreen from '../../assets/singlegreen.png';

const DashboardSidebar = ({ isCollapsed, toggleSidebar }) => {
    const [financialOpen, setFinancialOpen] = useState(false);

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 transition-all relative group ${isActive
            ? 'bg-[#0f4c3a]/5 text-[#0f4c3a] font-bold border-l-[4px] border-[#0f4c3a]'
            : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50/50 border-l-[4px] border-transparent'
        } ${isCollapsed ? 'justify-center px-0' : ''}`;

    const subNavLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 mt-0.5 transition-all text-xs relative group ${isActive
            ? 'text-[#0f4c3a] font-black bg-[#0f4c3a]/5 border-l-[4px] border-[#0f4c3a]'
            : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50/50 border-l-[4px] border-transparent'
        } ${isCollapsed ? 'justify-center px-0' : ''}`;

    // Helper for Tooltips when collapsed
    const Tooltip = ({ text }) => (
        <div className="absolute left-full ml-3 px-2 py-1 bg-white text-gray-800 text-[10px] font-bold rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none shadow-md border border-gray-200">
            {text}
        </div>
    );

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 h-screen bg-white flex flex-col fixed left-0 top-0 overflow-y-auto overflow-x-hidden z-20 border-r border-[#e5e7eb] select-none`}>

            {/* Header & Logo */}
            <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-2`}>
                <NavLink to="/dashboard" className="flex items-center gap-3 transition-all">
                    {isCollapsed ? (
                        <img src={singleGreen} alt="Arrivio Logo" className="w-8 h-auto object-contain" />
                    ) : (
                        <img src={greenLogo} alt="Arrivio Logo" className="h-9 w-auto object-contain" />
                    )}
                </NavLink>
            </div>

            <nav className={`flex-1 space-y-6 overflow-y-auto overflow-x-hidden scrollbar-hide`}>

                {/* Menu Section */}
                <div>
                    {!isCollapsed && <p className="px-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Menu</p>}
                    <div className="space-y-0.5">
                        <NavLink to="/dashboard" end className={navLinkClass}>
                            <LayoutDashboard className="w-4 h-4 min-w-[16px] stroke-[2.5]" />
                            {!isCollapsed && <span className="text-xs">Dashboard</span>}
                            {isCollapsed && <Tooltip text="Dashboard" />}
                        </NavLink>
                        <NavLink to="/dashboard/properties" className={navLinkClass}>
                            <Building2 className="w-4 h-4 min-w-[16px] stroke-[2.5]" />
                            {!isCollapsed && <span className="text-xs whitespace-nowrap">Properties</span>}
                            {isCollapsed && <Tooltip text="Properties" />}
                        </NavLink>
                        <NavLink to="/dashboard/contracts" className={navLinkClass}>
                            <FileSignature className="w-4 h-4 min-w-[16px] stroke-[2.5]" />
                            {!isCollapsed && <span className="text-xs">Contracts</span>}
                            {isCollapsed && <Tooltip text="Contracts" />}
                        </NavLink>
                        <NavLink to="/dashboard/employees" className={navLinkClass}>
                            <Users className="w-4 h-4 min-w-[16px] stroke-[2.5]" />
                            {!isCollapsed && <span className="text-xs">Employees</span>}
                            {isCollapsed && <Tooltip text="Employees" />}
                        </NavLink>
                        <NavLink to="/dashboard/services" className={navLinkClass}>
                            <Folder className="w-4 h-4 min-w-[16px] stroke-[2.5]" />
                            {!isCollapsed && <span className="text-xs">Services</span>}
                            {isCollapsed && <Tooltip text="Services" />}
                        </NavLink>
                        <NavLink to="/dashboard/team" className={navLinkClass}>
                            <UserCog className="w-4 h-4 min-w-[16px] stroke-[2.5]" />
                            {!isCollapsed && <span className="text-xs">Team</span>}
                            {isCollapsed && <Tooltip text="Team" />}
                        </NavLink>
                    </div>
                </div>

                {/* Financial Section */}
                <div>
                    <button
                        onClick={() => !isCollapsed && setFinancialOpen(!financialOpen)}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-5'} text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 hover:text-gray-800 transition-colors group relative cursor-pointer`}
                    >
                        {!isCollapsed ? (
                            <>
                                <span>Financial</span>
                                {financialOpen ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
                            </>
                        ) : (
                            <div className="w-full flex justify-center border-t border-gray-100 pt-4 mt-2">
                                <Tooltip text="Financial" />
                            </div>
                        )}
                    </button>

                    <div className="space-y-0.5">
                        {(financialOpen || isCollapsed) && (
                            <div className={`${isCollapsed ? 'space-y-0.5' : 'space-y-0.5'}`}>
                                <NavLink to="/dashboard/billing" className={subNavLinkClass}>
                                    <Receipt className="w-3.5 h-3.5 min-w-[14px] stroke-[2.5]" />
                                    {!isCollapsed && <span className="text-xs">Billing</span>}
                                    {isCollapsed && <Tooltip text="Billing" />}
                                </NavLink>
                                <NavLink to="/dashboard/invoices" className={subNavLinkClass}>
                                    <CreditCard className="w-3.5 h-3.5 min-w-[14px] stroke-[2.5]" />
                                    {!isCollapsed && <span className="text-xs">Invoices</span>}
                                    {isCollapsed && <Tooltip text="Invoices" />}
                                </NavLink>
                                <NavLink to="/dashboard/payments" className={subNavLinkClass}>
                                    <Wallet className="w-3.5 h-3.5 min-w-[14px] stroke-[2.5]" />
                                    {!isCollapsed && <span className="text-xs">Payments</span>}
                                    {isCollapsed && <Tooltip text="Payments" />}
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Bottom Section: Support & Collapse Control */}
            <div className="mt-auto p-4 border-t border-gray-100 space-y-1 bg-white">
                <NavLink to="/dashboard/support" className={navLinkClass}>
                    <LifeBuoy className="w-4 h-4 min-w-[16px] stroke-[2.5]" />
                    {!isCollapsed && <span className="text-xs">Support</span>}
                    {isCollapsed && <Tooltip text="Support" />}
                </NavLink>

                <button
                    onClick={toggleSidebar}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-gray-800 hover:bg-gray-50/50 rounded-xl transition-all group relative cursor-pointer ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                    {isCollapsed ? (
                        <>
                            <ChevronRight size={18} className="stroke-[2.5]" />
                            <Tooltip text="Expand" />
                        </>
                    ) : (
                        <>
                            <ChevronLeft size={18} className="stroke-[2.5]" />
                            <span className="text-xs font-bold uppercase tracking-wider">Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
