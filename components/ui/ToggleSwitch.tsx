
import React from 'react';

export const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void; }) => (
    <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-latte-crust dark:focus:ring-offset-mocha-crust focus:ring-latte-mauve dark:focus:ring-mocha-mauve ${checked ? 'bg-latte-green dark:bg-mocha-green' : 'bg-latte-surface2 dark:bg-mocha-surface2'}`}
    >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
        />
    </button>
);
