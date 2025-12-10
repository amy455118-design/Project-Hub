
import React from 'react';
import { Domain, Subdomain } from '../../types';
import { DomainIcon, ExternalLinkIcon, EditIcon, TrashIcon, CheckIcon, CloseIcon } from '../icons';
import { ToggleSwitch } from '../ui/ToggleSwitch';

interface DomainCardProps {
    domain: Domain | (Subdomain & { parentDomain: Domain });
    t: any;
    onEdit: (d: Domain) => void;
    onDelete: (d: Domain) => void;
    onToggleActive: (id: string, active: boolean) => void;
    getCountryName: (code: string) => string;
    getLanguageName: (code: string) => string;
    showPinBadge?: boolean;
    selectionControl?: React.ReactNode;
}

export const DomainCard: React.FC<DomainCardProps> = ({ 
    domain, 
    t, 
    onEdit, 
    onDelete, 
    onToggleActive, 
    getCountryName, 
    getLanguageName,
    showPinBadge = false,
    selectionControl
}) => {
    const isSubdomain = 'parentDomain' in domain;
    const parent = isSubdomain ? (domain as Subdomain & { parentDomain: Domain }).parentDomain : null;
    const realDomain = isSubdomain ? parent! : (domain as Domain);
    
    // For main domains, subdomains count
    const subdomainCount = !isSubdomain ? (domain as Domain).subdomains.length : 0;

    return (
        <div className="bg-latte-crust dark:bg-mocha-crust border border-latte-surface1 dark:border-mocha-surface1 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden group">
            {/* Background Accent for Active/Inactive */}
            <div className={`absolute top-0 left-0 w-1 h-full ${domain.isActive ? 'bg-latte-green dark:bg-mocha-green' : 'bg-latte-surface2 dark:bg-mocha-surface2'}`} />

            {selectionControl && (
                <div className="absolute top-5 left-3 z-10">
                    {selectionControl}
                </div>
            )}

            <div className={`flex justify-between items-start mb-3 pl-3 ${selectionControl ? 'ml-6' : ''}`}>
                <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-lg font-bold text-latte-text dark:text-mocha-text truncate" title={domain.name}>
                        {domain.name}
                    </h3>
                    {isSubdomain && (
                        <p className="text-xs text-latte-subtext0 dark:text-mocha-subtext0 truncate">
                            {t('parentDomain')}: {parent?.name}
                        </p>
                    )}
                </div>
                <div className="flex space-x-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {domain.planningSheetUrl && (
                        <a href={domain.planningSheetUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-green dark:text-mocha-green">
                            <ExternalLinkIcon className="w-4 h-4" />
                        </a>
                    )}
                    <button onClick={() => onEdit(realDomain)} className="p-1.5 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue">
                        <EditIcon className="w-4 h-4" />
                    </button>
                    {!isSubdomain && (
                        <button onClick={() => onDelete(realDomain)} className="p-1.5 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-red dark:text-mocha-red">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className={`pl-3 mb-4 flex flex-wrap gap-2 ${selectionControl ? 'ml-6' : ''}`}>
                {showPinBadge && !isSubdomain && (domain as Domain).hasPin && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-latte-mauve/20 text-latte-mauve dark:bg-mocha-mauve/20 dark:text-mocha-mauve uppercase">
                        PIN
                    </span>
                )}
                {domain.hasPreloader && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-latte-teal/20 text-latte-teal dark:bg-mocha-teal/20 dark:text-mocha-teal uppercase">
                        Preloader
                    </span>
                )}
                {domain.hasOfferwall && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-latte-peach/20 text-latte-peach dark:bg-mocha-peach/20 dark:text-mocha-peach uppercase">
                        Offerwall
                    </span>
                )}
            </div>

            <div className="mt-auto pl-3 border-t border-latte-surface1 dark:border-mocha-surface1 pt-3 space-y-2 text-sm text-latte-subtext1 dark:text-mocha-subtext1">
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 truncate max-w-[70%]">
                        <span className="truncate" title={domain.countries.map(getCountryName).join(', ')}>
                            {domain.countries.length > 3 ? `${domain.countries.slice(0,3).join(', ')}...` : domain.countries.join(', ')}
                        </span>
                        <span className="text-latte-subtext0 dark:text-mocha-subtext0">•</span>
                        <span>{getLanguageName(domain.language).slice(0, 3).toUpperCase()}</span>
                    </span>
                    {!isSubdomain && (
                        <span className="text-xs bg-latte-surface0 dark:bg-mocha-surface0 px-2 py-0.5 rounded text-latte-subtext0 dark:text-mocha-subtext0">
                            📂 {subdomainCount} Subs
                        </span>
                    )}
                </div>
                <div className="flex justify-between items-center pt-1">
                    <span className={`text-xs font-semibold ${domain.isActive ? 'text-latte-green dark:text-mocha-green' : 'text-latte-subtext0 dark:text-mocha-subtext0'}`}>
                        {domain.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <ToggleSwitch checked={domain.isActive} onChange={(c) => onToggleActive(domain.id, c)} />
                </div>
            </div>
        </div>
    );
};
