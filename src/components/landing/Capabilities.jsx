import React from 'react';
import { motion } from 'framer-motion';
import { CalendarRange, Users, Receipt, MessageCircleHeart, LineChart, LayoutDashboard } from 'lucide-react';

const Capabilities = () => {
  const features = [
    {
      icon: <CalendarRange className="w-5 h-5" />,
      title: "Capacity Reservations",
      description: "Reserve housing blocks across cities and properties."
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Employee Management",
      description: "Track employee housing status from invite to move-out."
    },
    {
      icon: <Receipt className="w-5 h-5" />,
      title: "Billing & Payments",
      description: "Receive one consolidated monthly invoice covering all employee housing."
    },
    {
      icon: <MessageCircleHeart className="w-5 h-5" />,
      title: "Messaging & Support",
      description: "Communicate directly with your Arrivio account manager."
    },
    {
      icon: <LineChart className="w-5 h-5" />,
      title: "Reporting & Analytics",
      description: "View occupancy reports, cost breakdowns, and lease expiry forecasts."
    }
  ];

  return (
    <section id="platform" className="py-28 bg-gradient-to-b from-[#f4f7f6] to-white relative overflow-hidden">
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0f4c3a]/15 bg-[#0f4c3a]/[0.04] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0f4c3a]" />
            <span className="text-[11px] font-semibold text-[#0f4c3a] tracking-[0.12em] uppercase">Platform Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything Managed in{' '}
            <span className="bg-gradient-to-r from-[#0f4c3a] to-[#186b53] bg-clip-text text-transparent">One Platform</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
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
              className="group bg-white rounded-3xl p-7 border border-gray-100 transition-all duration-500 flex flex-col items-start landing-card-hover relative overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#0f4c3a]/[0.03] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10 w-full">
                <div className="w-11 h-11 rounded-xl bg-[#f4f7f6] border border-gray-100 flex items-center justify-center mb-5 text-emerald-600 group-hover:bg-[#0f4c3a]/5 group-hover:border-[#0f4c3a]/10 transition-all duration-500 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2.5">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Dashboard Preview — Featured Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="group bg-white rounded-3xl p-7 border border-gray-100 transition-all duration-500 flex flex-col items-start landing-card-hover relative overflow-hidden"
          >
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#0f4c3a]/[0.03] blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 w-full">
              <div className="w-11 h-11 rounded-xl bg-[#f4f7f6] border border-gray-100 flex items-center justify-center mb-5 text-emerald-600 group-hover:bg-[#0f4c3a]/5 group-hover:border-[#0f4c3a]/10 transition-all duration-500 group-hover:scale-110">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2.5">Unified SaaS Dashboard</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
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
