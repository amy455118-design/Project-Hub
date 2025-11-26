
import { supabase } from './supabaseClient';
import { Project, Domain, BM, Partnership, Profile, Page, Integration, HistoryEntry, User } from './types';

// --- History Helper ---
const addHistoryEntry = async (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    try {
        await supabase.from('history').insert({
            ...entry,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString()
        });
    } catch (e) {
        // Silent fail if history table missing or network error, to keep app usable
        console.warn("History logging failed", e);
    }
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
    register: async (user: Omit<User, 'id'>): Promise<User | null> => {
        const id = crypto.randomUUID();
        const newUser = { ...user, id };

        // Check duplicates in Supabase
        const { data: existing, error: checkError } = await supabase.from('users').select('id').eq('username', user.username).single();
        
        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError; 
        }
        if (existing) throw new Error('Username already exists');

        const { data, error } = await supabase.from('users').insert([newUser]).select().single();
        
        if (error) throw error;
        addHistoryEntry({ entityType: 'User', entityName: user.name, action: 'Create', details: `Role: ${user.role}` });
        return data as User;
    },
    getAll: async (): Promise<User[]> => {
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error;
        return data as User[];
    },
    updateRole: async (id: string, role: string) => {
        const { error } = await supabase.from('users').update({ role }).eq('id', id);
        if (error) throw error;
    },
    delete: async (id: string) => {
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) throw error;
    }
};

// --- Projects ---
export const projectApi = {
    save: async (project: Partial<Project> & { id?: string }) => {
        const now = new Date().toISOString();
        const dataToSave = {
            ...project,
            updatedAt: now,
            // Handle arrays that might be undefined
            domainIds: project.domainIds || [],
            subdomainIds: project.subdomainIds || [],
            profileIds: project.profileIds || [],
            pageIds: project.pageIds || [],
            partnershipIds: project.partnershipIds || [],
            countries: project.countries || [],
        };

        if (project.id) {
            // Update
            const { error } = await supabase.from('projects').update(dataToSave).eq('id', project.id);
            if (error) throw error;
            addHistoryEntry({ entityType: 'Project', entityName: project.name || 'Unknown', action: 'Update' });
        } else {
            // Create
            const id = crypto.randomUUID();
            const { error } = await supabase.from('projects').insert({ ...dataToSave, id, createdAt: now });
            if (error) throw error;
            addHistoryEntry({ entityType: 'Project', entityName: project.name || 'Unknown', action: 'Create' });
        }
    }
};

// --- Domains ---
export const domainApi = {
    save: async (domain: Partial<Domain> & { id?: string }) => {
        const dataToSave = {
            ...domain,
            countries: domain.countries || [],
            categories: domain.categories || [],
            subdomains: domain.subdomains || [], // Stored as JSONB
            projectIds: domain.projectIds || [],
        };

        if (domain.id) {
            const { error } = await supabase.from('domains').update(dataToSave).eq('id', domain.id);
            if (error) throw error;
            addHistoryEntry({ entityType: 'Domain', entityName: domain.name || 'Unknown', action: 'Update' });
        } else {
            const id = crypto.randomUUID();
            const { error } = await supabase.from('domains').insert({ ...dataToSave, id, isActive: true });
            if (error) throw error;
            addHistoryEntry({ entityType: 'Domain', entityName: domain.name || 'Unknown', action: 'Create' });
        }
    },
    delete: async (domain: Domain) => {
        const { error } = await supabase.from('domains').delete().eq('id', domain.id);
        if (error) throw error;
        addHistoryEntry({ entityType: 'Domain', entityName: domain.name, action: 'Delete' });
    },
    toggleActive: async (id: string, isActive: boolean, name: string) => {
        const { error } = await supabase.from('domains').update({ isActive }).eq('id', id);
        if (error) throw error;
        addHistoryEntry({ entityType: 'Domain', entityName: name, action: isActive ? 'Activate' : 'Deactivate' });
    },
    updateSubdomains: async (id: string, subdomains: any[], parentName: string, logEntry?: { name: string, action: HistoryEntry['action'] }) => {
        const { error } = await supabase.from('domains').update({ subdomains }).eq('id', id);
        if (error) throw error;
        if (logEntry) {
            addHistoryEntry({ entityType: 'Subdomain', entityName: logEntry.name, action: logEntry.action, details: `Parent: ${parentName}` });
        }
    }
};

