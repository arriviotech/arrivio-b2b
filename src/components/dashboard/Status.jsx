import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
    Key, Palette, Truck, Hammer, ChefHat, Wrench,
    Zap, Wifi, Lightbulb, Brush, ClipboardCheck, Home,
    CheckCircle2, Building2, ChevronDown,
} from 'lucide-react';

// ─── Phase + substep definitions ─────────────────────────────────────────────
const PHASES = [
    {
        id: 'handover',
        label: 'Handover',
        icon: Key,
        color: '#0f4c3a',
        glowColor: 'rgba(15,76,58,0.25)',
        substeps: [
            { id: 'key_handover', label: 'Key Handover', icon: Key },
        ],
    },
    {
        id: 'renovation',
        label: 'Renovation',
        icon: Hammer,
        color: '#1e6f50',
        glowColor: 'rgba(30,111,80,0.22)',
        substeps: [
            { id: 'painting', label: 'Painting', icon: Palette },
            { id: 'kitchen_construction', label: 'Kitchen Construction', icon: Hammer },
            { id: 'kitchen_installation', label: 'Kitchen Installation', icon: ChefHat },
        ],
    },
    {
        id: 'furnishing',
        label: 'Furnishing',
        icon: Wrench,
        color: '#2d8f68',
        glowColor: 'rgba(45,143,104,0.20)',
        substeps: [
            { id: 'kitchen_delivery', label: 'Kitchen Delivery', icon: Truck },
            { id: 'furniture_delivery', label: 'Furniture Delivery', icon: Truck },
            { id: 'furniture_assembly', label: 'Furniture Assembly', icon: Wrench },
        ],
    },
    {
        id: 'utilities',
        label: 'Utilities',
        icon: Zap,
        color: '#3aaf82',
        glowColor: 'rgba(58,175,130,0.18)',
        substeps: [
            { id: 'gas_electricity', label: 'Gas & Electricity', icon: Zap },
            { id: 'internet_registration', label: 'Internet Registration', icon: Wifi },
            { id: 'lighting_setup', label: 'Lighting Setup', icon: Lightbulb },
        ],
    },
    {
        id: 'finalcheck',
        label: 'Final Check',
        icon: ClipboardCheck,
        color: '#4bcf9e',
        glowColor: 'rgba(75,207,158,0.16)',
        substeps: [
            { id: 'cleaning', label: 'Cleaning', icon: Brush },
            { id: 'final_inspection', label: 'Final Inspection', icon: ClipboardCheck },
            { id: 'move_in', label: 'Move-In', icon: Home },
        ],
    },
];

const ALL_SUBSTEPS = PHASES.flatMap(p => p.substeps);
const TOTAL = ALL_SUBSTEPS.length;

// ─── Sub-step chip ────────────────────────────────────────────────────────────
const SubStepChip = ({ substep, status, phaseColor, delay }) => {
    const [visible, setVisible] = useState(false);
    const isCompleted = status === 'done';
    const isCurrent = status === 'active';
    const Icon = substep.icon;

    // Trigger enter animation on mount
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    return (
        <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border shadow-md whitespace-nowrap"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
                transition: 'opacity 0.28s cubic-bezier(.4,0,.2,1), transform 0.32s cubic-bezier(.34,1.48,.64,1)',
                borderColor: isCompleted ? `${phaseColor}40` : isCurrent ? `${phaseColor}80` : '#e5e7eb',
                background: isCompleted ? '#f0fdf8' : isCurrent ? '#f5fdf9' : 'white',
                minWidth: '200px',
            }}
        >
            {/* Icon bubble */}
            <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{
                    background: isCompleted ? phaseColor : isCurrent ? '#d1fae5' : '#f3f4f6',
                    color: isCompleted ? 'white' : isCurrent ? phaseColor : '#c4c9d4',
                }}
            >
                {isCompleted
                    ? <CheckCircle2 size={10} strokeWidth={3} />
                    : <Icon size={10} strokeWidth={2.5} />}
            </div>

            {/* Label */}
            <span
                className="text-[10px] font-bold tracking-wide flex-1"
                style={{ color: isCompleted || isCurrent ? '#374151' : '#c4c9d4' }}
            >
                {substep.label}
            </span>

            {/* Status badge */}
            {isCompleted ? (
                <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: phaseColor }}>
                    Done
                </span>
            ) : isCurrent ? (
                <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: phaseColor }} />
                    <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: phaseColor }}>Active</span>
                </span>
            ) : (
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-300">Pending</span>
            )}
        </div>
    );
};

