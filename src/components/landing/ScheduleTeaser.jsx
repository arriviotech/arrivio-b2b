import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, CheckCircle2 } from 'lucide-react';

// Marketing-page teaser for the scheduling flow. Replaces the embedded
// Cal.com iframe that used to live on Landing — keeps the page light and
// pushes users into the structured /schedule flow (picker → brief → iframe).
const ScheduleTeaser = () => {
  const navigate = useNavigate();

  return (
    <section
      id="schedule"
      className="bg-[#f4f7f6] py-16 md:py-24 px-6 md:px-12"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-xl border border-white/60 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0f4c3a]/10 text-[#0f4c3a] mb-6">
            <Calendar size={28} strokeWidth={2} />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#111827] leading-tight mb-4">
            Ready to discuss <span className="italic text-[#0f4c3a]">next steps?</span>
          </h2>

          <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
            30-minute discovery call with our team. We&rsquo;ll talk options, pricing, and
            timeline  and answer anything specific to your relocation.
          </p>

          {/* Quick value props */}
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-600 mb-10">
            <li className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#0f4c3a]" />
              No commitment
            </li>
            <li className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#0f4c3a]" />
              Pricing transparency
            </li>
            <li className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#0f4c3a]" />
              Tailored proposal after
            </li>
          </ul>

          <button
            onClick={() => navigate('/schedule')}
            className="inline-flex items-center justify-center gap-2 bg-[#0f4c3a] hover:bg-[#1A2E22] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
          >
            Schedule a call
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-[11px] text-gray-400 mt-5">
            Or browse properties first to build a proposal your call will be tailored to it.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ScheduleTeaser;
