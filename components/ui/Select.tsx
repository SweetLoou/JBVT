import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: SelectOption[];
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  defaultValueText?: string;
}

const Select: React.FC<SelectProps> = ({ 
  label, 
  id, 
  options, 
  error, 
  className = '', 
  containerClassName = '', 
  labelClassName = '',
  defaultValueText = "Select an option",
  ...props 
}) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label htmlFor={id} className={`block text-xs font-medium text-slate-400 mb-1 ${labelClassName}`}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={`appearance-none mt-1 block w-full pl-3 pr-8 py-2 text-base border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'} focus:outline-none focus:ring-1 sm:text-sm rounded-md bg-slate-700 text-slate-100 placeholder-slate-500 transition-colors duration-150 ${className}`}
          {...props}
        >
          <option value="" disabled className="text-slate-500 bg-slate-700">{defaultValueText}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-700 text-slate-100">
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Select;