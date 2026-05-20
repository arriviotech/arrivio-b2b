import React from 'react';
import Schedule from '../components/landing/Schedule';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const MeetingSchedule = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="max-w-7xl mx-auto px-6 pt-6 pb-2 w-full">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-2 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100 w-fit"
                >
                    <ArrowLeft size={20} />
                    Back to Main Menu
                </button>
                
                <Schedule />
            </div>
        </div>
    );
};

export default MeetingSchedule;
