import React from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ name, label, required, children }: FormFieldProps) {
  const { formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-[#1a1a1a]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ name, className = '', ...props }, ref) => {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string | undefined;

    return (
      <input
        ref={ref}
        {...register(name)}
        {...props}
        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm transition-colors
          focus:outline-none focus:ring-2 focus:ring-offset-1
          ${error 
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100' 
            : 'border-[#1a1a1a]/10 focus:border-[#1a1a1a]/30 focus:ring-[#1a1a1a]/5'
          }
          ${props.disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''}
          ${className}`}
      />
    );
  }
);

Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ name, options, className = '', ...props }, ref) => {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string | undefined;

    return (
      <select
        ref={ref}
        {...register(name)}
        {...props}
        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm transition-colors
          focus:outline-none focus:ring-2 focus:ring-offset-1
          ${error 
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100' 
            : 'border-[#1a1a1a]/10 focus:border-[#1a1a1a]/30 focus:ring-[#1a1a1a]/5'
          }
          ${props.disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''}
          ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ name, className = '', ...props }, ref) => {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string | undefined;

    return (
      <textarea
        ref={ref}
        {...register(name)}
        {...props}
        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm transition-colors
          focus:outline-none focus:ring-2 focus:ring-offset-1 resize-none
          ${error 
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100' 
            : 'border-[#1a1a1a]/10 focus:border-[#1a1a1a]/30 focus:ring-[#1a1a1a]/5'
          }
          ${props.disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''}
          ${className}`}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label: string;
}

export const Checkbox = ({ name, label, ...props }: CheckboxProps) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="flex items-start gap-2">
      <input
        type="checkbox"
        {...register(name)}
        {...props}
        className="mt-1 w-4 h-4 rounded border-[#1a1a1a]/20 text-[#1a1a1a] focus:ring-[#1a1a1a]/20"
      />
      <label className="text-sm text-[#1a1a1a]">{label}</label>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 ml-auto">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className = '', children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-[#1a1a1a] text-white hover:bg-[#333] focus:ring-[#1a1a1a]/30',
      secondary: 'bg-white border border-[#1a1a1a]/10 text-[#1a1a1a] hover:bg-[#f8f9fa] focus:ring-[#1a1a1a]/20',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/30',
      ghost: 'text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:bg-[#f8f9fa] focus:ring-[#1a1a1a]/20',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        {...props}
        disabled={disabled || loading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
