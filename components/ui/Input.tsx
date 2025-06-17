import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, id, error, className = '', containerClassName = '', labelClassName = '', ...props }) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label htmlFor={id} className={`block text-xs font-medium text-slate-400 mb-1 ${labelClassName}`}>
        {label}
      </label>
      <input
        id={id}
        className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'} rounded-md shadow-sm bg-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 sm:text-sm transition-colors duration-150 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Input;