// --- BMs ---
export const bmApi = {
    save: async (bm: Partial<BM> & { id?: string }) => {
        const dataToSave = {
            ...bm,
            adAccounts: bm.adAccounts || [], // JSONB
            apps: bm.apps || [], // JSONB
            projectIds: bm.projectIds || [],
            profileIds: bm.profileIds || [],
            pageIds: bm.pageIds || [],
        };

        if (bm.id) {
            const { error } = await supabase.from('bms').update(dataToSave).eq('id', bm.id);
            if (error) throw error;
            addHistoryEntry({ entityType: 'BM', entityName: bm.name || 'Unknown', action: 'Update' });
        } else {
            const id = crypto.randomUUID();
            const { error } = await supabase.from('bms').insert({ ...dataToSave, id });
            if (error) throw error;
            addHistoryEntry({ entityType: 'BM', entityName: bm.name || 'Unknown', action: 'Create' });
        }
    },
    delete: async (bm: BM) => {
        const { error } = await supabase.from('bms').delete().eq('id', bm.id);
        if (error) throw error;
        addHistoryEntry({ entityType: 'BM', entityName: bm.name, action: 'Delete' });
    },
    // Helper to update apps specifically (for chatbots view)
    updateApps: async (bmId: string, apps: any[], bmName: string, logEntry?: { appName: string, action: 'Update' | 'Create' | 'Delete' }) => {
        const { error } = await supabase.from('bms').update({ apps }).eq('id', bmId);
        if (error) throw error;
        if (logEntry) {
            addHistoryEntry({ entityType: 'App', entityName: logEntry.appName, action: logEntry.action, details: `Parent BM: ${bmName}` });
        }
    }
};

// --- Partnerships ---
export const partnershipApi = {
    save: async (p: Partial<Partnership> & { id?: string }) => {
        const dataToSave = {
            ...p,
            projectIds: p.projectIds || [],
            profileIds: p.profileIds || [],
            bmIds: p.bmIds || [],
        };

        if (p.id) {
            const { error } = await supabase.from('partnerships').update(dataToSave).eq('id', p.id);
            if (error) throw error;
            addHistoryEntry({ entityType: 'Partnership', entityName: p.name || 'Unknown', action: 'Update' });
        } else {
            const id = crypto.randomUUID();
            const { error } = await supabase.from('partnerships').insert({ ...dataToSave, id });
            if (error) throw error;
            addHistoryEntry({ entityType: 'Partnership', entityName: p.name || 'Unknown', action: 'Create' });
        }
    },
    delete: async (p: Partnership) => {
        const { error } = await supabase.from('partnerships').delete().eq('id', p.id);
        if (error) throw error;
        addHistoryEntry({ entityType: 'Partnership', entityName: p.name, action: 'Delete' });
    }
};

