"use client"
import React from 'react';

interface LoadingBarProps {
  progress: number;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ progress }) => {
  return (
    <div className="flex flex-col items-center justify-center">
        <img src='/loading.png' className='h-24' alt="Loading" />
      <div className="mt-6 relative w-36 h-4 rounded-full border-2 border-[#FF7A01] overflow-hidden">
        <div 
          className="absolute h-full bg-gradient-to-r from-[#FF7A01] to-[#ED068A] transition-all duration-300" 
          style={{ width: `${progress}%` }}>
        </div>
      </div>
      <div className="mt-4 text-orange-500">Please wait ...</div>
    </div>
  );
};

export default LoadingBar;
