
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Domain, Partnership, Subdomain, Project, DomainViewMode } from '../../types';
import { DomainList } from './DomainList'; // Legacy list, might use parts or replace
import { AddDomainModal } from '../modals/AddDomainModal';
import { ConfirmDeleteModal } from '../ui/ConfirmDeleteModal';
import { PlusIcon, LayoutGridIcon, ListIcon, ExternalLinkIcon, EditIcon } from '../icons';
import { EntityHistory } from './EntityHistory';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { DomainCard } from '../cards/DomainCard';

interface DomainsViewProps {
    domains: Domain[];
    partnerships: Partnership[];
    projects: Project[];
    onSaveDomain: (domainData: Omit<Domain, 'id' | 'isActive'> & { id?: string }) => void;
    onDeleteDomain: (domain: Domain) => void;
    onToggleDomainActive: (domainId: string, isActive: boolean) => void;
    onToggleSubdomainActive: (domainId: string, subdomainId: string, isActive: boolean) => void;
    getCountryName: (code: string) => string;
    getLanguageName: (code: string) => string;
    countryOptions: { value: string; label: string }[];
    languageOptions: { value: string; label: string }[];
    projectOptions: { value: string; label: string }[];
    viewMode: DomainViewMode;
    setViewMode: React.Dispatch<React.SetStateAction<DomainViewMode>>;
}

