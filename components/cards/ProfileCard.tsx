
import React from 'react';
import { Profile } from '../../types';
import { LayersIcon, EditIcon, TrashIcon, ExternalLinkIcon } from '../icons';

interface ProfileCardProps {
    profile: Profile;
    t: any;
    onEdit?: (p: Profile) => void;
    onDelete?: (p: Profile) => void;
    getStatusColor: (status: string) => string;
    getRoleColor: (role: string) => string;
    selectionControl?: React.ReactNode;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, t, onEdit, onDelete, getStatusColor, getRoleColor, selectionControl }) => {
    return (
        <div className="bg-latte-crust dark:bg-mocha-crust border border-latte-surface1 dark:border-mocha-surface1 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col h-full group">
            
            {selectionControl && (
                <div className="absolute top-5 left-5 z-10">
                    {selectionControl}
                </div>
            )}

            <div className={`flex justify-between items-start mb-3 ${selectionControl ? 'pl-8' : ''}`}>
                <h3 className="text-lg font-bold text-latte-text dark:text-mocha-text truncate pr-2 flex-1" title={profile.name}>
                    {profile.name}
                </h3>
                <div className="flex space-x-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {profile.driveLink && (
                        <a href={profile.driveLink} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-green dark:text-mocha-green" aria-label="Drive">
                            <ExternalLinkIcon className="w-4 h-4" />
                        </a>
                    )}
                    {onEdit && (
                        <button onClick={() => onEdit(profile)} className="p-1.5 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue">
                            <EditIcon className="w-4 h-4" />
                        </button>
                    )}
                    {onDelete && (
                        <button onClick={() => onDelete(profile)} className="p-1.5 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-red dark:text-mocha-red">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className={`flex flex-wrap gap-2 mb-4 ${selectionControl ? 'pl-8' : ''}`}>
                <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${getStatusColor(profile.status)}`}>
                    {t[`status${profile.status.replace(/\s/g, '')}`] || profile.status}
                </span>
                <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${getRoleColor(profile.role)}`}>
                    {t[`role${profile.role}`] || profile.role}
                </span>
            </div>

            <div className="mt-auto border-t border-latte-surface1 dark:border-mocha-surface1 pt-3 flex items-center justify-between text-sm text-latte-subtext1 dark:text-mocha-subtext1">
                <div className="flex items-center space-x-2" title="Linked Pages">
                    <LayersIcon className="w-4 h-4" />
                    <span>{profile.pageIds?.length || 0} {t('pages')}</span>
                </div>
                <div className="text-xs">
                    {profile.supplier || 'No Supplier'}
                </div>
            </div>
        </div>
    );
};
