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
            className="bg-[#f4f7f6] py-12 md:py-20 px-6 md:px-12 relative"
        >
            <div className="max-w-6xl mx-auto">
                <div className="bg-[#F5F5F0]/60 backdrop-blur-md rounded-3xl p-6 md:p-10 lg:p-16 border border-white/60 shadow-xl min-h-[500px] flex flex-col items-center justify-center">

                    {!isUnlocked ? (
                        <div className="text-center animate-in fade-in zoom-in duration-500">
                             <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A] mb-6">
                                <span>Ready to Discuss </span>
                                <span className="italic text-[#2C3E30]">
                                    Next Steps?
                                </span>
                            </h2>
                            <p className="font-sans text-sm md:text-base text-[#5C5C50] max-w-xl mx-auto leading-relaxed mb-10">
                                Schedule a call with our team to discuss partnerships, housing solutions, or how Arrivio can support your organization.
                            </p>
                            <button
                                onClick={handleScheduleClick}
                                className="bg-[#1e6f50] hover:bg-[#185e43] text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto text-lg group"
                            >
                                <Calendar className="w-6 h-6" />
                                Schedule a Meeting
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <div className="w-full animate-in fade-in duration-700">
                            {/* HEADER */}
                            <div className="text-center mb-8 md:mb-12">
                                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A] mb-3 md:mb-4">
                                    <span>Schedule a Meeting with </span>
                                    <span className="italic text-[#2C3E30]">
                                        ARRIVIO
                                    </span>
                                </h2>

                                <p className="font-sans text-sm md:text-base text-[#5C5C50] max-w-2xl mx-auto leading-relaxed">
                                    Book a quick call with our team to discuss partnerships, housing
                                    solutions, or next steps with Arrivio.
                                </p>
                            </div>

                            {/* CAL.COM IFRAME */}
                            <div className="max-w-6xl mx-auto mt-6 md:mt-10 px-0 md:px-4">
                                <iframe
                                    src={iframeUrl}
                                    title="Arrivio Strategy Call"
                                    className="w-full h-[600px] md:h-[700px] lg:h-[750px] rounded-2xl border border-black/10 bg-white shadow-inner"
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
                            className="bg-white rounded-[2.5rem] shadow-2xl max-w-xl w-full overflow-hidden border border-white/20"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8 md:p-12 text-center">
                                <div className="w-20 h-20 bg-[#1e6f50]/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                    <Building2 className="w-10 h-10 text-[#1e6f50]" />
                                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center border-4 border-white">
                                        <Calendar className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                                    Better Convenience <br />
                                    <span className="italic text-[#1e6f50]">Awaits You</span>
                                </h3>
                                
                                <p className="text-gray-600 mb-10 text-lg leading-relaxed font-sans">
                                    You can view properties and then schedule a meeting for better convenience and a more tailored proposal.
                                </p>

                                <div className="flex flex-col gap-4">
                                    <button 
                                        onClick={() => navigate('/properties')}
                                        className="bg-[#1e6f50] hover:bg-[#185e43] text-white py-4 px-8 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                                    >
                                        View Properties
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    
                                    <button 
                                        onClick={() => {
                                            setShowGatedModal(false);
                                            setIsUnlocked(true);
                                        }}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-8 rounded-2xl font-bold transition-all"
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
