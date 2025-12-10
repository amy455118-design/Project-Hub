
import { supabase } from './supabaseClient';
import { Project, Domain, BM, Partnership, Profile, Page, Integration, HistoryEntry, User, App, DropdownOption } from './types';

// Helper for UUID generation (Polyfill for crypto.randomUUID)
export const generateUUID = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    // Fallback using Math.random
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// --- History Helper ---
const addHistoryEntry = async (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    try {
        await supabase.from('history').insert({
            ...entry,
            id: generateUUID(),
            timestamp: new Date().toISOString()
        });
    } catch (e) {
        // Silent fail if history table missing or network error, to keep app usable
        console.warn("History logging failed", e);
    }
};

// --- Change Calculation Helper ---
const calculateChanges = (oldData: any, newData: any): string => {
    if (!oldData) return 'Created';
    const changes: string[] = [];
    const keys = Object.keys(newData);
    
    // Ignore internal fields and sensitive data
    const ignoredFields = [
        'id', 'createdAt', 'updatedAt', 'userId', 'localId', 
        'password', 'facebookPassword', 'emailPassword', 'twoFactorCode', 
        'updated_at', 'created_at', 'adAccounts', 'apps', 'subdomains' // Nested complex objects handled separately or ignored for summary
    ];

    for (const key of keys) {
        if (ignoredFields.includes(key)) continue;

        let oldVal = oldData[key];
        let newVal = newData[key];

        // Normalize Data
        const normalize = (v: any) => {
            if (v === null || v === undefined) return '';
            if (v instanceof Date) return v.toISOString();
            return v;
        };
        
        let nOld = normalize(oldVal);
        let nNew = normalize(newVal);

        if (nOld === nNew) continue;

        // Arrays (Compare sorted stringified to ignore order differences if needed, or direct)
        if (Array.isArray(nOld) && Array.isArray(nNew)) {
            const sOld = JSON.stringify([...nOld].sort());
            const sNew = JSON.stringify([...nNew].sort());
            
            if (sOld !== sNew) {
                // Formatting for specific ID lists to show added/removed
                if (key.endsWith('Ids') || key === 'countries' || key === 'categories' || key === 'permissions') {
                     const added = nNew.filter((x: any) => !nOld.includes(x));
                     const removed = nOld.filter((x: any) => !nNew.includes(x));
                     const parts = [];
                     if (added.length) parts.push(`+${added.join(', ')}`);
                     if (removed.length) parts.push(`-${removed.join(', ')}`);
                     
                     if (parts.length) {
                         changes.push(`${key}: [${parts.join('; ')}]`);
                     } else {
                         changes.push(`${key} changed`);
                     }
                } else {
                    changes.push(`${key} updated`);
                }
            }
            continue;
        }

        // Objects (Deep compare)
        if (typeof nOld === 'object' && typeof nNew === 'object') {
             if (JSON.stringify(nOld) !== JSON.stringify(nNew)) {
                 changes.push(`${key} updated`);
             }
             continue;
        }

        // Primitives
        if (String(nOld) !== String(nNew)) {
             const fmt = (v: any) => {
                const s = String(v);
                return s.length > 20 ? s.substring(0, 17) + '...' : s;
            };
            changes.push(`${key}: ${fmt(nOld)} -> ${fmt(nNew)}`);
        }
    }

    return changes.length > 0 ? changes.join('; ') : 'No significant changes';
};

// --- User/Auth API ---
export const userApi = {
    login: async (username: string, password: string): Promise<User | null> => {
        // Default Admin Hardcoded Check
        if (username === 'admin' && password === 'useradmin') {
            return {
                id: 'default-admin',
                name: 'Administrator',
                username: 'admin',
                role: 'Owner'
            };
        }

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();
        
        if (error) {
            if (error.code !== 'PGRST116') { // PGRST116 is row not found
                 console.error("Supabase login error:", error);
            }
            return null;
        }

        return data as User;
    },
    register: async (user: Omit<User, 'id'>, userName?: string): Promise<User | null> => {
        const id = generateUUID();
        const newUser = { ...user, id };

        // Check duplicates in Supabase
        const { data: existing, error: checkError } = await supabase.from('users').select('id').eq('username', user.username).single();
        
        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError; 
        }
        if (existing) throw new Error('Username already exists');

        const { data, error } = await supabase.from('users').insert([newUser]).select().single();
        
        if (error) throw error;
        addHistoryEntry({ entityType: 'User', entityName: user.name, action: 'Create', details: `Role: ${user.role}`, userName });
        return data as User;
    },
    getAll: async (): Promise<User[]> => {
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error;
        return data as User[];
    },
    updateRole: async (id: string, role: string, userName?: string) => {
        const { error } = await supabase.from('users').update({ role }).eq('id', id);
        if (error) throw error;
        // Optional: Log role update history if needed
    },
    delete: async (id: string, userName?: string) => {
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) throw error;
    }
};

