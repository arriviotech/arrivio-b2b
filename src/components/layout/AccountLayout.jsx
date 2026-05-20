import React from 'react';
import Navbar from './Navbar';
import AccountSidebar from './AccountSidebar';
import Footer from './Footer';

const AccountLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#fcfcf9] flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 flex-1 w-full">
        <div className="flex gap-12">
          {/* Left Sidebar */}
          <AccountSidebar />
          
          {/* Right Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountLayout;
