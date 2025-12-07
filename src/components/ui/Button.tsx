import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: `
      bg-indigo-600 hover:bg-indigo-700 
      text-white 
      dark:bg-indigo-500 dark:hover:bg-indigo-600
    `,
    secondary: `
      bg-gray-100 hover:bg-gray-200 
      text-gray-900 
      dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-100
    `,
    outline: `
      border-2 border-indigo-600 dark:border-indigo-400
      text-indigo-600 dark:text-indigo-400
      hover:bg-indigo-50 dark:hover:bg-indigo-950
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        leftIcon && <span className="w-5 h-5">{leftIcon}</span>
      )}
      {children}
    </button>
  );
}
