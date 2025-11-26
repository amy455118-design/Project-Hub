
import React from 'react';
import { CheckIcon } from '../icons';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export const Checkbox = ({ label, checked, onChange, disabled = false }: CheckboxProps) => (
    <label className={`flex items-center space-x-3 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
        <input 
            type="checkbox" 
            checked={checked} 
            onChange={(e) => !disabled && onChange(e.target.checked)} 
            className="sr-only peer" 
            disabled={disabled}
        />
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
            disabled 
                ? (checked ? 'bg-latte-surface2 dark:bg-mocha-surface2 border-latte-surface2 dark:border-mocha-surface2' : 'bg-latte-surface1 dark:bg-mocha-surface1 border-latte-surface2 dark:border-mocha-surface2')
                : (checked ? 'bg-latte-mauve dark:bg-mocha-mauve border-latte-mauve dark:border-mocha-mauve' : 'bg-latte-surface0 dark:bg-mocha-surface0 border-latte-surface2 dark:border-mocha-surface2')
        }`}>
            {checked && <CheckIcon className={`w-3 h-3 ${disabled ? 'text-latte-subtext0 dark:text-mocha-subtext0' : 'text-white dark:text-mocha-crust'}`} />}
        </div>
        <span className="text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1">{label}</span>
    </label>
);
