import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-background-neutral">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <div className="border-l-2 border-[#D4A017] pl-8 mb-16">
            <h1 className="font-serif text-5xl md:text-6xl text-[#1b3d36] leading-tight">
              Privacy Policy.
            </h1>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4A017] mt-4">
              Last Updated: February 2026
            </p>
          </div>

          <div className="font-sans text-gray-600 space-y-12 leading-relaxed text-lg">
            <p className="font-medium text-gray-800 italic">
              At Arrivio, we value your discretion and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information in accordance with the General Data Protection Regulation (GDPR).
            </p>

            <section className="space-y-4">
              <h2 className="font-serif text-2xl text-[#1b3d36] flex items-center gap-4">
                <span className="text-xs font-bold text-[#D4A017] w-6 h-6 rounded-full border border-[#D4A017]/30 flex items-center justify-center font-sans tracking-tighter">01</span>
                Data Collection
              </h2>
              <p>
                We collect personal data that you voluntarily provide to us when you use our website, contact us, or book our services. This may include your name, email address, phone number, and payment information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-2xl text-[#1b3d36] flex items-center gap-4">
                <span className="text-xs font-bold text-[#D4A017] w-6 h-6 rounded-full border border-[#D4A017]/30 flex items-center justify-center font-sans tracking-tighter">02</span>
                Use of Data
              </h2>
              <p>
                Your data is used solely for the purpose of providing our services, processing payments, and communicating with you regarding your bookings or inquiries. We do not sell or share your data with third parties for marketing purposes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-2xl text-[#1b3d36] flex items-center gap-4">
                <span className="text-xs font-bold text-[#D4A017] w-6 h-6 rounded-full border border-[#D4A017]/30 flex items-center justify-center font-sans tracking-tighter">03</span>
                Data Security
              </h2>
              <p>
                We implement robust technical and organizational measures to ensure the security of your data against unauthorized access, loss, or alteration. Our systems are regularly reviewed to maintain the highest standards of protection.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-2xl text-[#1b3d36] flex items-center gap-4">
                <span className="text-xs font-bold text-[#D4A017] w-6 h-6 rounded-full border border-[#D4A017]/30 flex items-center justify-center font-sans tracking-tighter">04</span>
                Your Rights
              </h2>
              <p>
                You have the right to access, correct, or delete your personal data at any time. To exercise these rights, please contact our Data Protection Officer at <span className="text-[#1b3d36] font-bold border-b border-[#1b3d36]/20 cursor-pointer hover:border-[#1b3d36]/50 transition-colors">privacy@arrivio.com</span>.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;


