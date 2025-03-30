import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { commonStyles } from '@/constants/styles';

interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    error?: string;
    register: UseFormRegister<any>;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    name,
    type = 'text',
    placeholder,
    icon,
    error,
    register
}) => {
    const inputId = `field-${name}`;
    
    return (
        <div>
            <label htmlFor={inputId} className={commonStyles.label}>
                {label}
            </label>
            <div className="relative">
                <input
                    id={inputId}
                    {...register(name)}
                    type={type}
                    className={commonStyles.input}
                    placeholder={placeholder}
                />
                {icon || (
                    <svg
                        className={commonStyles.icon}
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
            {error && (
                <p className={commonStyles.error} role="alert">{error}</p>
            )}
        </div>
    );
};

export default FormField; 