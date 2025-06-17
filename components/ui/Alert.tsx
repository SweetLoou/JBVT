import React from 'react';
import { InfoIcon, WarningIcon, CheckIcon, CrossIcon } from '../../constants';

interface AlertProps {
  type: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

const Alert: React.FC<AlertProps> = ({ type, title, children, className = '', iconClassName }) => {
  let baseBgColor, textColor, borderColor, IconComponent, defaultIconColor;

  switch (type) {
    case 'info':
      baseBgColor = 'bg-sky-900/30'; 
      textColor = 'text-sky-300';
      borderColor = 'border-sky-500';
      IconComponent = InfoIcon;
      defaultIconColor = 'text-sky-400';
      break;
    case 'warning':
      baseBgColor = 'bg-amber-900/30';
      textColor = 'text-amber-300';
      borderColor = 'border-amber-500';
      IconComponent = WarningIcon;
      defaultIconColor = 'text-amber-400';
      break;
    case 'success':
      baseBgColor = 'bg-emerald-900/30';
      textColor = 'text-emerald-300';
      borderColor = 'border-emerald-500';
      IconComponent = CheckIcon;
      defaultIconColor = 'text-emerald-400';
      break;
    case 'error':
      baseBgColor = 'bg-red-900/30';
      textColor = 'text-red-300';
      borderColor = 'border-red-500';
      IconComponent = CrossIcon;
      defaultIconColor = 'text-red-400';
      break;
    default: 
      baseBgColor = 'bg-slate-700/30';
      textColor = 'text-slate-300';
      borderColor = 'border-slate-500';
      IconComponent = InfoIcon;
      defaultIconColor = 'text-slate-400';
  }

  return (
    <div className={`p-3.5 border-l-4 ${borderColor} ${baseBgColor} rounded-r-md ${className}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <IconComponent className={`h-5 w-5 ${iconClassName || defaultIconColor}`} />
        </div>
        <div className="ml-2.5 flex-grow">
          {title && <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>}
          <div className={`text-sm ${textColor} ${title ? 'mt-0.5' : ''}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;