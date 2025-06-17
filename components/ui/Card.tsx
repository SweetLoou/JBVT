import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleClassName?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, titleClassName = '' }) => {
  return (
    <div className={`bg-slate-700/30 rounded-md border border-slate-700/50 ${className}`}>
      {title && (
        <div className={`px-4 py-3 sm:px-5 sm:py-4 border-b border-slate-700/50 ${titleClassName}`}>
          <h3 className="text-md sm:text-lg font-semibold text-emerald-400">{title}</h3>
        </div>
      )}
      <div className={`p-4 sm:p-5`}>
        {children}
      </div>
    </div>
  );
};

export default Card;