// --- Projects ---
export const projectApi = {
    save: async (project: Partial<Project> & { id?: string }, userName?: string) => {
        const now = new Date().toISOString();
        const projectId = project.id || generateUUID();
        const dataToSave = {
            ...project,
            id: projectId,
            updatedAt: now,
            domainIds: project.domainIds || [],
            subdomainIds: project.subdomainIds || [],
            profileIds: project.profileIds || [],
            pageIds: project.pageIds || [],
            partnershipIds: project.partnershipIds || [],
            countries: project.countries || [],
            chatbotId: project.chatbotId
        };

        // Get the previous project to check if chatbotId changed (if updating)
        let previousProject: Project | null = null;
        if (project.id) {
            const { data } = await supabase.from('projects').select('*').eq('id', project.id).single();
            previousProject = data;
        }

        if (project.id) {
            const { error } = await supabase.from('projects').update(dataToSave).eq('id', project.id);
            if (error) throw error;
            
            const details = calculateChanges(previousProject, dataToSave);
            addHistoryEntry({ 
                entityType: 'Project', 
                entityName: project.name || 'Unknown', 
                action: 'Update', 
                details, 
                userName,
                oldData: previousProject,
                newData: dataToSave
            });
        } else {
            const { error } = await supabase.from('projects').insert({ ...dataToSave, createdAt: now });
            if (error) throw error;
            addHistoryEntry({ 
                entityType: 'Project', 
                entityName: project.name || 'Unknown', 
                action: 'Create', 
                userName,
                newData: dataToSave
            });
        }

        // Sync Chatbot (App) <-> Project relationship
        if (project.chatbotId !== (previousProject?.chatbotId || undefined)) {
            // Remove from old app if exists
            if (previousProject?.chatbotId) {
                await updateAppProjectList(previousProject.chatbotId, projectId, false);
            }
            // Add to new app if exists
            if (project.chatbotId) {
                await updateAppProjectList(project.chatbotId, projectId, true);
            }
        }
    }
};

// Helper to update an App's project list
const updateAppProjectList = async (appId: string, projectId: string, add: boolean) => {
    const { data: bms } = await supabase.from('bms').select('*');
    if (!bms) return;

    for (const bm of bms) {
        const apps = bm.apps as App[];
        const appIndex = apps.findIndex(a => a.id === appId);
        
        if (appIndex !== -1) {
            const app = apps[appIndex];
            const currentProjectIds = app.projectIds || [];
            let newProjectIds = [...currentProjectIds];

            if (add) {
                if (!newProjectIds.includes(projectId)) newProjectIds.push(projectId);
            } else {
                newProjectIds = newProjectIds.filter(id => id !== projectId);
            }

            if (newProjectIds.length !== currentProjectIds.length) {
                const newApps = [...apps];
                newApps[appIndex] = { ...app, projectIds: newProjectIds };
                await supabase.from('bms').update({ apps: newApps }).eq('id', bm.id);
            }
            break;
        }
    }
};