// --- Profiles ---
export const profileApi = {
    save: async (profile: Partial<Profile> & { id?: string }, oldPageIds: string[] = []) => {
        const profileId = profile.id || crypto.randomUUID();
        const dataToSave = {
            ...profile,
            id: profileId,
            securityKeys: profile.securityKeys || [],
            emails: profile.emails || [],
            pageIds: profile.pageIds || [],
            bmIds: profile.bmIds || [],
            projectIds: profile.projectIds || [],
        };

        // 1. Save Profile
        if (profile.id) {
            const { error } = await supabase.from('profiles').update(dataToSave).eq('id', profileId);
            if (error) throw error;
            addHistoryEntry({ entityType: 'Profile', entityName: profile.name || 'Unknown', action: 'Update' });
        } else {
            const { error } = await supabase.from('profiles').insert(dataToSave);
            if (error) throw error;
            addHistoryEntry({ entityType: 'Profile', entityName: profile.name || 'Unknown', action: 'Create' });
        }

        // 2. Sync Pages (Many-to-Many) manually
        const newPageIds = profile.pageIds || [];
        const addedPageIds = newPageIds.filter(id => !oldPageIds.includes(id));
        const removedPageIds = oldPageIds.filter(id => !newPageIds.includes(id));

        // Add this profile to newly selected pages
        for (const pageId of addedPageIds) {
            const { data: page } = await supabase.from('pages').select('profileIds').eq('id', pageId).single();
            if (page) {
                const currentProfileIds = page.profileIds || [];
                if (!currentProfileIds.includes(profileId)) {
                    await supabase.from('pages').update({ profileIds: [...currentProfileIds, profileId] }).eq('id', pageId);
                }
            }
        }

        // Remove this profile from deselected pages
        for (const pageId of removedPageIds) {
            const { data: page } = await supabase.from('pages').select('profileIds').eq('id', pageId).single();
            if (page) {
                const currentProfileIds = page.profileIds || [];
                const updatedProfileIds = currentProfileIds.filter((id: string) => id !== profileId);
                await supabase.from('pages').update({ profileIds: updatedProfileIds }).eq('id', pageId);
            }
        }
    },
    delete: async (profile: Profile) => {
        const { error } = await supabase.from('profiles').delete().eq('id', profile.id);
        if (error) throw error;
        addHistoryEntry({ entityType: 'Profile', entityName: profile.name, action: 'Delete' });
    },
    bulkSave: async (profiles: any[]) => {
        // DEPRECATED in favor of bulkUpsert for editing capabilities, keeping for backward compatibility if needed
        const { error } = await supabase.from('profiles').insert(profiles);
        if(error) throw error;
    },
    bulkUpsert: async (profilesData: Partial<Profile>[]) => {
        // 1. Prepare Data
        const profilesToUpsert = profilesData.map(p => ({
            // Explicitly map allowed columns to avoid sending temporary fields like 'email', 'localId', 'error'
            id: p.id || crypto.randomUUID(),
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

        // 2. Upsert Profiles
        const { error } = await supabase.from('profiles').upsert(profilesToUpsert);
        if (error) throw error;

        // 3. Sync Pages (Heavy Operation)
        // Collect all involved page IDs to fetch them
        const allPageIds = new Set<string>();
        profilesToUpsert.forEach(p => p.pageIds?.forEach(id => allPageIds.add(id)));

        // Fetch pages to update their profileIds
        if (allPageIds.size > 0) {
            const { data: pages } = await supabase.from('pages').select('id, profileIds').in('id', Array.from(allPageIds));
            
            if (pages) {
                const updates = pages.map(page => {
                    const profileIdsInBatch = new Set(profilesToUpsert.map(p => p.id));
                    
                    // 1. Keep profiles that are NOT in the current batch (don't touch them)
                    const profilesToKeep = (page.profileIds || []).filter((pid: string) => !profileIdsInBatch.has(pid));
                    
                    // 2. Find profiles in current batch that claim this page
                    const profilesAddingThisPage = profilesToUpsert
                        .filter(p => p.pageIds?.includes(page.id))
                        .map(p => p.id);
                    
                    // 3. Combine
                    const finalProfileIds = Array.from(new Set([...profilesToKeep, ...profilesAddingThisPage]));
                    
                    return {
                        id: page.id,
                        profileIds: finalProfileIds
                    };
                });

                for (const update of updates) {
                    await supabase.from('pages').update({ profileIds: update.profileIds }).eq('id', update.id);
                }
            }
        }

        // 4. Log History
        addHistoryEntry({ 
            entityType: 'Profile', 
            entityName: `${profilesToUpsert.length} Profiles`, 
            action: profilesData.some(p => !!p.id) ? 'Update' : 'Create', 
            details: 'Bulk Operation' 
        });
    }
};

// --- Pages ---
export const pageApi = {
    save: async (page: Partial<Page> & { id?: string }, oldProfileIds: string[] = []) => {
        const pageId = page.id || crypto.randomUUID();
        const dataToSave = {
            ...page,
            id: pageId,
            profileIds: page.profileIds || []
        };

        // Check for duplicates if creating or updating FB ID
        if (page.facebookId) {
            const { data: existing } = await supabase.from('pages').select('id').eq('facebookId', page.facebookId).single();
            if (existing && existing.id !== pageId) {
                throw new Error("Page with this Facebook ID already exists.");
            }
        }

        if (page.id) {
            const { error } = await supabase.from('pages').update(dataToSave).eq('id', pageId);
            if (error) throw error;
            addHistoryEntry({ entityType: 'Page', entityName: page.name || 'Unknown', action: 'Update' });
        } else {
            const { error } = await supabase.from('pages').insert({ ...dataToSave, provider: page.provider || 'Manual' });
            if (error) throw error;
            addHistoryEntry({ entityType: 'Page', entityName: page.name || 'Unknown', action: 'Create' });
        }

        // Sync Profiles (Many-to-Many)
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
    delete: async (page: Page) => {
        const { error } = await supabase.from('pages').delete().eq('id', page.id);
        if (error) throw error;
        addHistoryEntry({ entityType: 'Page', entityName: page.name, action: 'Delete' });
    },
    bulkDelete: async (ids: string[]) => {
        const { error } = await supabase.from('pages').delete().in('id', ids);
        if (error) throw error;
        addHistoryEntry({ entityType: 'Page', entityName: `${ids.length} Pages`, action: 'Delete' });
    },
    bulkUpsert: async (pagesData: { id?: string; name: string; facebookId: string; profileIds?: string[] }[]) => {
        // 1. Prepare Pages Data
        const pagesToUpsert = pagesData.map(p => ({
            id: p.id || crypto.randomUUID(),
            name: p.name,
            facebookId: p.facebookId,
            provider: p.id ? undefined : 'Bulk Import', // Keep existing provider if editing, or overwrite? Assuming partial upsert logic or full.
            // Supabase upsert overwrites fields. If we want to preserve provider, we'd need to read it.
            // For bulk ops, assuming 'Bulk Import' for new ones is fine. For edits, we might overwrite provider.
            // To avoid complexity, we'll just set it to 'Bulk Import' or keep if passed (not passed here).
            profileIds: p.profileIds || [],
        }));

        // 2. Upsert Pages
        // We use upsert to handle both new and existing records based on ID
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

        // 3. Sync Profiles (Heavy operation, but necessary for consistency)
        // We need to ensure the referenced profiles have these page IDs in their list.
        // Get all unique profile IDs involved
        const allProfileIds = new Set<string>();
        pagesToUpsert.forEach(p => p.profileIds.forEach(pid => allProfileIds.add(pid)));

        if (allProfileIds.size > 0) {
            const { data: profiles } = await supabase.from('profiles').select('id, pageIds').in('id', Array.from(allProfileIds));
            
            if (profiles) {
                const updates = profiles.map(profile => {
                    const pagesForThisProfile = pagesToUpsert.filter(p => p.profileIds.includes(profile.id)).map(p => p.id);
                    // Merge existing pageIds with new ones, avoiding duplicates
                    const existingPageIds = profile.pageIds || [];
                    const newPageIdsSet = new Set([...existingPageIds, ...pagesForThisProfile]);
                    return {
                        id: profile.id,
                        pageIds: Array.from(newPageIdsSet)
                    };
                });

                for (const update of updates) {
                    await supabase.from('profiles').update({ pageIds: update.pageIds }).eq('id', update.id);
                }
            }
        }

        // 4. History
        addHistoryEntry({ 
            entityType: 'Page', 
            entityName: `${pagesToUpsert.length} Pages`, 
            action: pagesData.some(p => !!p.id) ? 'Update' : 'Create', 
            details: 'Bulk Operation'
        });
    }
};

// --- Integrations ---
export const integrationApi = {
    save: async (integration: Partial<Integration> & { id?: string }) => {
        if (integration.id) {
            const { error } = await supabase.from('integrations').update(integration).eq('id', integration.id);
            if (error) throw error;
            addHistoryEntry({ entityType: 'Integration', entityName: integration.name || 'Unknown', action: 'Update' });
        } else {
            const id = crypto.randomUUID();
            const { error } = await supabase.from('integrations').insert({ ...integration, id });
            if (error) throw error;
            addHistoryEntry({ entityType: 'Integration', entityName: integration.name || 'Unknown', action: 'Create' });
        }
    },
    delete: async (integration: Integration) => {
        const { error } = await supabase.from('integrations').delete().eq('id', integration.id);
        if (error) throw error;
        addHistoryEntry({ entityType: 'Integration', entityName: integration.name, action: 'Delete' });
    }
};
