import React from 'react';
import AccountLayout from '../../components/layout/AccountLayout';
import { useAuth } from '../../context/AuthContext';
import { Camera, Mail, Lock, ChevronRight } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <AccountLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div>
          <h1 className="text-3xl font-serif text-[#0f4c3a] mb-2 font-medium">Personal Profile</h1>
          <p className="text-gray-500 text-sm">Update your personal information and how we can reach you.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center gap-8 mb-10">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-[#1e2d24] flex items-center justify-center text-white font-bold text-3xl shadow-inner">
                {user?.initial || 'S'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white border border-gray-200 rounded-full shadow-lg hover:bg-gray-50 transition-colors group-hover:scale-110 duration-200">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name || 'User'}</h2>
              <p className="text-sm text-gray-400">Member since March 2026</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 font-medium">@</span>
                </div>
                <input 
                  type="text" 
                  defaultValue={user?.name}
                  className="w-full h-12 pl-10 pr-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:outline-none transition-all duration-200 text-gray-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  defaultValue={user?.type === 'email' ? user?.identifier : 'snapepotterr@gmail.com'}
                  className="w-full h-12 pl-10 pr-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:outline-none transition-all duration-200 text-gray-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sm font-semibold text-gray-400">
                  +91
                </div>
                <input 
                  type="tel" 
                  defaultValue={user?.type === 'mobile' ? user?.identifier : '9999999999'}
                  className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:outline-none transition-all duration-200 text-gray-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Designation</label>
              <input 
                type="text" 
                placeholder="Software Engineer"
                className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:outline-none transition-all duration-200 text-gray-800"
              />
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button className="bg-[#1e2d24] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#15201a] transition-all duration-200 shadow-md shadow-black/10">
              Save Changes
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-sm overflow-hidden">
          <div className="p-6">
            <h3 className="font-bold text-gray-900">Security & Privacy</h3>
          </div>
          
          <button className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group text-left">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors duration-200">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 leading-none">Password</p>
                <p className="text-xs text-gray-400 mt-1">Last changed 4 months ago</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
          </button>
        </div>
      </div>
    </AccountLayout>
  );
};

export default Profile;