// --- Domains ---
export const domainApi = {
    save: async (domain: Partial<Domain> & { id?: string }, userName?: string) => {
        const dataToSave = {
            ...domain,
            countries: domain.countries || [],
            categories: domain.categories || [],
            subdomains: domain.subdomains || [], // Stored as JSONB
            projectIds: domain.projectIds || [],
        };

        if (domain.id) {
            const { data: oldData } = await supabase.from('domains').select('*').eq('id', domain.id).single();
            const details = calculateChanges(oldData, dataToSave);

            const { error } = await supabase.from('domains').update(dataToSave).eq('id', domain.id);
            if (error) throw error;
            addHistoryEntry({ entityType: 'Domain', entityName: domain.name || 'Unknown', action: 'Update', details, userName, oldData, newData: dataToSave });
        } else {
            const id = generateUUID();
            const { error } = await supabase.from('domains').insert({ ...dataToSave, id, isActive: true });
            if (error) throw error;
            addHistoryEntry({ entityType: 'Domain', entityName: domain.name || 'Unknown', action: 'Create', userName, newData: dataToSave });
        }
    },
    delete: async (domain: Domain, userName?: string) => {
        const { error } = await supabase.from('domains').delete().eq('id', domain.id);
        if (error) throw error;
        addHistoryEntry({ entityType: 'Domain', entityName: domain.name, action: 'Delete', userName, oldData: domain });
    },
    toggleActive: async (id: string, isActive: boolean, name: string, userName?: string) => {
        const { error } = await supabase.from('domains').update({ isActive }).eq('id', id);
        if (error) throw error;
        addHistoryEntry({ entityType: 'Domain', entityName: name, action: isActive ? 'Activate' : 'Deactivate', userName, details: `Active: ${isActive}` });
    },
    updateSubdomains: async (id: string, subdomains: any[], parentName: string, logEntry?: { name: string, action: HistoryEntry['action'] }, userName?: string) => {
        const { error } = await supabase.from('domains').update({ subdomains }).eq('id', id);
        if (error) throw error;
        if (logEntry) {
            addHistoryEntry({ entityType: 'Subdomain', entityName: logEntry.name, action: logEntry.action, details: `Parent: ${parentName}`, userName });
        }
    }
};

// --- BMs ---
export const bmApi = {
    save: async (bm: Partial<BM> & { id?: string }, userName?: string) => {
        const dataToSave = {
            ...bm,
            adAccounts: bm.adAccounts || [], // JSONB
            apps: bm.apps || [], // JSONB
            projectIds: bm.projectIds || [],
            profileIds: bm.profileIds || [],
            pageIds: bm.pageIds || [],
        };

        if (bm.id) {
            const { data: oldData } = await supabase.from('bms').select('*').eq('id', bm.id).single();
            const details = calculateChanges(oldData, dataToSave);

            const { error } = await supabase.from('bms').update(dataToSave).eq('id', bm.id);
            if (error) throw error;
            addHistoryEntry({ entityType: 'BM', entityName: bm.name || 'Unknown', action: 'Update', details, userName, oldData, newData: dataToSave });
        } else {
            const id = generateUUID();
            const { error } = await supabase.from('bms').insert({ ...dataToSave, id });
            if (error) throw error;
            addHistoryEntry({ entityType: 'BM', entityName: bm.name || 'Unknown', action: 'Create', userName, newData: dataToSave });
        }
    },
    delete: async (bm: BM, userName?: string) => {
        const { error } = await supabase.from('bms').delete().eq('id', bm.id);
        if (error) throw error;
        addHistoryEntry({ entityType: 'BM', entityName: bm.name, action: 'Delete', userName, oldData: bm });
    },
    updateApps: async (bmId: string, apps: any[], bmName: string, logEntry?: { appName: string, action: 'Update' | 'Create' | 'Delete', details?: string }, userName?: string) => {
        const { error } = await supabase.from('bms').update({ apps }).eq('id', bmId);
        if (error) throw error;
        if (logEntry) {
            addHistoryEntry({ entityType: 'App', entityName: logEntry.appName, action: logEntry.action, details: logEntry.details || `Parent BM: ${bmName}`, userName });
        }
    },
    saveApp: async (bmId: string, app: App, allApps: App[], bmName: string, userName?: string) => {
        const oldApp = allApps.find(a => a.id === app.id);
        const details = oldApp ? calculateChanges(oldApp, app) : 'Updated';

        const newApps = allApps.map(a => a.id === app.id ? app : a);
        await bmApi.updateApps(bmId, newApps, bmName, { appName: app.name, action: 'Update', details }, userName);

        const projectIds = app.projectIds || [];
        if (projectIds.length > 0) {
            await supabase.from('projects').update({ chatbotId: app.id }).in('id', projectIds);
        }

        const { data: linkedProjects } = await supabase.from('projects').select('id').eq('chatbotId', app.id);
        if (linkedProjects) {
            const idsToRemove = linkedProjects.map(p => p.id).filter(id => !projectIds.includes(id));
            if (idsToRemove.length > 0) {
                await supabase.from('projects').update({ chatbotId: null }).in('id', idsToRemove);
            }
        }
    }
};

