
import React from 'react';
import { Page } from '../../types';
import { PageIcon, EditIcon, TrashIcon, ProfileIcon } from '../icons';

interface PageCardProps {
    page: Page;
    t: any;
    onEdit: (p: Page) => void;
    onDelete: (p: Page) => void;
    selectionControl?: React.ReactNode;
}

export const PageCard: React.FC<PageCardProps> = ({ page, t, onEdit, onDelete, selectionControl }) => {
    
    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'OK': return 'bg-latte-green/20 text-latte-green dark:bg-mocha-green/20 dark:text-mocha-green';
            case 'Checkpoint': return 'bg-latte-yellow/20 text-latte-yellow dark:bg-mocha-yellow/20 dark:text-mocha-yellow';
            case 'Restricted': 
            case 'Suspended': return 'bg-latte-red/20 text-latte-red dark:bg-mocha-red/20 dark:text-mocha-red';
            default: return 'bg-latte-surface1 dark:bg-mocha-surface1 text-latte-subtext0 dark:text-mocha-subtext0';
        }
    };

    return (
        <div className="bg-latte-crust dark:bg-mocha-crust border border-latte-surface1 dark:border-mocha-surface1 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col h-full group">
            
            {selectionControl && (
                <div className="absolute top-5 left-5 z-10">
                    {selectionControl}
                </div>
            )}

            <div className={`flex justify-between items-start mb-3 ${selectionControl ? 'pl-8' : ''}`}>
                <div className="flex items-start gap-3 flex-1 overflow-hidden">
                    <div className="p-2 bg-latte-surface0 dark:bg-mocha-surface0 rounded-lg flex-shrink-0">
                        <PageIcon className="w-5 h-5 text-latte-sky dark:text-mocha-sky" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-lg font-bold text-latte-text dark:text-mocha-text truncate" title={page.name}>
                            {page.name}
                        </h3>
                        <p className="text-xs text-latte-subtext0 dark:text-mocha-subtext0 truncate font-mono">
                            {page.facebookId}
                        </p>
                    </div>
                </div>
                
                <div className="flex space-x-1 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(page)} className="p-1.5 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue">
                        <EditIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(page)} className="p-1.5 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-red dark:text-mocha-red">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className={`mb-4 ${selectionControl ? 'pl-8' : ''}`}>
                <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${getStatusColor(page.status)}`}>
                    {page.status || 'Unknown'}
                </span>
            </div>

            <div className="mt-auto border-t border-latte-surface1 dark:border-mocha-surface1 pt-3 flex items-center text-sm text-latte-subtext1 dark:text-mocha-subtext1">
                <ProfileIcon className="w-4 h-4 mr-2 text-latte-teal dark:text-mocha-teal" />
                <span title="Linked Profiles">
                    {t('entityProfile')}: {page.profileIds?.length || 0}
                </span>
            </div>
        </div>
    );
};
