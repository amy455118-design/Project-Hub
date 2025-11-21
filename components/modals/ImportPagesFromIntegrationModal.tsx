
import React, { useState, useEffect } from 'react';
import { Integration } from '../../types';
import { SearchableSelect } from '../ui/SearchableSelect';
import { Checkbox } from '../ui/Checkbox';

interface ImportPagesFromIntegrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    integrations: Integration[];
    onSave: (pages: { name: string, facebookId: string }[]) => Promise<{ success: boolean; errors: { facebookId: string, message: string }[] }>;
    t: any;
}

type ExternalProject = { id: string; name: string };
type ExternalProfile = { id: string; name: string };
type ExternalPage = { pageId: string; name: string };

export const ImportPagesFromIntegrationModal: React.FC<ImportPagesFromIntegrationModalProps> = ({ isOpen, onClose, integrations, onSave, t }) => {
    const [selectedIntegrationId, setSelectedIntegrationId] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [projects, setProjects] = useState<ExternalProject[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');

    const [profiles, setProfiles] = useState<ExternalProfile[]>([]);
    const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);

    const [foundPages, setFoundPages] = useState<ExternalPage[]>([]);
    const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);

    const integrationOptions = integrations.map(i => ({ value: i.id, label: i.name }));
    const projectOptions = projects.map(p => ({ value: p.id, label: p.name }));
    const profileOptions = profiles.map(p => ({ value: p.id, label: p.name }));

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedIntegrationId('');
            setToken(null);
            setProjects([]);
            setSelectedProjectId('');
            setProfiles([]);
            setSelectedProfileIds([]);
            setFoundPages([]);
            setSelectedPageIds([]);
            setError(null);
            setIsLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConnect = async () => {
        const integration = integrations.find(i => i.id === selectedIntegrationId);
        if (!integration) return;

        setIsLoading(true);
        setError(null);

        try {
            // Login
            const loginRes = await fetch(integration.loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: integration.username,
                    password: integration.password,
                    userId: integration.userId
                })
            });

            if (!loginRes.ok) throw new Error('Login failed');
            const loginJson = await loginRes.json();
            const authToken = loginJson.data?.token;

            if (!authToken) throw new Error('No token received');
            setToken(authToken);

            // Fetch Projects
            const projectsRes = await fetch(`${integration.baseUrl}/api/v1/projects`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (!projectsRes.ok) throw new Error('Failed to fetch projects');
            const projectsJson = await projectsRes.json();
            setProjects(projectsJson.data || []);

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Connection failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFetchProfiles = async () => {
        const integration = integrations.find(i => i.id === selectedIntegrationId);
        if (!integration || !token || !selectedProjectId) return;

        setIsLoading(true);
        setError(null);
        setProfiles([]);
        setSelectedProfileIds([]);

        try {
            const res = await fetch(`${integration.baseUrl}/api/v1/profiles?projectId=${selectedProjectId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch profiles');
            const json = await res.json();
            // The API returns { data: { profiles: [...] } }
            setProfiles(json.data?.profiles || []);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to fetch profiles');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFetchPages = async () => {
        const integration = integrations.find(i => i.id === selectedIntegrationId);
        if (!integration || !token || selectedProfileIds.length === 0) return;

        setIsLoading(true);
        setError(null);
        setFoundPages([]);
        setSelectedPageIds([]);

        try {
            let allPages: ExternalPage[] = [];

            for (const profileId of selectedProfileIds) {
                const res = await fetch(`${integration.baseUrl}/api/v1/facebook-pages/by-profile?profileId=${profileId}&limit=999`, {
                     headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (res.ok) {
                    const json = await res.json();
                    // Handle both formats: { data: [...] } or { data: { data: [...] } }
                    let pagesData = [];
                    if (Array.isArray(json.data)) {
                        pagesData = json.data;
                    } else if (json.data && Array.isArray(json.data.data)) {
                        pagesData = json.data.data;
                    }
                    
                    allPages = [...allPages, ...pagesData.map((p: any) => ({
                        pageId: p.pageId,
                        name: p.name
                    }))];
                }
            }
            
            // Deduplicate pages by pageId
            const uniquePages = Array.from(new Map(allPages.map(item => [item.pageId, item])).values());
            setFoundPages(uniquePages);
            // Auto-select all found pages
            setSelectedPageIds(uniquePages.map(p => p.pageId));

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to fetch pages');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImport = async () => {
        const pagesToImport = foundPages
            .filter(p => selectedPageIds.includes(p.pageId))
            .map(p => ({ name: p.name, facebookId: p.pageId }));

        if (pagesToImport.length === 0) return;

        setIsLoading(true);
        const { success, errors } = await onSave(pagesToImport);
        
        if (success) {
            onClose();
        } else {
            // Map backend errors to a displayable string
            const errorMsg = errors.length > 0 
                ? `${t.bulkSaveError} (${errors.length} failures)`
                : t.bulkSaveError;
            setError(errorMsg);
        }
        setIsLoading(false);
    };
    
    const togglePageSelection = (pageId: string, checked: boolean) => {
        if (checked) {
            setSelectedPageIds(prev => [...prev, pageId]);
        } else {
            setSelectedPageIds(prev => prev.filter(id => id !== pageId));
        }
    };

    const toggleAllPages = (checked: boolean) => {
        if (checked) {
            setSelectedPageIds(foundPages.map(p => p.pageId));
        } else {
            setSelectedPageIds([]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl shadow-2xl p-8 w-full max-w-3xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-latte-text dark:text-mocha-text">{t.importFromIntegration}</h2>
                
                <div className="flex-grow overflow-y-auto space-y-6 pr-2">
                    {/* Step 1: Select Integration */}
                    <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                        <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-2">{t.selectIntegration}</label>
                        <div className="flex gap-2">
                            <div className="flex-grow">
                                <SearchableSelect 
                                    options={integrationOptions} 
                                    selected={selectedIntegrationId} 
                                    onChange={setSelectedIntegrationId} 
                                    placeholder={t.selectIntegration} 
                                    searchPlaceholder={t.search} 
                                    disabled={!!token} // Disable if connected
                                />
                            </div>
                            {!token && (
                                <button 
                                    onClick={handleConnect} 
                                    disabled={!selectedIntegrationId || isLoading}
                                    className="px-4 py-2 bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust rounded-lg font-semibold disabled:opacity-50"
                                >
                                    {isLoading ? t.connecting : t.connect}
                                </button>
                            )}
                             {token && (
                                <button 
                                    onClick={() => { setToken(null); setProjects([]); setProfiles([]); setFoundPages([]); }}
                                    className="px-4 py-2 bg-latte-surface2 dark:bg-mocha-surface2 text-latte-text dark:text-mocha-text rounded-lg font-semibold"
                                >
                                    Disconnect
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Step 2: Select Project */}
                    {token && (
                        <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                            <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-2">{t.selectProject}</label>
                             {projects.length > 0 ? (
                                <SearchableSelect 
                                    options={projectOptions} 
                                    selected={selectedProjectId} 
                                    onChange={(val) => { setSelectedProjectId(val); setProfiles([]); setFoundPages([]); }} 
                                    placeholder={t.selectProject} 
                                    searchPlaceholder={t.searchProjects} 
                                />
                             ) : (
                                 <p className="text-sm text-latte-subtext0 dark:text-mocha-subtext0">{t.noProjectsFound}</p>
                             )}
                             {selectedProjectId && (
                                 <div className="mt-2 flex justify-end">
                                     <button 
                                        onClick={handleFetchProfiles}
                                        disabled={isLoading}
                                        className="px-3 py-1.5 text-sm bg-latte-blue text-white dark:bg-mocha-blue dark:text-mocha-crust rounded-lg font-semibold disabled:opacity-50"
                                     >
                                         {isLoading ? t.fetching : t.fetchProfiles}
                                     </button>
                                 </div>
                             )}
                        </div>
                    )}

                    {/* Step 3: Select Profiles */}
                    {profiles.length > 0 && (
                        <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                            <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-2">{t.selectProfiles}</label>
                            <SearchableSelect 
                                options={profileOptions} 
                                selected={selectedProfileIds} 
                                onChange={setSelectedProfileIds} 
                                placeholder={t.selectProfiles} 
                                searchPlaceholder={t.searchProfiles} 
                                multiple
                            />
                             {selectedProfileIds.length > 0 && (
                                 <div className="mt-2 flex justify-end">
                                     <button 
                                        onClick={handleFetchPages}
                                        disabled={isLoading}
                                        className="px-3 py-1.5 text-sm bg-latte-blue text-white dark:bg-mocha-blue dark:text-mocha-crust rounded-lg font-semibold disabled:opacity-50"
                                     >
                                         {isLoading ? t.fetching : t.fetchPages}
                                     </button>
                                 </div>
                             )}
                        </div>
                    )}

                    {/* Step 4: Select Pages */}
                    {foundPages.length > 0 && (
                        <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 flex-grow overflow-hidden flex flex-col">
                             <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1">{t.foundPages} ({foundPages.length})</label>
                                <div className="flex items-center">
                                    <Checkbox 
                                        label="Select All" 
                                        checked={selectedPageIds.length === foundPages.length} 
                                        onChange={toggleAllPages} 
                                    />
                                </div>
                            </div>
                            <div className="overflow-y-auto border border-latte-surface0 dark:border-mocha-surface0 rounded-md p-2 space-y-1 max-h-64">
                                {foundPages.map(page => (
                                    <div key={page.pageId} className="flex items-center p-2 hover:bg-latte-surface0 dark:hover:bg-mocha-surface0 rounded">
                                        <Checkbox 
                                            label={`${page.name} (${page.pageId})`} 
                                            checked={selectedPageIds.includes(page.pageId)} 
                                            onChange={(checked) => togglePageSelection(page.pageId, checked)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {error && (
                        <div className="p-3 bg-latte-red/10 text-latte-red dark:text-mocha-red rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end space-x-4 pt-4 border-t border-latte-surface1 dark:border-mocha-surface1">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-latte-surface1 dark:bg-mocha-surface1 font-semibold hover:bg-latte-surface2 dark:hover:bg-mocha-surface2 transition-colors">
                        {t.cancel}
                    </button>
                    <button 
                        onClick={handleImport} 
                        disabled={selectedPageIds.length === 0 || isLoading}
                        className="px-6 py-2 rounded-lg bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isLoading ? t.saving : `${t.importSelected} (${selectedPageIds.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};