// --- Partnerships ---
export const partnershipApi = {
    save: async (p: Partial<Partnership> & { id?: string }, userName?: string) => {
        const dataToSave = {
            ...p,
            projectIds: p.projectIds || [],
            profileIds: p.profileIds || [],
            bmIds: p.bmIds || [],
        };

        if (p.id) {
            const { data: oldData } = await supabase.from('partnerships').select('*').eq('id', p.id).single();
            const details = calculateChanges(oldData, dataToSave);

            const { error } = await supabase.from('partnerships').update(dataToSave).eq('id', p.id);
            if (error) throw error;
            addHistoryEntry({ entityType: 'Partnership', entityName: p.name || 'Unknown', action: 'Update', details, userName, oldData, newData: dataToSave });
        } else {
            const id = generateUUID();
            const { error } = await supabase.from('partnerships').insert({ ...dataToSave, id });
            if (error) throw error;
            addHistoryEntry({ entityType: 'Partnership', entityName: p.name || 'Unknown', action: 'Create', userName, newData: dataToSave });
        }
    },
    delete: async (p: Partnership, userName?: string) => {
        const { error } = await supabase.from('partnerships').delete().eq('id', p.id);
        if (error) throw error;
        addHistoryEntry({ entityType: 'Partnership', entityName: p.name, action: 'Delete', userName, oldData: p });
    }
};

// --- Profiles ---
export const profileApi = {
    save: async (profile: Partial<Profile> & { id?: string }, oldPageIds: string[] = [], userName?: string) => {
        const profileId = profile.id || generateUUID();
        const dataToSave = {
            ...profile,
            id: profileId,
            securityKeys: profile.securityKeys || [],
            emails: profile.emails || [],
            pageIds: profile.pageIds || [],
            bmIds: profile.bmIds || [],
            projectIds: profile.projectIds || [],
        };

        if (profile.id) {
            const { data: oldData } = await supabase.from('profiles').select('*').eq('id', profileId).single();
            const details = calculateChanges(oldData, dataToSave);

            const { error } = await supabase.from('profiles').update(dataToSave).eq('id', profileId);
            if (error) throw error;
            addHistoryEntry({ entityType: 'Profile', entityName: profile.name || 'Unknown', action: 'Update', details, userName, oldData, newData: dataToSave });
        } else {
            const { error } = await supabase.from('profiles').insert(dataToSave);
            if (error) throw error;
            addHistoryEntry({ entityType: 'Profile', entityName: profile.name || 'Unknown', action: 'Create', userName, newData: dataToSave });
        }

        const newPageIds = profile.pageIds || [];
        const addedPageIds = newPageIds.filter(id => !oldPageIds.includes(id));
        const removedPageIds = oldPageIds.filter(id => !newPageIds.includes(id));

        for (const pid of addedPageIds) {
            const { data: page } = await supabase.from('pages').select('profileIds').eq('id', pid).single();
            if (page) {
                const currentProfileIds = page.profileIds || [];
                if (!currentProfileIds.includes(profileId)) {
                    await supabase.from('pages').update({ profileIds: [...currentProfileIds, profileId] }).eq('id', pid);
                }
            }
        }

        for (const pid of removedPageIds) {
            const { data: page } = await supabase.from('pages').select('profileIds').eq('id', pid).single();
            if (page) {
                const current = page.profileIds || [];
                const updated = current.filter((id: string) => id !== profileId);
                await supabase.from('pages').update({ profileIds: updated }).eq('id', pid);
            }
        }
    },
    delete: async (profile: Profile, userName?: string) => {
        const { error } = await supabase.from('profiles').delete().eq('id', profile.id);
        if (error) throw error;
        addHistoryEntry({ entityType: 'Profile', entityName: profile.name, action: 'Delete', userName, oldData: profile });
    },
    bulkDelete: async (ids: string[], userName?: string) => {
        const { error } = await supabase.from('profiles').delete().in('id', ids);
        if (error) throw error;
        addHistoryEntry({ entityType: 'Profile', entityName: `${ids.length} Profiles`, action: 'Delete', userName });
    },
    bulkUpsert: async (profilesData: Partial<Profile>[], userName?: string) => {
        const profilesToUpsert = profilesData.map(p => ({
            id: p.id || generateUUID(),
            name: p.name,
            facebookId: p.facebookId,
            purchaseDate: p.purchaseDate,
            supplier: p.supplier,
            price: p.price,
            status: p.status,
            role: p.role,
            securityKeys: p.securityKeys || [],
            emails: p.emails || [],
            accountStatus: p.accountStatus,
            driveLink: p.driveLink,
            pageIds: p.pageIds || [],
            bmIds: p.bmIds || [],
            projectIds: p.projectIds || [],
            partnershipId: p.partnershipId,
            recoveryEmail: p.recoveryEmail,
            emailPassword: p.emailPassword,
            facebookPassword: p.facebookPassword,
            twoFactorCode: p.twoFactorCode,
        }));

        const { error } = await supabase.from('profiles').upsert(profilesToUpsert);
        if (error) throw error;

        const allPageIds = new Set<string>();
        profilesToUpsert.forEach(p => p.pageIds?.forEach(id => allPageIds.add(id)));

        if (allPageIds.size > 0) {
            const { data: pages } = await supabase.from('pages').select('id, profileIds').in('id', Array.from(allPageIds));
            
            if (pages) {
                const updates = pages.map(page => {
                    const profileIdsInBatch = new Set(profilesToUpsert.map(p => p.id));
                    const profilesToKeep = (page.profileIds || []).filter((pid: string) => !profileIdsInBatch.has(pid));
                    const profilesAddingThisPage = profilesToUpsert.filter(p => p.pageIds?.includes(page.id)).map(p => p.id);
                    const finalProfileIds = Array.from(new Set([...profilesToKeep, ...profilesAddingThisPage]));
                    return { id: page.id, profileIds: finalProfileIds };
                });

                for (const update of updates) {
                    await supabase.from('pages').update({ profileIds: update.profileIds }).eq('id', update.id);
                }
            }
        }

        addHistoryEntry({ 
            entityType: 'Profile', 
            entityName: `${profilesToUpsert.length} Profiles`, 
            action: profilesData.some(p => !!p.id) ? 'Update' : 'Create', 
            details: 'Bulk Operation',
            userName 
        });
    }
};

