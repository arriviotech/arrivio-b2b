import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import DashboardHome from '../../components/dashboard/DashboardHome';
import DashboardProperties from '../../components/dashboard/DashboardProperties';
import DashboardPropertyDetails from '../../components/dashboard/DashboardPropertyDetails';
import Employee from './Employee';
import Billing from './Billing';
import Invoices from './Invoices';
import Payments from './Payments';
import Contracts from './Contracts';
import Team from './Team';
import Services from './Services';
import Support from './Support';

const Dashboard = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[#f2f2f2] flex font-sans text-gray-900">
            <DashboardSidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} p-8`}>
                <Routes>
                    <Route index element={<DashboardHome />} />
                    <Route path="properties" element={<DashboardProperties />} />
                    <Route path="properties/:id" element={<DashboardPropertyDetails />} />
                    <Route path="contracts" element={<Contracts />} />
                    <Route path="employees" element={<Employee />} />
                    <Route path="services" element={<Services />} />
                    <Route path="team" element={<Team />} />
                    <Route path="billing" element={<Billing />} />
                    <Route path="invoices" element={<Invoices />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="support" element={<Support />} />
                </Routes>
            </main>
        </div>
    );
};

export default Dashboard;
