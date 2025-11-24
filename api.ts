
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
    updateApps: async (bmId: string, apps: any[], bmName: string) => {
        const { error } = await supabase.from('bms').update({ apps }).eq('id', bmId);
        if (error) throw error;
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
        const { error } = await supabase.from('profiles').insert(profiles);
        if(error) throw error;
        // Log bulk entry?
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
    bulkSave: async (pages: any[]) => {
        // Need to check duplicates manually or rely on DB constraint (if any)
        // For now simple insert
        const { error } = await supabase.from('pages').insert(pages);
        if (error) throw error;
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