// --- Pages ---
export const pageApi = {
    save: async (page: Partial<Page> & { id?: string }, oldProfileIds: string[] = [], userName?: string) => {
        const pageId = page.id || generateUUID();
        const dataToSave = {
            ...page,
            id: pageId,
            profileIds: page.profileIds || []
        };

        if (page.facebookId) {
            const { data: existing } = await supabase.from('pages').select('id').eq('facebookId', page.facebookId).single();
            if (existing && existing.id !== pageId) {
                throw new Error("Page with this Facebook ID already exists.");
            }
        }

        if (page.id) {
            const { data: oldData } = await supabase.from('pages').select('*').eq('id', pageId).single();
            const details = calculateChanges(oldData, dataToSave);

            const { error } = await supabase.from('pages').update(dataToSave).eq('id', pageId);
            if (error) throw error;
            addHistoryEntry({ entityType: 'Page', entityName: page.name || 'Unknown', action: 'Update', details, userName, oldData, newData: dataToSave });
        } else {
            const { error } = await supabase.from('pages').insert({ ...dataToSave, provider: page.provider || 'Manual' });
            if (error) throw error;
            addHistoryEntry({ entityType: 'Page', entityName: page.name || 'Unknown', action: 'Create', userName, newData: dataToSave });
        }

        const newProfileIds = page.profileIds || [];
        const addedProfileIds = newProfileIds.filter(id => !oldProfileIds.includes(id));
        const removedProfileIds = oldProfileIds.filter(id => !newProfileIds.includes(id));

        for (const pid of addedProfileIds) {
            const { data: prof } = await supabase.from('profiles').select('pageIds').eq('id', pid).single();
            if (prof) {
                const current = prof.pageIds || [];
                if (!current.includes(pageId)) {
                    await supabase.from('profiles').update({ pageIds: [...current, pageId] }).eq('id', pid);
                }
            }
        }

        for (const pid of removedProfileIds) {
            const { data: prof } = await supabase.from('profiles').select('pageIds').eq('id', pid).single();
            if (prof) {
                const current = prof.pageIds || [];
                const updated = current.filter((id: string) => id !== pageId);
                await supabase.from('profiles').update({ pageIds: updated }).eq('id', pid);
            }
        }
    },
    delete: async (page: Page, userName?: string) => {
        const { error } = await supabase.from('pages').delete().eq('id', page.id);
        if (error) throw error;
        addHistoryEntry({ entityType: 'Page', entityName: page.name, action: 'Delete', userName, oldData: page });
    },
    bulkDelete: async (ids: string[], userName?: string) => {
        const { error } = await supabase.from('pages').delete().in('id', ids);
        if (error) throw error;
        addHistoryEntry({ entityType: 'Page', entityName: `${ids.length} Pages`, action: 'Delete', userName });
    },
    bulkUpsert: async (pagesData: { id?: string; name: string; facebookId: string; profileIds?: string[] }[], userName?: string) => {
        const pagesToUpsert = pagesData.map(p => ({
            id: p.id || generateUUID(),
            name: p.name,
            facebookId: p.facebookId,
            provider: p.id ? undefined : 'Bulk Import',
            profileIds: p.profileIds || [],
        }));

        const { error } = await supabase.from('pages').upsert(
            pagesToUpsert.map(p => ({
                id: p.id,
                name: p.name,
                facebookId: p.facebookId,
                profileIds: p.profileIds,
                provider: p.provider 
            }))
        );
        if (error) throw error;

        const allProfileIds = new Set<string>();
        pagesToUpsert.forEach(p => p.profileIds.forEach(pid => allProfileIds.add(pid)));

        if (allProfileIds.size > 0) {
            const { data: profiles } = await supabase.from('profiles').select('id, pageIds').in('id', Array.from(allProfileIds));
            
            if (profiles) {
                const updates = profiles.map(profile => {
                    const pagesForThisProfile = pagesToUpsert.filter(p => p.profileIds.includes(profile.id)).map(p => p.id);
                    const existingPageIds = profile.pageIds || [];
                    const newPageIdsSet = new Set([...existingPageIds, ...pagesForThisProfile]);
                    return { id: profile.id, pageIds: Array.from(newPageIdsSet) };
                });

                for (const update of updates) {
                    await supabase.from('profiles').update({ pageIds: update.pageIds }).eq('id', update.id);
                }
            }
        }

        addHistoryEntry({ 
            entityType: 'Page', 
            entityName: `${pagesToUpsert.length} Pages`, 
            action: pagesData.some(p => !!p.id) ? 'Update' : 'Create', 
            details: 'Bulk Operation',
            userName
        });
    }
};

