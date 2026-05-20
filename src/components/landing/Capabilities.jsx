import React from 'react';
import { CalendarRange, Users, Receipt, MessageCircleHeart, LineChart, LayoutDashboard } from 'lucide-react';

const Capabilities = () => {
  const features = [
    {
      icon: <CalendarRange className="w-5 h-5 text-emerald-600" />,
      title: "Capacity Reservations",
      description: "Reserve housing blocks across cities and properties."
    },
    {
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      title: "Employee Management",
      description: "Track employee housing status from invite to move-out."
    },
    {
      icon: <Receipt className="w-5 h-5 text-emerald-600" />,
      title: "Billing & Payments",
      description: "Receive one consolidated monthly invoice covering all employee housing."
    },
    {
      icon: <MessageCircleHeart className="w-5 h-5 text-emerald-600" />,
      title: "Messaging & Support",
      description: "Communicate directly with your Arrivio account manager."
    },
    {
      icon: <LineChart className="w-5 h-5 text-emerald-600" />,
      title: "Reporting & Analytics",
      description: "View occupancy reports, cost breakdowns, and lease expiry forecasts."
    }
  ];

  return (
    <section id="capabilities" className="py-24 bg-[#f4f7f6]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0f4c3a]/5 border border-[#0f4c3a]/10 mb-6">
            <span className="text-sm font-semibold tracking-wide text-[#0f4c3a] uppercase">Platform Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Everything Managed in One Platform
          </h2>
          <p className="text-lg text-gray-600">
            A comprehensive suite of tools designed to give HR teams full visibility and control over global employee housing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start"
            >
              <div className="w-10 h-10 rounded-lg bg-[#f4f7f6] border border-gray-100 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}

          {/* Dashboard Preview Graphic Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden relative group">
            <div className="relative z-10 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#f4f7f6] border border-gray-100 flex items-center justify-center mb-4">
                <LayoutDashboard className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Unified Dashboard</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Experience the power of a centralized hub.
              </p>
            </div>

            {/* Abstract UI Elements */}
            <div className="space-y-3 relative z-10 translate-y-2 group-hover:-translate-y-2 transition-transform duration-500">
              <div className="h-2 w-3/4 bg-slate-200 rounded-full"></div>
              <div className="h-2 w-1/2 bg-slate-100 rounded-full"></div>
              <div className="h-2 w-full bg-slate-100 rounded-full opacity-60"></div>
            </div>

            {/* Background blur */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-100/40 blur-3xl rounded-full"></div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Capabilities;
