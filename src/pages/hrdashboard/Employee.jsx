import React, { useState } from 'react';
import EmployeeHeader from '../../components/dashboard/employee/EmployeeHeader';
import EmployeeList from '../../components/dashboard/employee/EmployeeList';
import EmployeeInvitations from '../../components/dashboard/employee/EmployeeInvitations';

const Employee = () => {
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    return (
        <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
            <EmployeeHeader onInviteClick={() => setIsInviteOpen(true)} />
            
            <div className="grid grid-cols-1 gap-8">
                {/* Stats Summary could go here if needed later */}
                
                <EmployeeList />
            </div>

            <EmployeeInvitations 
                isOpen={isInviteOpen} 
                onClose={() => setIsInviteOpen(false)} 
            />
        </div>
    );
};

export default Employee;