// ─── Floating chip portal ─────────────────────────────────────────────────────
const ChipPortal = ({ phase, substepStatuses, anchorRect, popupRef }) => {
    if (!anchorRect) return null;

    // Position: centered above the anchor button, fixed to viewport
    const style = {
        position: 'fixed',
        top: anchorRect.top - 10,
        left: anchorRect.left + anchorRect.width / 2,
        transform: 'translateX(-50%) translateY(-100%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '6px',
        alignItems: 'stretch',
        // pointer arrow via pseudo- we'll do a triangle via box
    };

    return ReactDOM.createPortal(
        <div ref={popupRef} style={style}>
            {phase.substeps.map((sub, i) => (
                <SubStepChip
                    key={sub.id}
                    substep={sub}
                    status={substepStatuses[sub.id] || 'pending'}
                    phaseColor={phase.color}
                    delay={i * 60}
                />
            ))}
            {/* Downward arrow pointing at the phase node */}
            <div style={{
                alignSelf: 'center',
                width: 0,
                height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: `7px solid ${phase.color}22`,
                marginTop: '-3px',
                order: -1,
            }} />
        </div>,
        document.body
    );
};

// ─── Phase Node ───────────────────────────────────────────────────────────────
const PhaseNode = ({ phase, substepStatuses, isActive, onToggle, isLast, buttonRef }) => {
    const Icon = phase.icon;
    const statuses = phase.substeps.map(s => substepStatuses[s.id] || 'pending');
    const allDone = statuses.every(s => s === 'done');
    const anyActive = statuses.some(s => s === 'active');
    const anyStarted = statuses.some(s => s === 'done' || s === 'active');
    const doneCount = statuses.filter(s => s === 'done').length;

    return (
        <div className="flex-1 flex flex-col items-center relative" style={{ minWidth: 0 }}>

            {/* Connector line (right half) */}
            {!isLast && (
                <div
                    className="absolute top-[22px] left-1/2 w-full h-[2px] -z-0 transition-all duration-700"
                    style={{ background: anyStarted ? phase.color : '#e5e7eb' }}
                />
            )}

            {/* Main phase circle + label */}
            <button
                ref={buttonRef}
                onClick={onToggle}
                className="relative z-10 flex flex-col items-center gap-2 outline-none focus:outline-none"
            >
                <div
                    className="relative w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
                    style={{
                        background: allDone
                            ? phase.color
                            : anyActive ? 'white'
                                : anyStarted ? `${phase.color}18`
                                    : 'white',
                        border: allDone
                            ? `2.5px solid ${phase.color}`
                            : anyActive ? `2.5px solid ${phase.color}`
                                : anyStarted ? `2px solid ${phase.color}50`
                                    : '2px solid #e5e7eb',
                        color: allDone
                            ? 'white'
                            : anyActive || anyStarted ? phase.color
                                : '#d1d5db',
                        boxShadow: isActive
                            ? `0 0 0 6px ${phase.glowColor}, 0 4px 16px ${phase.glowColor}`
                            : allDone ? `0 2px 10px ${phase.glowColor}` : 'none',
                        transform: isActive ? 'scale(1.12)' : 'scale(1)',
                        transition: 'all 0.28s cubic-bezier(.34,1.48,.64,1)',
                    }}
                >
                    {allDone
                        ? <CheckCircle2 size={18} strokeWidth={2.5} />
                        : <Icon size={18} strokeWidth={2} />}

                    {anyActive && (
                        <span
                            className="absolute inset-0 rounded-full animate-ping opacity-20"
                            style={{ background: phase.color }}
                        />
                    )}
                </div>

                <span
                    className="text-[10px] font-black uppercase tracking-widest text-center leading-tight"
                    style={{ color: anyStarted ? phase.color : '#9ca3af', letterSpacing: '0.08em', transition: 'color 0.3s' }}
                >
                    {phase.label}
                </span>

                <span className="text-[9px] font-semibold" style={{ color: anyStarted ? phase.color : '#c4c9d4' }}>
                    {doneCount}/{phase.substeps.length}
                </span>
            </button>
        </div>
    );
};

