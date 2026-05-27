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
        <div className="bg-white rounded-2xl border border-[#e5e7eb] hover:border-[#0f4c3a]/20 shadow-sm hover:shadow-lg transition-all duration-300 mb-4 overflow-hidden">
            {/* Header / Accordion Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-gray-50/40 transition-colors group"
            >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-[#0f4c3a] shrink-0 border border-gray-100">
                        <Building2 size={20} className="stroke-[2]" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-base font-sans font-bold text-gray-900 leading-tight truncate">{property.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-450 font-medium">
                            <span>Moved in: {property.moveInDate || 'TBD'}</span>
                            <span className="text-gray-300 font-normal select-none">•</span>
                            <span className="font-bold text-[#0f4c3a]">{progress}% Ready</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                    <div className="hidden sm:block w-44 md:w-56 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#0f4c3a] transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className={`w-8 h-8 rounded-full border border-gray-200/50 flex items-center justify-center bg-gray-50/50 text-gray-400 transition-all duration-300 ${isOpen ? 'rotate-180 text-[#0f4c3a] bg-[#0f4c3a]/5 border-[#0f4c3a]/15 shadow-sm' : 'hover:bg-gray-100 hover:text-gray-600'}`}>
                        <ChevronDown size={15} className="stroke-[2.5]" />
                    </div>
                </div>
            </button>

            {/* Expanded Content */}
            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-8 bg-gray-50/30">
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Onboarding Progress</p>
                        <p className="text-xs font-bold text-[#0f4c3a]">{currentStep} of {steps.length} Milestones</p>
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
                                            <div className={`absolute left-1/2 top-4 w-full h-[2px] -z-0 ${index < currentStep - 1 ? 'bg-[#0f4c3a]' : 'bg-gray-200'
                                                }`} />
                                        )}

                                        {/* Step Circle */}
                                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted
                                                ? 'bg-[#0f4c3a] text-white shadow-md shadow-[#0f4c3a]/10'
                                                : isCurrent
                                                    ? 'bg-white border-[2.5px] border-[#0f4c3a] text-[#0f4c3a] shadow-md shadow-[#0f4c3a]/5 animate-pulse'
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
          border-radius: 10px;
        }
      `}</style>
        </div>
    );
};

export default Status;
