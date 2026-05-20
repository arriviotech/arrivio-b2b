import React, { useState } from 'react';
import {
    Key,
    Palette,
    Truck,
    Hammer,
    ChefHat,
    Wrench,
    Zap,
    Wifi,
    Lightbulb,
    Brush,
    ClipboardCheck,
    Home,
    CheckCircle2,
    ChevronDown,
    Building2,
    Calendar
} from 'lucide-react';

const Status = ({ property }) => {
    const [isOpen, setIsOpen] = useState(false);

    const steps = [
        { label: 'Key Handover', icon: Key },
        { label: 'Painting done', icon: Palette },
        { label: 'Kitchen delivered', icon: Truck },
        { label: 'Kitchen construction started', icon: Hammer },
        { label: 'Kitchen installed', icon: ChefHat },
        { label: 'Furniture delivered', icon: Truck },
        { label: 'Furniture assembled', icon: Wrench },
        { label: 'Gas and electricity registered', icon: Zap },
        { label: 'Internet registered', icon: Wifi },
        { label: 'Lighting installed', icon: Lightbulb },
        { label: 'Cleaning completed', icon: Brush },
        { label: 'Final inspection completed', icon: ClipboardCheck },
        { label: 'Move-in completed', icon: Home },
    ];

    const currentStep = property.onboardingStep || 0;
    const progress = Math.round((currentStep / steps.length) * 100);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-4 overflow-hidden transition-all duration-300 hover:shadow-md">
            {/* Header / Accordion Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left hover:bg-gray-50/50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1e6f50]/10 rounded-2xl flex items-center justify-center text-[#1e6f50] shrink-0">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{property.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                Moved in: {property.moveInDate || 'TBD'}
                            </span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="font-medium text-[#1e6f50]">{progress}% Ready</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto self-end sm:self-center">
                    <div className="hidden lg:block w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#1e6f50] transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className={`p-2 rounded-xl bg-gray-50 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#1e6f50] bg-[#1e6f50]/10' : ''}`}>
                        <ChevronDown size={20} />
                    </div>
                </div>
            </button>

            {/* Expanded Content */}
            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 border-t border-gray-50' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-8 bg-gray-50/30">
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Onboarding Progress</p>
                        <p className="text-sm font-bold text-[#1e6f50]">{currentStep} of {steps.length} Milestones</p>
                    </div>

                    <div className="relative overflow-x-auto pb-4 custom-scrollbar">
                        <div className="flex items-start min-w-[1000px] lg:min-w-0 px-2">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isCompleted = index < currentStep;
                                const isCurrent = index === currentStep;

                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center group relative">
                                        {/* Connector Line */}
                                        {index < steps.length - 1 && (
                                            <div className={`absolute left-1/2 top-4 w-full h-[2px] -z-0 ${index < currentStep - 1 ? 'bg-[#1e6f50]' : 'bg-gray-200'
                                                }`} />
                                        )}

                                        {/* Step Circle */}
                                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted
                                                ? 'bg-[#1e6f50] text-white shadow-lg shadow-[#1e6f50]/20'
                                                : isCurrent
                                                    ? 'bg-white border-[2.5px] border-[#1e6f50] text-[#1e6f50] shadow-xl shadow-[#1e6f50]/10 animate-pulse'
                                                    : 'bg-white border-2 border-gray-100 text-gray-300'
                                            }`}>
                                            <Icon size={14} />
                                        </div>

                                        {/* Label */}
                                        <div className="mt-3 text-center px-1">
                                            <p className={`text-[9px] font-bold uppercase tracking-wider leading-tight transition-colors duration-300 max-w-[75px] mx-auto ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                                                }`}>
                                                {step.label}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8faf9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
        </div>
    );
};

export default Status;
