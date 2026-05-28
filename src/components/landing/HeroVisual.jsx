import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { Users, Building2, TrendingUp } from 'lucide-react';

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

const stats = [
  { label: 'Active Residents', value: '1,280', icon: <Users size={18} />, trend: '+12%', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  { label: 'Total Properties', value: '450', icon: <Building2 size={18} />, trend: '+24%', iconColor: 'text-[#0f4c3a]', iconBg: 'bg-[#0f4c3a]/8' },
  { label: 'Avg. Occupancy', value: '96%', icon: <TrendingUp size={18} />, trend: '+5%', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
];

const HeroVisual = () => {
  return (
    <div className="w-full bg-[#f8f9fa] p-6 flex flex-col gap-5 select-none">

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3"
          >
            <div className={`w-8 h-8 rounded-lg ${stat.iconBg} flex items-center justify-center ${stat.iconColor} shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-gray-400 mb-1 leading-none">{stat.label}</p>
              <div className="flex items-end gap-2">
                <span className="text-[1.5rem] font-black text-gray-900 leading-none">{stat.value}</span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md mb-0.5">{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-4">
        {/* Area Chart- spans 2 cols */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-bold text-gray-800 text-[13px]">Portfolio Growth</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Capacity over time</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#0f4c3a]" />
              <span className="text-[11px] text-gray-400 font-medium">Capacity</span>
            </div>
          </div>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
                  dy={8}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: '10px',
                    border: 'none',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0f4c3a"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorVal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-800 text-[13px] mb-1">Top Cities</p>
          <p className="text-[11px] text-gray-400 mb-4">By capacity</p>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={({ x, y, payload }) => (
                    <text x={x - 50} y={y} dy={4} textAnchor="start" fontSize={11} fontWeight={500} fill="#6B7280">
                      {payload.value}
                    </text>
                  )}
                  width={62}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    borderRadius: '10px',
                    border: 'none',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" radius={[0, 5, 5, 0]} barSize={11}>
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
