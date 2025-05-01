
import React, { ReactNode } from 'react';

interface SurveyLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const SurveyLayout: React.FC<SurveyLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl font-bold text-center text-vark-visual mb-2">{title}</h1>
          {subtitle && (
            <p className="text-center text-gray-600 mb-8">{subtitle}</p>
          )}
          {children}
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} VARK Learning Style Expert System
          </p>
        </div>
      </div>
    </div>
  );
};

export default SurveyLayout;
