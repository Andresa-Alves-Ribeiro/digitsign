import React, { ReactNode } from 'react';
import { UseFormRegister, Path } from 'react-hook-form';

interface FormFieldProps<T extends Record<string, unknown>> {
    label: string;
    name: Path<T>;
    type?: string;
    placeholder?: string;
    icon?: ReactNode;
    error?: string;
    register: UseFormRegister<T>;
}

const FormField = <T extends Record<string, unknown>>({
  label,
  name,
  type = 'text',
  placeholder,
  icon,
  error,
  register
}: FormFieldProps<T>) => {
  const inputId = `field-${name}`;
    
  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          {...register(name)}
          type={type}
          className="w-full p-3 pl-12 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all duration-200 outline-0"
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon || (
            <svg
              className="h-5 w-5 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-testid={type === 'password' ? 'password-icon' : 'default-icon'}
              aria-hidden="true"
            >
              {type === 'password' ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              )}
            </svg>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">{error}</p>
      )}
    </div>
  );
};

export default FormField; 