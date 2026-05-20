import React from 'react';
import logo1 from '../../assets/logos/logo1.png';
import logo2 from '../../assets/logos/logo2.jpg';

const TrustedBy = () => {
  const logos = [logo1, logo2];

  return (
    <section className="py-24 bg-background-neutral border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Trusted by Growing Teams Worldwide
        </h2>
        <p className="text-lg md:text-xl text-gray-500 mb-16 max-w-2xl mx-auto leading-relaxed">
          Companies rely on Arrivio to guarantee housing availability and manage international relocation at scale.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32">
          {logos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center transition-transform hover:scale-105 duration-300">
              <img src={logo} alt={`Partner ${index + 1}`} className="h-16 md:h-24 lg:h-28 object-contain" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrustedBy;
