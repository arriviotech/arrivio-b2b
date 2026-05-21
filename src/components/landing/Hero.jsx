import React from 'react';
import { Handshake, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroVisual from './HeroVisual';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative pt-20 lg:pt-24 pb-20 lg:pb-32 overflow-hidden bg-background-neutral">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#0f4c3a]/5 blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-[#186b53]/5 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0f4c3a]/5 border border-[#0f4c3a]/10 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#0f4c3a]"></span>
            <span className="text-sm font-medium text-[#0f4c3a]">The End-to-End Housing Platform</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 max-w-4xl animate-slide-up stagger-1">
            Simplifying <span className="text-[#0f4c3a]">Global Relocation</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl animate-slide-up stagger-2 leading-relaxed">
            Reserve housing capacity in advance, manage employee housing from one dashboard, and replace emails, spreadsheets, and manual coordination with a structured platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-slide-up stagger-3 justify-center">
            <button 
              onClick={() => {
                const element = document.getElementById('schedule');
                element?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="flex items-center justify-center gap-2 bg-[#0f4c3a] hover:bg-[#186b53] text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Handshake size={22} />
              Partner with Arrivio
            </button>
            <button onClick={() => navigate('/properties')} className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-8 py-4 rounded-xl font-medium transition-all shadow-sm">
              View Properties
            </button>
            <a href="/arrivio-b2b-deck.pdf" download="Arrivio_Company_Deck.pdf" className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-8 py-4 rounded-xl font-medium transition-all shadow-sm">
              <Download size={18} className="text-gray-500" />
              Download Company Deck
            </a>
          </div>

          {/* Hero Image / Dashboard Mockup placeholder */}
          <div className="w-full max-w-5xl mx-auto relative animate-slide-up stagger-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#0f4c3a]/20 to-[#186b53]/20 rounded-[2.5rem] blur opacity-30"></div>
            <div className="relative rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl bg-white min-h-[400px] md:min-h-[500px]">
              <HeroVisual />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
