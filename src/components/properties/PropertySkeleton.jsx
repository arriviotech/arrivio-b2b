import React from 'react';

const PropertySkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden animate-pulse h-full flex flex-col">
      {/* Image */}
      <div className="aspect-[16/9] bg-gray-200" />

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />

        {/* Pills */}
        <div className="flex gap-1.5 mb-3">
          <div className="h-5 bg-gray-100 rounded-md w-16" />
          <div className="h-5 bg-gray-100 rounded-md w-14" />
          <div className="h-5 bg-gray-100 rounded-md w-18" />
        </div>

        {/* Metrics */}
        <div className="flex gap-4 mb-4">
          <div className="h-3 bg-gray-100 rounded w-16" />
          <div className="h-3 bg-gray-100 rounded w-14" />
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-[#f2f2f2] flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded w-28" />
          <div className="h-3 bg-gray-100 rounded w-12" />
        </div>
      </div>
    </div>
  );
};

export default PropertySkeleton;
