
import React from 'react';
import { CheckIcon, CloseIcon } from '../icons';

export const StatusIndicator = ({ isActive }: { isActive: boolean }) => (
    <div className={`flex items-center justify-center w-6 h-6 rounded-full mx-auto ${isActive ? 'bg-latte-green/20 text-latte-green dark:bg-mocha-green/20 dark:text-mocha-green' : 'bg-latte-red/20 text-latte-red dark:bg-mocha-red/20 dark:text-mocha-red'}`}>
        {isActive
            ? <CheckIcon className="w-3.5 h-3.5" strokeWidth="3" />
            : <CloseIcon className="w-3.5 h-3.5" strokeWidth="3" />}
    </div>
);

export const BooleanIndicator = ({ value }: { value: boolean }) => (
    <div className={`flex items-center justify-center w-6 h-6 rounded-full mx-auto ${value ? 'bg-latte-green/20 text-latte-green dark:bg-mocha-green/20 dark:text-mocha-green' : 'bg-latte-red/20 text-latte-red dark:bg-mocha-red/20 dark:text-mocha-red'}`}>
        {value
            ? <CheckIcon className="w-3.5 h-3.5" strokeWidth="3" />
            : <CloseIcon className="w-3.5 h-3.5" strokeWidth="3" />}
    </div>
);
