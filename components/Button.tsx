
import React from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * NEW_FEATURE: A reusable Button component to standardize button styles across the app.
 * This component abstracts away the repetitive Tailwind CSS classes and provides
 * a clean API for creating buttons with different variants and sizes.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  children,
  className,
  ...props
}) => {

  // Base styles applicable to all buttons
  const baseClasses = 'font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';

  // Styles specific to each variant
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-700 text-gray-300 hover:bg-gray-600',
  };

  // Styles specific to each size
  const sizeClasses = {
    sm: 'px-3 py-1.5 rounded-md text-sm',
    md: 'px-4 py-2 rounded-md text-base',
    lg: 'px-8 py-4 rounded-full text-lg font-semibold shadow-lg',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
