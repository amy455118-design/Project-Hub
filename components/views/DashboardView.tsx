
import React from 'react';

export const DashboardView = ({ t }: { t: any }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-12 bg-latte-mantle dark:bg-mocha-mantle rounded-2xl shadow-xl border border-latte-surface0 dark:border-mocha-surface0">
                <h1 className="text-4xl font-bold text-latte-mauve dark:text-mocha-mauve mb-4">{t.welcome}</h1>
                <p className="text-lg text-latte-subtext1 dark:text-mocha-subtext1">{t.description}</p>
            </div>
        </div>
    );
};
