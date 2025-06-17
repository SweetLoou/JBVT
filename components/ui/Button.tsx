import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean; // For showing a loading state
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  isLoading = false,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-150 ease-in-out uppercase tracking-wide text-xs sm:text-sm disabled:cursor-not-allowed";
  
  let variantStyles = "";
  switch (variant) {
    case 'primary':
      variantStyles = "bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-500 disabled:bg-emerald-700/70 disabled:text-emerald-400/70";
      break;
    case 'secondary':
      variantStyles = "bg-slate-600 hover:bg-slate-500 text-slate-100 focus:ring-slate-500 disabled:bg-slate-700/70 disabled:text-slate-400/70";
      break;
    case 'danger':
      variantStyles = "bg-red-600 hover:bg-red-500 text-white focus:ring-red-500 disabled:bg-red-700/70 disabled:text-red-400/70";
      break;
    case 'link':
      variantStyles = "bg-transparent hover:bg-slate-700/60 text-emerald-400 hover:text-emerald-300 focus:ring-emerald-500 underline-offset-4 hover:underline";
      break;
  }

  let sizeStyles = "";
  switch (size) {
    case 'sm':
      sizeStyles = "px-3 py-1.5";
      break;
    case 'md':
      sizeStyles = "px-5 py-2"; 
      break;
    case 'lg':
      sizeStyles = "px-7 py-2.5 text-sm sm:text-base";
      break;
  }
  
  const widthStyles = fullWidth ? "w-full" : "";
  const loadingStyles = isLoading ? "opacity-70 cursor-wait" : "";


  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${widthStyles} ${loadingStyles} ${className}`}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;