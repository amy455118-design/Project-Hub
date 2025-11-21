
import React, { useState, useMemo } from 'react';
import { Domain, Partnership, Subdomain, Project } from '../../types';
import { DomainViewMode } from '../../types';
import { DomainList } from './DomainList';
import { AddDomainModal } from '../modals/AddDomainModal';
import { ConfirmDeleteModal } from '../ui/ConfirmDeleteModal';
import { PlusIcon, LayoutGridIcon, ListIcon, ExternalLinkIcon, EditIcon } from '../icons';
import { EntityHistory } from './EntityHistory';
import { ToggleSwitch } from '../ui/ToggleSwitch';

interface DomainsViewProps {
    t: any;
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

export const DomainsView: React.FC<DomainsViewProps> = ({ t, domains, partnerships, projects, onSaveDomain, onDeleteDomain, onToggleDomainActive, onToggleSubdomainActive, getCountryName, getLanguageName, countryOptions, languageOptions, projectOptions, viewMode, setViewMode }) => {
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

    const { activeDomains, inactiveParentDomains, inactiveSubdomains } = useMemo(() => {
        const active: Domain[] = [];
        const inactiveParent: Domain[] = [];
        const inactiveSubs: (Subdomain & { parentDomain: Domain })[] = [];

        domains.forEach(d => {
            if (d.isActive) {
                const activeSubdomains = d.subdomains.filter(s => s.isActive);
                const inactiveSubdomainsForThisDomain = d.subdomains.filter(s => !s.isActive);

                if (activeSubdomains.length > 0 || inactiveSubdomainsForThisDomain.length === 0) {
                    active.push({ ...d, subdomains: activeSubdomains });
                }

                inactiveSubs.push(...inactiveSubdomainsForThisDomain.map(s => ({ ...s, parentDomain: d })));
            } else {
                inactiveParent.push(d);
            }
        });

        return { activeDomains: active, inactiveParentDomains: inactiveParent, inactiveSubdomains: inactiveSubs };
    }, [domains]);

    const renderDomainSection = (domainList: Domain[], title: string) => {
        if (!domainList || domainList.length === 0) return null;

        const withPin = domainList.filter(d => d.hasPin);
        const withoutPin = domainList.filter(d => !d.hasPin);

        return (
            <div className="mb-8">
                {title && <h2 className="text-2xl font-bold text-latte-text dark:text-mocha-text mb-4 border-b-2 border-latte-surface1 dark:border-mocha-surface1 pb-2">{title}</h2>}
                {withPin.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-latte-green dark:text-mocha-green mb-3">{t.withPin} ({withPin.length})</h3>
                        <DomainList
                            domains={withPin} partnerships={partnerships} viewMode={viewMode} t={t} handleEditClick={handleEditClick}
                            setDomainToDelete={setDomainToDelete} getCountryName={getCountryName}
                            getLanguageName={getLanguageName} handleToggleActive={onToggleDomainActive}
                            handleToggleSubdomainActive={onToggleSubdomainActive}
                        />
                    </div>
                )}
                {withoutPin.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-latte-peach dark:text-mocha-peach mb-3">{t.withoutPin} ({withoutPin.length})</h3>
                        <DomainList
                            domains={withoutPin} partnerships={partnerships} viewMode={viewMode} t={t} handleEditClick={handleEditClick}
                            setDomainToDelete={setDomainToDelete} getCountryName={getCountryName}
                            getLanguageName={getLanguageName} handleToggleActive={onToggleDomainActive}
                            handleToggleSubdomainActive={onToggleSubdomainActive}
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text">{t.domains}</h1>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-latte-surface0 dark:bg-mocha-surface0 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grouped')} title={t.viewGrouped}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grouped' ? 'bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust' : 'text-latte-subtext1 dark:text-mocha-subtext1 hover:bg-latte-surface1 dark:hover:bg-mocha-surface1'}`}
                        ><LayoutGridIcon className="w-5 h-5" /></button>
                        <button
                            onClick={() => setViewMode('language')} title={t.viewByLanguage}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'language' ? 'bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust' : 'text-latte-subtext1 dark:text-mocha-subtext1 hover:bg-latte-surface1 dark:hover:bg-mocha-surface1'}`}
                        ><ListIcon className="w-5 h-5" /></button>
                    </div>
                    <button
                        onClick={handleAddClick}
                        className="flex items-center space-x-2 bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    ><PlusIcon className="w-5 h-5" /><span>{t.addDomain}</span></button>
                </div>
            </div>

            <div className="flex space-x-1 bg-latte-surface0 dark:bg-mocha-surface0 p-1 rounded-lg w-fit mb-6">
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-white dark:bg-mocha-surface2 shadow-sm text-latte-text dark:text-mocha-text' : 'text-latte-subtext0 dark:text-mocha-subtext0 hover:text-latte-text dark:hover:text-mocha-text'}`}
                    onClick={() => setActiveTab('list')}
                >
                    {t.list}
                </button>
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-white dark:bg-mocha-surface2 shadow-sm text-latte-text dark:text-mocha-text' : 'text-latte-subtext0 dark:text-mocha-subtext0 hover:text-latte-text dark:hover:text-mocha-text'}`}
                    onClick={() => setActiveTab('history')}
                >
                    {t.history}
                </button>
            </div>

            {activeTab === 'list' ? (
                <>
                    {renderDomainSection(activeDomains, t.activeDomains)}

                    {(inactiveParentDomains.length > 0 || inactiveSubdomains.length > 0) && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-latte-text dark:text-mocha-text mb-4 border-b-2 border-latte-surface1 dark:border-mocha-surface1 pb-2">{t.inactiveItems}</h2>
                            {inactiveParentDomains.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold text-latte-subtext0 dark:text-mocha-subtext0 mb-3">{t.inactiveDomains}</h3>
                                    {renderDomainSection(inactiveParentDomains, "")}
                                </div>
                            )}
                            {inactiveSubdomains.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold text-latte-subtext0 dark:text-mocha-subtext0 mb-3">{t.inactiveSubdomains}</h3>
                                    <DomainList
                                        domains={[]} // Not used for Subdomain-only display in this implementation block but required by TS
                                        // We'll reuse the logic directly here or adapt DomainList to accept subdomains only?
                                        // Actually, `DomainList` expects `Domain[]`. The code block below handles subdomains manually.
                                        // Let's keep the manual table render for inactive subdomains as it was in the previous version.
                                        viewMode={viewMode} t={t} handleEditClick={()=>{}} setDomainToDelete={()=>{}} getCountryName={()=>{return ''}} getLanguageName={()=>{return ''}} handleToggleActive={()=>{}} handleToggleSubdomainActive={()=>{}}
                                    />
                                    {/* Manually rendering the table for inactive subdomains as in the original code to avoid complex refactoring of DomainList right now */}
                                    <div className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md mt-2">
                                        <table className="w-full text-left">
                                            <thead className="border-b-2 border-latte-surface1 dark:border-mocha-surface1">
                                                <tr>
                                                    <th className="p-2 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.subdomainName}</th>
                                                    <th className="p-2 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.parentDomain}</th>
                                                    <th className="p-2 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.countries}</th>
                                                    <th className="p-2 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.language}</th>
                                                    <th className="p-2 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-right">{t.actions}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inactiveSubdomains.map(sub => (
                                                    <tr key={sub.id} className="border-b border-latte-surface0 dark:border-mocha-surface0 last:border-b-0">
                                                        <td className="p-2 font-medium">{sub.name}</td>
                                                        <td className="p-2 text-latte-subtext0 dark:text-mocha-subtext0">{sub.parentDomain.name}</td>
                                                        <td className="p-2">{sub.countries.map(getCountryName).join(', ')}</td>
                                                        <td className="p-2">{getLanguageName(sub.language)}</td>
                                                        <td className="p-2 text-right">
                                                            <div className="flex items-center justify-end space-x-1">
                                                                {sub.planningSheetUrl && (
                                                                    <a href={sub.planningSheetUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-green dark:text-mocha-green" aria-label={`Planning Sheet for ${sub.name}`}>
                                                                        <ExternalLinkIcon className="w-5 h-5" />
                                                                    </a>
                                                                )}
                                                                <ToggleSwitch checked={sub.isActive} onChange={(checked) => onToggleSubdomainActive(sub.parentDomain.id, sub.id, checked)} />
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleEditClick(sub.parentDomain); }}
                                                                    className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue"
                                                                    aria-label={`Edit parent of ${sub.name}`}
                                                                ><EditIcon className="w-5 h-5" /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {(activeDomains.length === 0 && inactiveParentDomains.length === 0 && inactiveSubdomains.length === 0) && (
                        <p className="text-center py-8 text-latte-subtext0 dark:text-mocha-subtext0">{t.noDomains}</p>
                    )}
                </>
            ) : (
                <EntityHistory t={t} entityTypes={['Domain', 'Subdomain']} />
            )}

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
                title={t.confirmDelete}
                message={<>{t.areYouSureDelete} <strong className="text-latte-text dark:text-mocha-text">{domainToDelete?.name}</strong>?</>}
                t={t}
            />
        </div>
    );
};
