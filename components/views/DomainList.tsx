

import React, { useState, useMemo } from 'react';
import { Domain, Subdomain, Partnership, DomainViewMode } from '../../types';
import { ChevronDownIcon, ExternalLinkIcon, EditIcon, TrashIcon } from '../icons';
import { StatusIndicator } from '../ui/StatusIndicators';
import { ToggleSwitch } from '../ui/ToggleSwitch';

interface DomainListProps {
    domains: Domain[];
    partnerships: Partnership[];
    viewMode: DomainViewMode;
    t: any;
    handleEditClick: (domain: Domain) => void;
    setDomainToDelete: (domain: Domain | null) => void;
    getCountryName: (code: string) => string;
    getLanguageName: (code: string) => string;
    handleToggleActive: (domainId: string, isActive: boolean) => void;
    handleToggleSubdomainActive: (domainId: string, subdomainId: string, isActive: boolean) => void;
}

const GroupedView: React.FC<Omit<DomainListProps, 'viewMode'>> = ({ domains, partnerships, t, handleEditClick, setDomainToDelete, getCountryName, getLanguageName, handleToggleActive, handleToggleSubdomainActive }) => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const toggleRow = (id: string) => setExpandedRow(expandedRow === id ? null : id);

    const getPartnershipName = (id?: string) => {
        if (!id) return '-';
        return partnerships.find(p => p.id === id)?.name || 'N/A';
    };

    return (
        <div className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md">
            <table className="w-full text-left">
                <thead className="border-b-2 border-latte-surface1 dark:border-mocha-surface1">
                    <tr>
                        <th className="p-4 w-10"></th>
                        <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.domainName}</th>
                        <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.gamAccount}</th>
                        <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.partnership}</th>
                        <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-center">{t.preloader}</th>
                        <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-center">{t.offerwall}</th>
                        <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-right">{t.actions}</th>
                    </tr>
                </thead>
                <tbody>
                    {domains.map((domain) => (
                        <React.Fragment key={domain.id}>
                            <tr className="border-b border-latte-surface0 dark:border-mocha-surface0 last:border-b-0 hover:bg-latte-surface0 dark:hover:bg-mocha-surface0">
                                <td className="p-4 text-center">
                                    {domain.subdomains.length > 0 && (
                                        <button onClick={() => toggleRow(domain.id)} className="w-full h-full flex items-center justify-center">
                                            <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedRow === domain.id ? 'rotate-180' : ''}`} />
                                        </button>
                                    )}
                                </td>
                                <td className="p-4 font-medium text-latte-text dark:text-mocha-text">{domain.name}</td>
                                <td className="p-4 text-latte-subtext0 dark:text-mocha-subtext0">{domain.gamAccount}</td>
                                <td className="p-4 text-latte-subtext0 dark:text-mocha-subtext0">{getPartnershipName(domain.partnershipId)}</td>
                                <td className="p-4"><StatusIndicator isActive={domain.hasPreloader} /></td>
                                <td className="p-4"><StatusIndicator isActive={domain.hasOfferwall} /></td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end space-x-1">
                                        {domain.planningSheetUrl && (
                                            <a href={domain.planningSheetUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-green dark:text-mocha-green" aria-label={`Planning Sheet for ${domain.name}`}>
                                                <ExternalLinkIcon className="w-5 h-5" />
                                            </a>
                                        )}
                                        <ToggleSwitch checked={domain.isActive} onChange={(checked) => handleToggleActive(domain.id, checked)} />
                                        <button onClick={(e) => { e.stopPropagation(); handleEditClick(domain); }} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue" aria-label={`Edit ${domain.name}`}><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); setDomainToDelete(domain); }} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-red dark:text-mocha-red" aria-label={`Delete ${domain.name}`}><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                            {expandedRow === domain.id && domain.subdomains.length > 0 && (
                                <tr>
                                    <td colSpan={7} className="p-0">
                                        <div className="bg-latte-base dark:bg-mocha-base p-4">
                                            <h4 className="font-semibold mb-2 text-latte-text dark:text-mocha-text">{t.subdomains}</h4>
                                            <table className="w-full text-sm">
                                                <thead className="border-b border-latte-surface1 dark:border-mocha-surface1">
                                                    <tr>
                                                        <th className="p-2 text-left font-semibold text-latte-subtext1 dark:text-mocha-subtext1">{t.subdomainName}</th>
                                                        <th className="p-2 text-left font-semibold text-latte-subtext1 dark:text-mocha-subtext1">{t.countries}</th>
                                                        <th className="p-2 text-left font-semibold text-latte-subtext1 dark:text-mocha-subtext1">{t.language}</th>
                                                        <th className="p-2 text-center font-semibold text-latte-subtext1 dark:text-mocha-subtext1">{t.preloader}</th>
                                                        <th className="p-2 text-center font-semibold text-latte-subtext1 dark:text-mocha-subtext1">{t.offerwall}</th>
                                                        <th className="p-2 text-right font-semibold text-latte-subtext1 dark:text-mocha-subtext1">{t.actions}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {domain.subdomains.map(sub => (
                                                        <tr key={sub.id} className="border-b border-latte-surface0 dark:border-mocha-surface0 last:border-b-0">
                                                            <td className="p-2 font-medium">{sub.name}</td>
                                                            <td className="p-2">{sub.countries.map(getCountryName).join(', ')}</td>
                                                            <td className="p-2">{getLanguageName(sub.language)}</td>
                                                            <td className="p-2"><StatusIndicator isActive={sub.hasPreloader} /></td>
                                                            <td className="p-2"><StatusIndicator isActive={sub.hasOfferwall} /></td>
                                                            <td className="p-2 text-right">
                                                                <div className="flex items-center justify-end space-x-1">
                                                                    {sub.planningSheetUrl && (
                                                                        <a href={sub.planningSheetUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-green dark:text-mocha-green" aria-label={`Planning Sheet for ${sub.name}`}>
                                                                            <ExternalLinkIcon className="w-5 h-5" />
                                                                        </a>
                                                                    )}
                                                                    <ToggleSwitch checked={sub.isActive} onChange={(checked) => handleToggleSubdomainActive(domain.id, sub.id, checked)} />
                                                                    <button onClick={(e) => { e.stopPropagation(); handleEditClick(domain); }} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue" aria-label={`Edit parent of ${sub.name}`}><EditIcon className="w-5 h-5" /></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const LanguageView: React.FC<Omit<DomainListProps, 'viewMode'>> = ({ domains, t, getLanguageName, getCountryName, handleEditClick, setDomainToDelete, handleToggleActive, handleToggleSubdomainActive }) => {
    const flattenedList = useMemo(() => {
        const list: (Domain | (Subdomain & { parentDomain: Domain }))[] = [];
        domains.forEach(domain => {
            list.push(domain);
            domain.subdomains.forEach(sub => {
                list.push({ ...sub, parentDomain: domain });
            });
        });
        return list;
    }, [domains]);

    const groupedByLanguage = useMemo(() => {
        return flattenedList.reduce((acc, item) => {
            const lang = item.language;
            if (!acc[lang]) acc[lang] = [];
            acc[lang].push(item);
            return acc;
        }, {} as Record<string, typeof flattenedList>);
    }, [flattenedList]);

    return (
        <div className="space-y-6">
            {/* FIX: Changed from Object.entries to Object.keys to fix type inference issue on `items`. */}
            {Object.keys(groupedByLanguage).map(language => {
                const items = groupedByLanguage[language];
                return (
                <div key={language} className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md">
                    <h4 className="text-xl font-semibold mb-3 text-latte-blue dark:text-mocha-blue">{getLanguageName(language)}</h4>
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-latte-surface1 dark:border-mocha-surface1">
                            <tr>
                                <th className="p-2 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.domainName}</th>
                                <th className="p-2 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.countries}</th>
                                <th className="p-2 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-center">{t.preloader}</th>
                                <th className="p-2 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-center">{t.offerwall}</th>
                                <th className="p-2 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-right">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-b border-latte-surface0 dark:border-mocha-surface0 last:border-b-0">
                                    <td className="p-2 font-medium text-latte-text dark:text-mocha-text">
                                        {'parentDomain' in item
                                            ? (item.name.includes('.')
                                                ? item.name
                                                : `${item.name}.${item.parentDomain.name}`)
                                            : item.name
                                        }
                                    </td>
                                    <td className="p-2 text-latte-subtext0 dark:text-mocha-subtext0">{item.countries.map(getCountryName).join(', ')}</td>
                                    <td className="p-2"><StatusIndicator isActive={item.hasPreloader} /></td>
                                    <td className="p-2"><StatusIndicator isActive={item.hasOfferwall} /></td>
                                    <td className="p-2 text-right">
                                        {'parentDomain' in item ? (
                                            <div className="flex items-center justify-end space-x-1">
                                                {item.planningSheetUrl && (
                                                    <a href={item.planningSheetUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-green dark:text-mocha-green" aria-label={`Planning Sheet for ${item.name}`}>
                                                        <ExternalLinkIcon className="w-5 h-5" />
                                                    </a>
                                                )}
                                                <ToggleSwitch checked={item.isActive} onChange={(checked) => handleToggleSubdomainActive((item as any).parentDomain.id, item.id, checked)} />
                                                <button onClick={(e) => { e.stopPropagation(); handleEditClick((item as any).parentDomain); }} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue" aria-label={`Edit parent of ${item.name}`}><EditIcon className="w-5 h-5" /></button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-end space-x-1">
                                                {item.planningSheetUrl && (
                                                    <a href={item.planningSheetUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-green dark:text-mocha-green" aria-label={`Planning Sheet for ${item.name}`}>
                                                        <ExternalLinkIcon className="w-5 h-5" />
                                                    </a>
                                                )}
                                                <ToggleSwitch checked={item.isActive} onChange={(checked) => handleToggleActive(item.id, checked)} />
                                                <button onClick={(e) => { e.stopPropagation(); handleEditClick(item as Domain); }} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue" aria-label={`Edit ${item.name}`}><EditIcon className="w-5 h-5" /></button>
                                                <button onClick={(e) => { e.stopPropagation(); setDomainToDelete(item as Domain); }} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-red dark:text-mocha-red" aria-label={`Delete ${item.name}`}><TrashIcon className="w-5 h-5" /></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )})}
        </div>
    );
};

export const DomainList: React.FC<DomainListProps> = ({ domains, viewMode, ...props }) => {
    if (domains.length === 0) return null;
    if (viewMode === 'language') return <LanguageView domains={domains} {...props} />;
    return <GroupedView domains={domains} {...props} />;
};