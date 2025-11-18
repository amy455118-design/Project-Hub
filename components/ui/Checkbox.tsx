
import React from 'react';
import { CheckIcon } from '../icons';

export const Checkbox = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (checked: boolean) => void }) => (
    <label className="flex items-center space-x-3 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-offset-latte-base dark:peer-focus:ring-offset-mocha-base peer-focus:ring-latte-mauve dark:peer-focus:ring-mocha-mauve ${checked ? 'bg-latte-mauve dark:bg-mocha-mauve border-latte-mauve dark:border-mocha-mauve' : 'bg-latte-surface0 dark:bg-mocha-surface0 border-latte-surface2 dark:border-mocha-surface2'}`}>
            {checked && <CheckIcon className="w-3 h-3 text-white dark:text-mocha-crust" />}
        </div>
        <span className="text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1">{label}</span>
    </label>
);
