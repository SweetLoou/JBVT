import React from 'react';

interface RadioOption {
  value: string | number | boolean;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue: string | number | boolean | null;
  onChange: (value: string | number | boolean) => void;
  name: string;
  legend: string;
  error?: string;
  inline?: boolean;
  disabled?: boolean;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, selectedValue, onChange, name, legend, error, inline = false, disabled = false }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number | boolean = event.target.value;
    const originalOption = options.find(opt => opt.value.toString() === event.target.value);
    if (originalOption) { 
        if (typeof originalOption.value === 'boolean') {
        value = event.target.value === 'true';
        } else if (typeof originalOption.value === 'number') {
        value = Number(event.target.value);
        }
    }
    onChange(value);
  };
  
  return (
    <fieldset className={`mb-4 ${disabled ? 'opacity-60' : ''}`} role="radiogroup" aria-labelledby={`${name}-legend`}>
      <legend id={`${name}-legend`} className="block text-xs font-medium text-slate-400 mb-1.5">{legend}</legend>
      <div className={`mt-1 ${inline ? 'flex flex-wrap items-center gap-x-5 gap-y-1.5' : 'space-y-2'}`}>
        {options.map((option) => (
          <div key={option.value.toString()} className="flex items-start">
            <input
              id={`${name}-${option.value.toString()}`}
              name={name}
              type="radio"
              value={option.value.toString()}
              checked={selectedValue === option.value}
              onChange={handleChange}
              disabled={disabled}
              className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-500 bg-slate-700 border-slate-500 focus:ring-emerald-500 focus:ring-1 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-500 checked:bg-emerald-500"
              aria-describedby={option.description ? `${name}-${option.value.toString()}-description` : undefined}
            />
            <div className="ml-2">
              <label htmlFor={`${name}-${option.value.toString()}`} className={`block text-sm text-slate-300 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                {option.label}
              </label>
              {option.description && (
                <p id={`${name}-${option.value.toString()}-description`} className="text-xs text-slate-400">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-400" role="alert">{error}</p>}
    </fieldset>
  );
};

export default RadioGroup;