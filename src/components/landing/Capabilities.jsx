import React from 'react';
import { motion } from 'framer-motion';
import { CalendarRange, Users, Receipt, MessageCircleHeart, LineChart, LayoutDashboard } from 'lucide-react';

const Capabilities = () => {
  const features = [
    {
      icon: <CalendarRange className="w-7 h-7" />,
      title: "Capacity Reservations",
      description: "Reserve housing blocks across cities and properties."
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Employee Management",
      description: "Track employee housing status from invite to move-out."
    },
    {
      icon: <Receipt className="w-7 h-7" />,
      title: "Billing & Payments",
      description: "Receive one consolidated monthly invoice covering all employee housing."
    },
    {
      icon: <MessageCircleHeart className="w-7 h-7" />,
      title: "Messaging & Support",
      description: "Communicate directly with your Arrivio account manager."
    },
    {
      icon: <LineChart className="w-7 h-7" />,
      title: "Reporting & Analytics",
      description: "View occupancy reports, cost breakdowns, and lease expiry forecasts."
    }
  ];

  return (
    <section id="platform" className="py-28 bg-[#f5f5f3] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-[20%] left-[5%] w-72 h-72 bg-[#0f4c3a]/[0.03] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[8%] w-56 h-56 bg-[#D4A017]/[0.03] rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8 bg-gray-300" />
            <span className="text-[11px] font-semibold text-gray-400 tracking-[0.2em] uppercase">Platform Features</span>
            <span className="h-px w-8 bg-gray-300" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
            Everything Managed in{' '}
            <em className="italic font-serif text-[#0f4c3a]">One Platform.</em>
          </h2>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            A comprehensive suite of tools designed to give HR teams full visibility and control over global employee housing.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="relative group h-full"
            >
              <div className="bg-white rounded-2xl p-8 transition-all duration-500 flex flex-col items-center text-center landing-card-hover h-full">
                <div className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center mb-6 text-gray-600 group-hover:bg-[#0f4c3a] group-hover:border-[#0f4c3a] group-hover:text-white transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-2xl font-normal text-gray-900 mb-3">{feature.title}</h3>
                <div className="w-8 h-px bg-gray-300 mb-3" />
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Dashboard Preview- Featured Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="relative group h-full"
          >
            <div className="bg-white rounded-2xl p-8 transition-all duration-500 flex flex-col items-center text-center landing-card-hover h-full">
              <div className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center mb-6 text-gray-600 group-hover:bg-[#0f4c3a] group-hover:border-[#0f4c3a] group-hover:text-white transition-all duration-500">
                <LayoutDashboard className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-gray-900 mb-3">Unified SaaS Dashboard</h3>
              <div className="w-8 h-px bg-gray-300 mb-3" />
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                A powerful, centralized SaaS platform to manage housing and services at scale.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Capabilities;