// --- Integrations ---
export const integrationApi = {
    save: async (integration: Partial<Integration> & { id?: string }, userName?: string) => {
        if (integration.id) {
            const { data: oldData } = await supabase.from('integrations').select('*').eq('id', integration.id).single();
            const details = calculateChanges(oldData, integration);

            const { error } = await supabase.from('integrations').update(integration).eq('id', integration.id);
            if (error) throw error;
            addHistoryEntry({ entityType: 'Integration', entityName: integration.name || 'Unknown', action: 'Update', details, userName, oldData, newData: integration });
        } else {
            const id = generateUUID();
            const { error } = await supabase.from('integrations').insert({ ...integration, id });
            if (error) throw error;
            addHistoryEntry({ entityType: 'Integration', entityName: integration.name || 'Unknown', action: 'Create', userName, newData: integration });
        }
    },
    delete: async (integration: Integration, userName?: string) => {
        const { error } = await supabase.from('integrations').delete().eq('id', integration.id);
        if (error) throw error;
        addHistoryEntry({ entityType: 'Integration', entityName: integration.name, action: 'Delete', userName, oldData: integration });
    }
};

// --- Dropdown Options ---
export const dropdownApi = {
    add: async (context: string, value: string, color?: string, userName?: string, id?: string) => {
        const newId = id || generateUUID();
        
        // Calculate next order_index
        const { data: maxOrderData } = await supabase.from('dropdown_options')
            .select('order_index')
            .eq('context', context)
            .order('order_index', { ascending: false })
            .limit(1);
            
        const nextOrder = (maxOrderData && maxOrderData.length > 0 && maxOrderData[0].order_index !== null) 
            ? maxOrderData[0].order_index + 1 
            : 0;

        const { error } = await supabase.from('dropdown_options').insert({ id: newId, context, value, order_index: nextOrder, color });
        if (error) throw error;
        addHistoryEntry({ entityType: 'Settings', entityName: context, action: 'Create', details: `Added option: ${value}`, userName });
    },
    update: async (id: string, updates: Partial<DropdownOption>, userName?: string) => {
        const { error } = await supabase.from('dropdown_options').update(updates).eq('id', id);
        if (error) throw error;
        // Could log update here
    },
    delete: async (id: string, context: string, value: string, userName?: string) => {
        const { error } = await supabase.from('dropdown_options').delete().eq('id', id);
        if (error) throw error;
        addHistoryEntry({ entityType: 'Settings', entityName: context, action: 'Delete', details: `Removed option: ${value}`, userName });
    },
    reorder: async (items: { id: string, order_index: number }[]) => {
        const updates = items.map(item => 
            supabase.from('dropdown_options').update({ order_index: item.order_index }).eq('id', item.id)
        );
        await Promise.all(updates);
    }
};