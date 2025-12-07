import { forwardRef, type InputHTMLAttributes } from 'react';
import { InputMask } from '@react-input/mask';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  mask?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, mask, className = '', ...props }, ref) => {
    const baseClasses = `
      w-full px-4 py-3 
      bg-white dark:bg-slate-800 
      border border-gray-200 dark:border-slate-600 
      rounded-xl 
      text-gray-900 dark:text-gray-100 
      placeholder-gray-400 dark:placeholder-gray-500
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
      transition-all duration-200
      ${error ? 'border-red-500 dark:border-red-400' : ''}
      ${className}
    `.trim();

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        {mask ? (
          <InputMask
            ref={ref}
            mask={mask}
            replacement={{ _: /\d/ }}
            className={baseClasses}
            {...props}
          />
        ) : (
          <input ref={ref} className={baseClasses} {...props} />
        )}
        {error && (
          <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
