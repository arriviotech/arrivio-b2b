import React from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { Users, Building2, Globe2, TrendingUp } from 'lucide-react';

const occupancyData = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 48 },
  { name: 'Apr', value: 61 },
  { name: 'May', value: 55 },
  { name: 'Jun', value: 67 },
  { name: 'Jul', value: 72 },
];

const cityData = [
  { name: 'Berlin', value: 85, color: '#0f4c3a' },
  { name: 'Munich', value: 65, color: '#186b53' },
  { name: 'Frankfurt', value: 45, color: '#2C3E30' },
  { name: 'Hamburg', value: 35, color: '#D4A017' },
];

const HeroVisual = () => {
  return (
    <div className="w-full h-full bg-[#f8f9fa] p-4 md:p-8 flex flex-col gap-6 select-none">
      {/* Top Stats Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Active Residents', value: '1,280', icon: <Users size={24} />, trend: '+12%', color: 'text-emerald-600', glow: 'shadow-emerald-200/50', bg: 'bg-emerald-50/50' },
          { label: 'Cities Covered', value: '12', icon: <Globe2 size={24} />, trend: '+2', color: 'text-[#0f4c3a]', glow: 'shadow-teal-100/50', bg: 'bg-[#0f4c3a]/5' },
          { label: 'Total Properties', value: '450', icon: <Building2 size={24} />, trend: '+24%', color: 'text-indigo-600', glow: 'shadow-indigo-100/50', bg: 'bg-indigo-50/50' },
          { label: 'Avg. Occupancy', value: '92%', icon: <TrendingUp size={24} />, trend: '+5%', color: 'text-emerald-700', glow: 'shadow-emerald-200/50', bg: 'bg-emerald-50/50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100/80 shadow-sm flex items-center gap-5 hover:shadow-2xl hover:shadow-[#0f4c3a]/5 transition-all duration-500 group hover:-translate-y-1 relative overflow-hidden">
            <div className={`w-14 h-14 rounded-xl ${stat.bg} ${stat.glow} shadow-lg flex items-center justify-center ${stat.color} transition-all duration-700 group-hover:scale-110`}>
              {stat.icon}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400 leading-none">{stat.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</span>
                <div className="flex items-center px-1.5 py-0.5 rounded-lg bg-emerald-50 text-[10px] font-black text-emerald-600 border border-emerald-100/50">
                  {stat.trend}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>



      {/* Charts Grid */}
      <div className="grid md:grid-cols-3 gap-6 flex-grow">
        {/* Main Occupancy Area Chart */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Portfolio Growth</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#0f4c3a]"></div>
                <span className="text-[10px] text-gray-500 font-medium">Capacity</span>
              </div>
            </div>
          </div>
          <div className="flex-grow min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f4c3a" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0f4c3a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0f4c3a"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* City Distribution Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-800 mb-6">Top Cities</h3>
          <div className="flex-grow min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData} layout="vertical" margin={{ left: -20, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#4B5563', fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                  {cityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVisual;
