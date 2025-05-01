
import React from 'react';

interface ProgressBarProps {
  currentPage: number;
  totalPages: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentPage, totalPages }) => {
  const progress = (currentPage / totalPages) * 100;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
      <div 
        className="bg-vark-visual h-2.5 rounded-full transition-all duration-300 ease-in-out" 
        style={{ width: `${progress}%` }}
      ></div>
      <p className="text-xs text-gray-500 mt-1 text-right">
        {currentPage} dari {totalPages}
      </p>
    </div>
  );
};

export default ProgressBar;