export const DomainsView: React.FC<DomainsViewProps> = ({ domains, partnerships, projects, onSaveDomain, onDeleteDomain, onToggleDomainActive, onToggleSubdomainActive, getCountryName, getLanguageName, countryOptions, languageOptions, projectOptions, viewMode, setViewMode }) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
    const [domainToDelete, setDomainToDelete] = useState<Domain | null>(null);
    const [activeTab, setActiveTab] = useState<'list' | 'history'>('list');

    const handleSaveDomain = (domainData: Omit<Domain, 'id' | 'isActive'> & { id?: string }) => {
        onSaveDomain(domainData);
        setIsModalOpen(false);
        setEditingDomain(null);
    };

    const handleAddClick = () => {
        setEditingDomain(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (domain: Domain) => {
        const fullDomain = domains.find(d => d.id === domain.id);
        setEditingDomain(fullDomain || domain);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDomain(null);
    };

    const handleDeleteConfirm = () => {
        if (domainToDelete) {
            onDeleteDomain(domainToDelete);
            setDomainToDelete(null);
        }
    };

    // --- Grouping Logic ---

    // Flatten all domains and subdomains for unified processing where needed
    const flattenedAll = useMemo(() => {
        const list: (Domain | (Subdomain & { parentDomain: Domain }))[] = [];
        domains.forEach(domain => {
            list.push(domain);
            domain.subdomains.forEach(sub => {
                list.push({ ...sub, parentDomain: domain });
            });
        });
        return list;
    }, [domains]);

    const renderedContent = useMemo(() => {
        if (activeTab === 'history') {
            return <EntityHistory t={t} entityTypes={['Domain', 'Subdomain']} />;
        }

        if (domains.length === 0) {
            return (
                <p className="text-center py-8 text-latte-subtext0 dark:text-mocha-subtext0">{t('noDomains')}</p>
            );
        }

        // --- Workflow Mode (Default) ---
        if (viewMode === 'workflow' || viewMode === 'grouped') { // 'grouped' alias for workflow for backward compatibility/default
            // Groups: Active + Pin, Active + No Pin, Inactive
            const activeWithPin: (Domain | (Subdomain & { parentDomain: Domain }))[] = [];
            const activeNoPin: (Domain | (Subdomain & { parentDomain: Domain }))[] = [];
            const inactive: (Domain | (Subdomain & { parentDomain: Domain }))[] = [];

            // We iterate over MAIN DOMAINS only for top level? 
            // The prompt implies displaying "Cards" which usually means the assets themselves.
            // If a domain has subdomains, they are assets too.
            // Let's use the flattened list but filter based on the logic.
            // Logic:
            // Group 1: Active + Has PIN
            // Group 2: Active + No PIN
            // Group 3: Inactive
            
            flattenedAll.forEach(item => {
                const isSub = 'parentDomain' in item;
                // For subdomains, 'hasPin' usually comes from parent? Or logic says "Has PIN". Domain interface has 'hasPin'. Subdomain doesn't explicitly have 'hasPin' in types.ts provided earlier, but let's check.
                // Types.ts: Subdomain doesn't have hasPin. Domain has.
                // So if it's a subdomain, does it inherit PIN status? Usually yes for AdSense.
                const hasPin = isSub ? (item as any).parentDomain.hasPin : (item as Domain).hasPin;
                
                if (!item.isActive) {
                    inactive.push(item);
                } else if (hasPin) {
                    activeWithPin.push(item);
                } else {
                    activeNoPin.push(item);
                }
            });

            return (
                <div className="space-y-8">
                    {activeWithPin.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-latte-green dark:text-mocha-green mb-4 border-b border-latte-surface1 dark:border-mocha-surface1 pb-2">
                                {t('withPin')} ({activeWithPin.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {activeWithPin.map(item => (
                                    <DomainCard 
                                        key={item.id} 
                                        domain={item} 
                                        t={t} 
                                        onEdit={handleEditClick} 
                                        onDelete={setDomainToDelete} 
                                        onToggleActive={('parentDomain' in item) ? (id, a) => onToggleSubdomainActive((item as any).parentDomain.id, id, a) : onToggleDomainActive}
                                        getCountryName={getCountryName}
                                        getLanguageName={getLanguageName}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeNoPin.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-latte-peach dark:text-mocha-peach mb-4 border-b border-latte-surface1 dark:border-mocha-surface1 pb-2">
                                {t('withoutPin')} ({activeNoPin.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {activeNoPin.map(item => (
                                    <DomainCard 
                                        key={item.id} 
                                        domain={item} 
                                        t={t} 
                                        onEdit={handleEditClick} 
                                        onDelete={setDomainToDelete} 
                                        onToggleActive={('parentDomain' in item) ? (id, a) => onToggleSubdomainActive((item as any).parentDomain.id, id, a) : onToggleDomainActive}
                                        getCountryName={getCountryName}
                                        getLanguageName={getLanguageName}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {inactive.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-latte-overlay1 dark:text-mocha-overlay1 mb-4 border-b border-latte-surface1 dark:border-mocha-surface1 pb-2">
                                {t('inactiveItems')} ({inactive.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 opacity-75">
                                {inactive.map(item => (
                                    <DomainCard 
                                        key={item.id} 
                                        domain={item} 
                                        t={t} 
                                        onEdit={handleEditClick} 
                                        onDelete={setDomainToDelete} 
                                        onToggleActive={('parentDomain' in item) ? (id, a) => onToggleSubdomainActive((item as any).parentDomain.id, id, a) : onToggleDomainActive}
                                        getCountryName={getCountryName}
                                        getLanguageName={getLanguageName}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // --- Language Mode ---
        if (viewMode === 'language') {
            const groupedByLang = flattenedAll.reduce((acc, item) => {
                const lang = item.language;
                if (!acc[lang]) acc[lang] = [];
                acc[lang].push(item);
                return acc;
            }, {} as Record<string, typeof flattenedAll>);

            return (
                <div className="space-y-8">
                    {Object.keys(groupedByLang).sort().map(lang => (
                        <div key={lang}>
                            <h3 className="text-lg font-bold text-latte-blue dark:text-mocha-blue mb-4 border-b border-latte-surface1 dark:border-mocha-surface1 pb-2">
                                {getLanguageName(lang)} ({groupedByLang[lang].length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {groupedByLang[lang].map(item => (
                                    <DomainCard 
                                        key={item.id} 
                                        domain={item} 
                                        t={t} 
                                        onEdit={handleEditClick} 
                                        onDelete={setDomainToDelete} 
                                        onToggleActive={('parentDomain' in item) ? (id, a) => onToggleSubdomainActive((item as any).parentDomain.id, id, a) : onToggleDomainActive}
                                        getCountryName={getCountryName}
                                        getLanguageName={getLanguageName}
                                        showPinBadge={true} // Show pin badge since not grouped by it
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // --- Ungrouped Mode (Flat) ---
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {flattenedAll.map(item => (
                    <DomainCard 
                        key={item.id} 
                        domain={item} 
                        t={t} 
                        onEdit={handleEditClick} 
                        onDelete={setDomainToDelete} 
                        onToggleActive={('parentDomain' in item) ? (id, a) => onToggleSubdomainActive((item as any).parentDomain.id, id, a) : onToggleDomainActive}
                        getCountryName={getCountryName}
                        getLanguageName={getLanguageName}
                        showPinBadge={true}
                    />
                ))}
            </div>
        );

    }, [activeTab, domains, flattenedAll, viewMode, t, getCountryName, getLanguageName]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text">{t('domains')}</h1>
                <div className="flex items-center space-x-4">
                    {/* View Mode Selector */}
                    <div className="bg-latte-surface0 dark:bg-mocha-surface0 rounded-lg p-1 flex">
                        <button
                            onClick={() => setViewMode('workflow')}
                            title={t('viewGrouped') || "Workflow View"}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'workflow' || viewMode === 'grouped' ? 'bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust' : 'text-latte-subtext1 dark:text-mocha-subtext1 hover:bg-latte-surface1 dark:hover:bg-mocha-surface1'}`}
                        >
                            Workflow
                        </button>
                        <button
                            onClick={() => setViewMode('language')}
                            title={t('viewByLanguage') || "Language View"}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'language' ? 'bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust' : 'text-latte-subtext1 dark:text-mocha-subtext1 hover:bg-latte-surface1 dark:hover:bg-mocha-surface1'}`}
                        >
                            Language
                        </button>
                        <button
                            onClick={() => setViewMode('ungrouped')}
                            title="Flat View"
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'ungrouped' ? 'bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust' : 'text-latte-subtext1 dark:text-mocha-subtext1 hover:bg-latte-surface1 dark:hover:bg-mocha-surface1'}`}
                        >
                            All
                        </button>
                    </div>

                    <button
                        onClick={handleAddClick}
                        className="flex items-center space-x-2 bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    ><PlusIcon className="w-5 h-5" /><span className="hidden sm:inline">{t('addDomain')}</span></button>
                </div>
            </div>

            <div className="flex space-x-1 bg-latte-surface0 dark:bg-mocha-surface0 p-1 rounded-lg w-fit mb-6">
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-white dark:bg-mocha-surface2 shadow-sm text-latte-text dark:text-mocha-text' : 'text-latte-subtext0 dark:text-mocha-subtext0 hover:text-latte-text dark:hover:text-mocha-text'}`}
                    onClick={() => setActiveTab('list')}
                >
                    {t('list')}
                </button>
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-white dark:bg-mocha-surface2 shadow-sm text-latte-text dark:text-mocha-text' : 'text-latte-subtext0 dark:text-mocha-subtext0 hover:text-latte-text dark:hover:text-mocha-text'}`}
                    onClick={() => setActiveTab('history')}
                >
                    {t('history')}
                </button>
            </div>

            {renderedContent}

            <AddDomainModal
                isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveDomain}
                t={t} countryOptions={countryOptions} languageOptions={languageOptions}
                partnerships={partnerships} editingDomain={editingDomain}
                projectOptions={projectOptions}
            />
            <ConfirmDeleteModal
                isOpen={!!domainToDelete}
                onClose={() => setDomainToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title={t('confirmDelete')}
                message={<>{t('areYouSureDelete')} <strong className="text-latte-text dark:text-mocha-text">{domainToDelete?.name}</strong>?</>}
                t={t}
            />
        </div>
    );
};
