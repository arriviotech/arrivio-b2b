import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReservation } from "../../context/ReservationContext";
import { Building2, Calendar, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Schedule = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { reservations } = useReservation();
    const bookingNotes = location.state?.bookingNotes || "";

    const [showGatedModal, setShowGatedModal] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(!!bookingNotes || reservations.length > 0);

    const handleScheduleClick = () => {
        if (reservations.length === 0 && !bookingNotes) {
            setShowGatedModal(true);
        } else {
            setIsUnlocked(true);
        }
    };

    // Construct the Cal.com URL with prefilled notes if available
    const baseUrl = "https://cal.com/arrivio/strategy-call?theme=light&primaryColor=%231e6f50&hideEventTypeDetails=false&layout=month_view";
    const iframeUrl = bookingNotes
        ? `${baseUrl}&notes=${encodeURIComponent(bookingNotes)}`
        : baseUrl;

    return (
        <section
            id="schedule"
            className="py-16 md:py-24 px-6 md:px-12 relative overflow-hidden bg-[#f4f7f6]"
        >
            {/* Background accents */}
            <div className="absolute top-[10%] right-[10%] w-72 h-72 bg-[#0f4c3a]/[0.03] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[8%] w-56 h-56 bg-[#D4A017]/[0.03] rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 lg:p-16 border border-gray-200/50 shadow-[0_20px_60px_rgba(0,0,0,0.06)] min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">

                    {/* Decorative gradient border effect */}
                    <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-[#0f4c3a]/5 via-transparent to-[#D4A017]/5 pointer-events-none" />

                    {!isUnlocked ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative z-10 w-full"
                        >
                            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                                {/* ── LEFT: Context + trust signals ── */}
                                <div className="flex flex-col justify-center">

                                    {/* Section badge */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0f4c3a]/15 bg-[#0f4c3a]/[0.04] mb-7 self-start">
                                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0f4c3a] opacity-50" />
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0f4c3a]" />
                                        </span>
                                        <span className="text-[11px] font-semibold text-[#0f4c3a] tracking-[0.12em] uppercase">Let's Talk</span>
                                    </div>

                                    <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] text-gray-900 mb-5 leading-tight">
                                        Housing at scale,{' '}
                                        <span className="italic bg-gradient-to-r from-[#0f4c3a] to-[#186b53] bg-clip-text text-transparent">
                                            done right.
                                        </span>
                                    </h2>

                                    <p className="text-gray-500 text-[15px] leading-relaxed mb-10 max-w-md">
                                        From reserving capacity before your employees arrive, to managing their day-to-day housing- Arrivio handles it all. Book a 30-minute strategy call to see how.
                                    </p>

                                    {/* Trust stats */}
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { value: '500+', label: 'Employees Housed' },
                                            { value: '8', label: 'Cities Active' },
                                            { value: '30 min', label: 'Avg. Call' },
                                        ].map((stat) => (
                                            <div key={stat.label} className="bg-[#f4f7f6] rounded-2xl px-4 py-4 border border-gray-100">
                                                <p className="font-bold text-xl text-gray-900 mb-0.5">{stat.value}</p>
                                                <p className="text-[11px] text-gray-400 font-medium leading-tight">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* ── RIGHT: Dark CTA card ── */}
                                <div className="flex flex-col">
                                    <div className="bg-gradient-to-br from-[#0a3328] via-[#0f4c3a] to-[#186b53] rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-[0_24px_64px_rgba(15,76,58,0.3)]">

                                        {/* Decorative rings */}
                                        <div className="absolute -top-14 -right-14 w-52 h-52 rounded-full border border-white/[0.05]" />
                                        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border border-white/[0.05]" />
                                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent pointer-events-none rounded-b-3xl" />
                                        <div className="absolute top-7 right-7 w-2 h-2 rounded-full bg-[#D4A017]" />

                                        <div className="relative z-10">
                                            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-6">
                                                <Calendar className="w-6 h-6 text-white" />
                                            </div>

                                            <h3 className="font-serif text-2xl md:text-3xl text-white mb-3 leading-snug">
                                                Book a Strategy{' '}
                                                <span className="italic text-[#7dd5a8]">Call</span>
                                            </h3>

                                            <p className="text-white/60 text-sm leading-relaxed mb-8">
                                                Speak directly with our team- a focused conversation about your housing needs, no sales scripts.
                                            </p>

                                            {/* What to expect */}
                                            <ul className="space-y-3 mb-8">
                                                {[
                                                    'Tailored housing capacity plan',
                                                    'Live platform walkthrough',
                                                    'Transparent pricing, no surprises',
                                                ].map((item) => (
                                                    <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                                                        <span className="w-4 h-4 rounded-full bg-[#7dd5a8]/20 border border-[#7dd5a8]/40 flex items-center justify-center shrink-0">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#7dd5a8]" />
                                                        </span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>

                                            <button
                                                onClick={handleScheduleClick}
                                                className="w-full bg-white hover:bg-gray-50 text-[#0f4c3a] font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 flex items-center justify-center gap-2.5 group text-[15px]"
                                            >
                                                Schedule a Meeting
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>

                                            <p className="text-center text-white/35 text-[11px] mt-4 font-medium tracking-wide">
                                                Free &nbsp;·&nbsp; 30 minutes &nbsp;·&nbsp; No commitment
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </motion.div>

                    ) : (
                        <div className="w-full relative z-10">
                            {/* HEADER */}
                            <div className="text-center mb-8 md:mb-12">
                                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-3 md:mb-4">
                                    <span>Schedule a Meeting with </span>
                                    <span className="italic bg-gradient-to-r from-[#0f4c3a] to-[#186b53] bg-clip-text text-transparent">
                                        ARRIVIO
                                    </span>
                                </h2>

                                <p className="font-sans text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
                                    Book a quick call with our team to discuss partnerships, housing
                                    solutions, or next steps with Arrivio.
                                </p>
                            </div>

                            {/* CAL.COM IFRAME */}
                            <div className="max-w-6xl mx-auto mt-6 md:mt-10 px-0 md:px-4">
                                <iframe
                                    src={iframeUrl}
                                    title="Arrivio Strategy Call"
                                    className="w-full h-[600px] md:h-[700px] lg:h-[750px] rounded-2xl border border-gray-200/50 bg-white shadow-inner"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Gated Modal Overlay */}
            <AnimatePresence>
                {showGatedModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md"
                        onClick={() => setShowGatedModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.2)] max-w-xl w-full overflow-hidden border border-gray-100"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8 md:p-12 text-center">
                                <div className="w-20 h-20 bg-[#0f4c3a]/8 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                    <Building2 className="w-10 h-10 text-[#0f4c3a]" />
                                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-r from-[#D4A017] to-[#e0ac1a] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                        <Calendar className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                                    Better Convenience <br />
                                    <span className="italic bg-gradient-to-r from-[#0f4c3a] to-[#186b53] bg-clip-text text-transparent">Awaits You</span>
                                </h3>

                                <p className="text-gray-500 mb-10 text-lg leading-relaxed font-sans">
                                    You can view properties and then schedule a meeting for better convenience and a more tailored proposal.
                                </p>

                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() => navigate('/properties')}
                                        className="bg-gradient-to-r from-[#0f4c3a] to-[#186b53] hover:from-[#186b53] hover:to-[#1e8f6e] text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 shadow-[0_10px_30px_rgba(15,76,58,0.2)] hover:shadow-[0_15px_40px_rgba(15,76,58,0.3)] flex items-center justify-center gap-2 group"
                                    >
                                        View Properties
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowGatedModal(false);
                                            setIsUnlocked(true);
                                        }}
                                        className="bg-gray-50 hover:bg-gray-100 text-gray-700 py-3.5 px-8 rounded-2xl font-bold transition-all duration-300 border border-gray-100"
                                    >
                                        Directly Schedule
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Schedule;
