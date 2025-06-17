import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  id: string;
  labelClassName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, id, className = '', labelClassName = '', ...props }) => {
  return (
    <div className={`flex items-start ${className}`}>
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 flex-shrink-0 mt-1 rounded bg-slate-700 border-slate-500 text-emerald-500 focus:ring-emerald-500 focus:ring-1 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-150 cursor-pointer checked:bg-emerald-500 checked:border-emerald-500"
        {...props}
      />
      <label htmlFor={id} className={`ml-2.5 block text-sm sm:text-base text-slate-300 select-none cursor-pointer ${labelClassName}`}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;