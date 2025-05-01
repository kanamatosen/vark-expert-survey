
import React from 'react';

interface ProgressBarProps {
  currentPage: number;
  totalPages: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentPage, totalPages }) => {
  const progress = (currentPage / totalPages) * 100;
  
  return (
    <div className="w-full mb-6">
      <div className="bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-vark-visual h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2">
        <p className="text-xs text-gray-500">
          Bagian {currentPage} dari {totalPages}
        </p>
        <p className="text-xs text-gray-500">
          Visual → Auditori → Kinestetik
        </p>
      </div>
    </div>
  );
};

export default ProgressBar;