// ─── Main Status Component ────────────────────────────────────────────────────
const Status = ({ property }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activePhase, setActivePhase] = useState(null);
    const [anchorRect, setAnchorRect] = useState(null);

    // One ref per phase button, keyed by phase id
    const buttonRefs = useRef({});
    const popupRef = useRef(null);

    const substepStatuses = property.substepStatuses || {};
    const doneCount = ALL_SUBSTEPS.filter(s => substepStatuses[s.id] === 'done').length;
    const activeCount = ALL_SUBSTEPS.filter(s => substepStatuses[s.id] === 'active').length;
    const progress = Math.round((doneCount / TOTAL) * 100);

    const togglePhase = (phaseId) => {
        if (activePhase === phaseId) {
            // Close
            setActivePhase(null);
            setAnchorRect(null);
        } else {
            // Open- capture the button's viewport rect for portal positioning
            const btn = buttonRefs.current[phaseId];
            if (btn) setAnchorRect(btn.getBoundingClientRect());
            setActivePhase(phaseId);
        }
    };

    // Close when accordion collapses
    useEffect(() => {
        if (!isOpen) { setActivePhase(null); setAnchorRect(null); }
    }, [isOpen]);

    // Click-outside: close if click is outside both the popup and the button
    useEffect(() => {
        if (!activePhase) return;
        const handleMouseDown = (e) => {
            const insidePopup = popupRef.current?.contains(e.target);
            const insideBtn = buttonRefs.current[activePhase]?.contains(e.target);
            if (!insidePopup && !insideBtn) {
                setActivePhase(null);
                setAnchorRect(null);
            }
        };
        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, [activePhase]);

    // Close on scroll (anchor moves, popup would drift)
    useEffect(() => {
        if (!activePhase) return;
        const handleScroll = () => { setActivePhase(null); setAnchorRect(null); };
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [activePhase]);

    const activePhaseData = PHASES.find(p => p.id === activePhase);

    return (
        <div className="bg-white rounded-2xl border border-[#e5e7eb] hover:border-[#0f4c3a]/20 shadow-sm hover:shadow-lg transition-all duration-300 mb-4">

            {/* ── Portal chip popup (renders into document.body) ── */}
            {activePhaseData && (
                <ChipPortal
                    phase={activePhaseData}
                    substepStatuses={substepStatuses}
                    anchorRect={anchorRect}
                    popupRef={popupRef}
                />
            )}

            {/* ── Accordion header ── */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-gray-50/40 transition-colors rounded-2xl"
            >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-[#0f4c3a] shrink-0 border border-gray-100">
                        <Building2 size={20} className="stroke-[2]" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-base font-sans font-bold text-gray-900 leading-tight truncate">{property.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 font-medium">
                            <span>Moved in: {property.moveInDate || 'TBD'}</span>
                            <span className="text-gray-300 select-none">•</span>
                            <span className="font-bold text-[#0f4c3a]">{progress}% Ready</span>
                            {activeCount > 0 && (
                                <>
                                    <span className="text-gray-300 select-none">•</span>
                                    <span className="flex items-center gap-1 font-bold text-emerald-600">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        {activeCount} in progress
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                    <div className="hidden sm:block w-44 md:w-56 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #0f4c3a, #3aaf82)' }}
                        />
                    </div>
                    <div className={`w-8 h-8 rounded-full border border-gray-200/50 flex items-center justify-center bg-gray-50/50 text-gray-400 transition-all duration-300 ${isOpen ? 'rotate-180 text-[#0f4c3a] bg-[#0f4c3a]/5 border-[#0f4c3a]/15 shadow-sm' : 'hover:bg-gray-100 hover:text-gray-600'}`}>
                        <ChevronDown size={15} className="stroke-[2.5]" />
                    </div>
                </div>
            </button>

            {/* ── Expanded content ── */}
            <div
                className={`${isOpen ? 'opacity-100 border-t border-gray-100' : 'opacity-0 overflow-hidden pointer-events-none'}`}
                style={{
                    maxHeight: isOpen ? '400px' : '0px',
                    transition: 'max-height 0.5s cubic-bezier(.4,0,.2,1), opacity 0.4s ease',
                }}
            >
                <div className="px-8 pt-6 pb-10 bg-gray-50/30">

                    {/* Header row */}
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Onboarding Progress</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Click a phase to see its tasks</p>
                        </div>
                        <p className="text-xs font-bold text-[#0f4c3a]">{doneCount} of {TOTAL} Milestones done</p>
                    </div>

                    {/* Phase nodes track */}
                    <div className="relative flex items-start px-4" style={{ paddingTop: '8px', minHeight: '120px' }}>
                        {/* Base connector line */}
                        <div className="absolute left-4 right-4 top-[30px] h-[2px] bg-gray-100 z-0" />

                        {PHASES.map((phase, idx) => (
                            <PhaseNode
                                key={phase.id}
                                phase={phase}
                                substepStatuses={substepStatuses}
                                isActive={activePhase === phase.id}
                                onToggle={() => {
                                    const btn = buttonRefs.current[phase.id];
                                    if (activePhase === phase.id) {
                                        setActivePhase(null);
                                        setAnchorRect(null);
                                    } else {
                                        if (btn) setAnchorRect(btn.getBoundingClientRect());
                                        setActivePhase(phase.id);
                                    }
                                }}
                                isLast={idx === PHASES.length - 1}
                                buttonRef={el => { buttonRefs.current[phase.id] = el; }}
                            />
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-5 mt-4 justify-center">
                        {[
                            { label: 'Completed', bg: '#0f4c3a', pulse: false },
                            { label: 'In Progress', bg: '#1e6f50', pulse: true },
                            { label: 'Pending', bg: '#e5e7eb', pulse: false },
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${item.pulse ? 'animate-pulse' : ''}`} style={{ background: item.bg }} />
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Status;
