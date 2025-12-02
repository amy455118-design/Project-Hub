
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Project, ProjectStatus, Analyst, Domain, BM, Partnership, Profile, Page, App } from '../../types';
import { SearchableSelect } from '../ui/SearchableSelect';

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
    t: any;
    editingProject?: Project | null;
    countryOptions: { value: string; label: string }[];
    languageOptions: { value: string; label: string }[];
    domains: Domain[];
    partnerships: Partnership[];
    bms: BM[];
    analystOptions: { value: Analyst; label: string }[];
    projectStatusOptions: { value: ProjectStatus; label: string }[];
    projects: Project[];
    profiles: Profile[];
    pages: Page[];
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
    isOpen, onClose, onSave, t, editingProject,
    countryOptions, languageOptions, domains, partnerships, bms,
    analystOptions, projectStatusOptions, projects, profiles, pages
}) => {
    const [name, setName] = useState('');
    const [countries, setCountries] = useState<string[]>([]);
    const [language, setLanguage] = useState('');
    const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
    const [category, setCategory] = useState<string | undefined>();
    const [partnershipIds, setPartnershipIds] = useState<string[]>([]);
    const [bmId, setBmId] = useState<string | undefined>();
    const [adAccountId, setAdAccountId] = useState<string | undefined>();
    const [status, setStatus] = useState<ProjectStatus>('Pending');
    const [analyst, setAnalyst] = useState<Analyst>('');
    const [profileIds, setProfileIds] = useState<string[]>([]);
    const [pageIds, setPageIds] = useState<string[]>([]);
    const [chatbotId, setChatbotId] = useState<string | undefined>();

    const domainAndSubdomainOptions = useMemo(() => {
        const options: { value: string, label: string, type: 'domain' | 'subdomain' }[] = [];
        domains.forEach(domain => {
            options.push({ value: domain.id, label: domain.name, type: 'domain' });
            domain.subdomains.forEach(sub => {
                const label = sub.name.includes('.') ? sub.name : `${sub.name}.${domain.name}`;
                options.push({ value: sub.id, label, type: 'subdomain' });
            });
        });
        return options;
    }, [domains]);

    const partnershipOptions = useMemo(() => partnerships.map(p => ({ value: p.id, label: p.name })), [partnerships]);
    const bmOptions = useMemo(() => bms.map(b => ({ value: b.id, label: b.name })), [bms]);

    const chatbotOptions = useMemo(() => {
        const options: { value: string, label: string }[] = [];
        bms.forEach(bm => {
            bm.apps.forEach(app => {
                options.push({ value: app.id, label: `${app.name} (${bm.name})` });
            });
        });
        return options;
    }, [bms]);

    // Use ALL projects + domains to build the category list, making it global
    const categoryOptions = useMemo(() => {
        const categories = new Set<string>();
        
        // Add existing project categories
        projects.forEach(p => {
            if (p.category) categories.add(p.category);
        });

        // Add domain categories
        domains.forEach(d => {
            d.categories.forEach(c => categories.add(c));
            d.subdomains.forEach(s => s.categories.forEach(c => categories.add(c)));
        });

        return Array.from(categories).sort().map(cat => ({ value: cat, label: cat }));
    }, [projects, domains]);

    const adAccountOptions = useMemo(() => {
        if (!bmId) return [];
        const selectedBm = bms.find(b => b.id === bmId);
        return selectedBm?.adAccounts.map(acc => ({ value: acc.id, label: acc.name })) || [];
    }, [bmId, bms]);

    const availableProfileOptions = useMemo(() => {
        const usedProfileIds = new Set<string>();
        projects.forEach(p => {
            if (editingProject && p.id === editingProject.id) return;
            p.profileIds?.forEach(id => usedProfileIds.add(id));
        });

        return profiles
            .filter(profile => !usedProfileIds.has(profile.id))
            .map(p => ({ value: p.id, label: p.name }));
    }, [projects, profiles, editingProject]);

    const availablePageOptions = useMemo(() => {
        if (profileIds.length === 0) return [];
        
        const usedPageIds = new Set<string>();
        projects.forEach(p => {
            if (editingProject && p.id === editingProject.id) return;
            p.pageIds?.forEach(id => usedPageIds.add(id));
        });

        const pagesFromSelectedProfiles = new Set<string>();
        profiles.forEach(profile => {
            if (profileIds.includes(profile.id)) {
                profile.pageIds?.forEach(pageId => pagesFromSelectedProfiles.add(pageId));
            }
        });
        
        return pages
            .filter(page => pagesFromSelectedProfiles.has(page.id) && !usedPageIds.has(page.id))
            .map(p => ({ value: p.id, label: p.name }));
    }, [profileIds, pages, profiles, projects, editingProject]);

    const resetForm = useCallback(() => {
        setName(''); setCountries([]); setLanguage(''); setSelectedTargets([]);
        setCategory(undefined); setPartnershipIds([]); setBmId(undefined);
        setAdAccountId(undefined); setStatus('Pending'); setAnalyst('');
        setProfileIds([]); setPageIds([]); setChatbotId(undefined);
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (editingProject) {
                setName(editingProject.name);
                setCountries(editingProject.countries);
                setLanguage(editingProject.language);
                setSelectedTargets([...(editingProject.domainIds || []), ...(editingProject.subdomainIds || [])]);
                setCategory(editingProject.category);
                setPartnershipIds(editingProject.partnershipIds || []);
                setBmId(editingProject.bmId);
                setAdAccountId(editingProject.adAccountId);
                setStatus(editingProject.status);
                setAnalyst(editingProject.analyst);
                setProfileIds(editingProject.profileIds || []);
                setPageIds(editingProject.pageIds || []);
                setChatbotId(editingProject.chatbotId);
            } else {
                resetForm();
            }
        }
    }, [isOpen, editingProject, resetForm]);

    // Dependent fields logic
    useEffect(() => { setAdAccountId(undefined); }, [bmId]);
    useEffect(() => { 
        const validPageIds = new Set(availablePageOptions.map(p => p.value));
        setPageIds(current => current.filter(id => validPageIds.has(id)));
    }, [profileIds, availablePageOptions]);


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (name.trim() && countries.length > 0 && language) {
            const domainIds = selectedTargets.filter(id => domainAndSubdomainOptions.find(opt => opt.value === id)?.type === 'domain');
            const subdomainIds = selectedTargets.filter(id => domainAndSubdomainOptions.find(opt => opt.value === id)?.type === 'subdomain');

            const projectData = {
                name, countries, language, domainIds, subdomainIds, category, partnershipIds,
                bmId, adAccountId, status, analyst,
                profileIds,
                pageIds,
                chatbotId
            };
            onSave(editingProject ? { ...projectData, id: editingProject.id } : projectData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl shadow-2xl p-8 w-full max-w-4xl transform transition-all" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-latte-text dark:text-mocha-text">{editingProject ? t.editProject : t.addProject}</h2>
                <div className="space-y-6 max-h-[70vh] overflow-y-auto py-2 pr-6 -mr-2">
                    {/* Basic Info */}
                    <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                        <h3 className="font-semibold mb-3 text-latte-text dark:text-mocha-text">Basic Information</h3>
                        <div>
                            <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.projectName}</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.countries}</label>
                                <SearchableSelect options={countryOptions} selected={countries} onChange={setCountries} placeholder={t.selectCountries} searchPlaceholder={t.searchCountries} multiple />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.language}</label>
                                <SearchableSelect options={languageOptions} selected={language} onChange={setLanguage} placeholder={t.selectLanguage} searchPlaceholder={t.searchLanguages} />
                            </div>
                        </div>
                    </div>
                     {/* Relationships & Configuration */}
                    <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                        <h3 className="font-semibold mb-3 text-latte-text dark:text-mocha-text">Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.domains}</label>
                                <SearchableSelect options={domainAndSubdomainOptions} selected={selectedTargets} onChange={setSelectedTargets} placeholder={t.selectDomains} searchPlaceholder={t.searchDomains} multiple />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.category}</label>
                                <SearchableSelect 
                                    options={categoryOptions} 
                                    selected={category || ''} 
                                    onChange={setCategory} 
                                    placeholder={t.selectCategory} 
                                    searchPlaceholder={t.searchCategories} 
                                    creatable 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.profiles}</label>
                                <SearchableSelect options={availableProfileOptions} selected={profileIds} onChange={setProfileIds} placeholder={t.selectProfiles} searchPlaceholder={t.searchProfiles} multiple />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.pages}</label>
                                <SearchableSelect options={availablePageOptions} selected={pageIds} onChange={setPageIds} placeholder={t.selectPages} searchPlaceholder={t.searchPages} multiple disabled={profileIds.length === 0} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.partnerships}</label>
                                <SearchableSelect options={partnershipOptions} selected={partnershipIds} onChange={setPartnershipIds} placeholder={t.selectPartnerships} searchPlaceholder={t.searchPartnerships} multiple />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.bms}</label>
                                <SearchableSelect options={bmOptions} selected={bmId || ''} onChange={setBmId} placeholder={t.selectBm} searchPlaceholder={t.searchBms} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.adAccounts}</label>
                                <SearchableSelect options={adAccountOptions} selected={adAccountId || ''} onChange={setAdAccountId} placeholder={t.selectAdAccount} searchPlaceholder={t.searchAdAccounts} disabled={adAccountOptions.length === 0} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.chatbots}</label>
                                <SearchableSelect options={chatbotOptions} selected={chatbotId || ''} onChange={setChatbotId} placeholder={t.selectChatbot} searchPlaceholder={t.searchChatbots} />
                            </div>
                        </div>
                    </div>
                     {/* Status & Management */}
                    <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                        <h3 className="font-semibold mb-3 text-latte-text dark:text-mocha-text">Management</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.projectStatus}</label>
                                <SearchableSelect options={projectStatusOptions} selected={status} onChange={setStatus} placeholder={t.selectProjectStatus} searchPlaceholder={t.searchStatus} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.analyst}</label>
                                <SearchableSelect options={analystOptions} selected={analyst} onChange={setAnalyst} placeholder={t.selectAnalyst} searchPlaceholder={t.searchAnalyst} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-latte-surface1 dark:bg-mocha-surface1 font-semibold hover:bg-latte-surface2 dark:hover:bg-mocha-surface2 transition-colors">{t.cancel}</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust font-semibold hover:opacity-90 transition-opacity disabled:opacity-50" disabled={!name.trim() || countries.length === 0 || !language}>{t.save}</button>
                </div>
            </div>
        </div>
    );
};
