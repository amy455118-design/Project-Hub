

import Dexie, { Table } from 'dexie';
import { Project, Domain, Profile, Page, BM, AdAccount, App, HistoryEntry, Partnership, ProfileRole, ProfileStatus, AccountStatus } from './types';

// A type for the old AdAccount structure used in v1 of the database.
type OldAdAccount = AdAccount & { bmId: string };

export class ProjectHubDB extends Dexie {
    projects!: Table<Project>;
    domains!: Table<Domain>;
    profiles!: Table<Profile>;
    pages!: Table<Page>;
    bms!: Table<BM>;
    partnerships!: Table<Partnership>;
    history!: Table<HistoryEntry>;

    // It's good practice to declare all tables, even ones that will be deleted,
    // to help Dexie's migration logic manage transactions correctly.
    adAccounts!: Table<OldAdAccount>;
    apps!: Table<any>;
    chatBots!: Table<any>;


    constructor() {
        super('ProjectHubDB');
        // FIX: Cast this to Dexie to resolve incorrect type errors.
        (this as Dexie).version(1).stores({
            projects: 'id', // Primary key
            domains: 'id',
            profiles: 'id',
            pages: 'id',
            bms: 'id',
            adAccounts: 'id, bmId', // Primary key and index on bmId
            chatBots: 'id',
            apps: 'id',
            history: 'id, timestamp' // Primary key and index on timestamp
        });

        // FIX: Cast this to Dexie to resolve incorrect type errors.
        (this as Dexie).version(2).stores({
            projects: 'id',
            domains: 'id',
            profiles: 'id',
            pages: 'id',
            bms: 'id',
            chatBots: 'id',
            apps: 'id',
            history: 'id, timestamp'
            // adAccounts table is removed
        }).upgrade(async (tx) => {
            const bms = await tx.table('bms').toArray();
            const adAccounts = await tx.table('adAccounts').toArray();

            const adAccountsByBmId = adAccounts.reduce((acc, adAccount) => {
                if (!acc[adAccount.bmId]) {
                    acc[adAccount.bmId] = [];
                }
                const { bmId, ...rest } = adAccount;
                acc[adAccount.bmId].push(rest);
                return acc;
            }, {} as Record<string, AdAccount[]>);

            const updates = bms.map(bm => {
                return tx.table('bms').where({ id: bm.id }).modify({
                    adAccounts: adAccountsByBmId[bm.id] || []
                });
            });

            await Promise.all(updates);
        });
        
        // FIX: Cast this to Dexie to resolve incorrect type errors.
        (this as Dexie).version(3).stores({
            projects: 'id',
            domains: 'id',
            profiles: 'id',
            pages: 'id',
            bms: 'id',
            chatBots: 'id',
            // apps table is removed
            history: 'id, timestamp'
        }).upgrade(async (tx) => {
             await tx.table('bms').toCollection().modify(bm => {
                bm.apps = [];
            });
        });

        // FIX: Cast this to Dexie to resolve incorrect type errors.
        (this as Dexie).version(4).stores({
            projects: 'id',
            domains: 'id, partnershipId',
            profiles: 'id',
            pages: 'id',
            bms: 'id',
            partnerships: 'id, name',
            history: 'id, timestamp'
            // chatBots table removed
        }).upgrade(async (tx) => {
            // Add new fields to existing apps within BMs
            await tx.table('bms').toCollection().modify(bm => {
                if (bm.apps && Array.isArray(bm.apps)) {
                    bm.apps.forEach((app: App) => {
                        app.appDomain = app.appDomain || '';
                        app.permissions = app.permissions || [];
                        app.approvalStep = app.approvalStep || 1;
                        app.url = app.url || '';
                        app.username = app.username || '';
                        app.password = app.password || '';
                        app.partnershipId = app.partnershipId || undefined;
                    });
                } else {
                    bm.apps = [];
                }
            });

            // Update domains to use partnershipId
            await tx.table('domains').toCollection().modify(domain => {
                domain.partnershipId = undefined;
                delete domain.partnership;
            });
        });

        // FIX: Cast this to Dexie to resolve incorrect type errors.
        (this as Dexie).version(5).stores({
            projects: 'id, *domainIds, *profileIds, *bmIds, *pageIds, partnershipId, adAccountId, chatbotId',
            domains: 'id, partnershipId, *projectIds',
            profiles: 'id, *pageIds, *bmIds, *projectIds, partnershipId',
            pages: 'id, *profileIds',
            bms: 'id, partnershipId, *projectIds, *profileIds, *pageIds',
            partnerships: 'id, name, *projectIds, *profileIds, *bmIds',
            history: 'id, timestamp'
        }).upgrade(async (tx) => {
            await tx.table('projects').toCollection().modify(p => {
                p.domainIds = p.domainIds || [];
                p.profileIds = p.profileIds || [];
                p.bmIds = p.bmIds || [];
                p.pageIds = p.pageIds || [];
                p.adAccountId = p.adAccountId || undefined;
                p.chatbotId = p.chatbotId || undefined;
                p.partnershipId = p.partnershipId || undefined;
            });
            await tx.table('domains').toCollection().modify(d => {
                d.projectIds = d.projectIds || [];
            });
            await tx.table('profiles').toCollection().modify(p => {
                p.pageIds = p.pageIds || [];
                p.bmIds = p.bmIds || [];
                p.projectIds = p.projectIds || [];
                p.partnershipId = p.partnershipId || undefined;
            });
            await tx.table('pages').toCollection().modify(p => {
                p.profileIds = p.profileIds || [];
            });
            await tx.table('bms').toCollection().modify(b => {
                b.partnershipId = b.partnershipId || undefined;
                b.projectIds = b.projectIds || [];
                b.profileIds = b.profileIds || [];
                b.pageIds = b.pageIds || [];
                 if (b.apps && Array.isArray(b.apps)) {
                    b.apps.forEach((app: App) => {
                        app.profileIds = app.profileIds || [];
                    });
                }
            });
            await tx.table('partnerships').toCollection().modify(p => {
                p.projectIds = p.projectIds || [];
                p.profileIds = p.profileIds || [];
                p.bmIds = p.bmIds || [];
            });
        });

        (this as Dexie).version(6).stores({
            projects: 'id, *domainIds, *profileIds, bmId, *pageIds, *partnershipIds, adAccountId, chatbotId, status, analyst',
            domains: 'id, partnershipId, *projectIds',
            profiles: 'id, *pageIds, *bmIds, *projectIds, partnershipId',
            pages: 'id, *profileIds',
            bms: 'id, partnershipId, *projectIds, *profileIds, *pageIds',
            partnerships: 'id, name, *projectIds, *profileIds, *bmIds',
            history: 'id, timestamp'
        }).upgrade(async (tx) => {
            await tx.table('projects').toCollection().modify(p => {
                p.analyst = '';
                p.status = 'Pending';
                p.hasRunningCampaigns = false;
                p.category = undefined;
                p.partnershipIds = p.partnershipId ? [p.partnershipId] : [];
                delete p.partnershipId;
                p.bmId = (p.bmIds && p.bmIds.length > 0) ? p.bmIds[0] : undefined;
                delete p.bmIds;
            });
        });

        (this as Dexie).version(7).stores({
            projects: 'id, *domainIds, *subdomainIds, *profileIds, bmId, *pageIds, *partnershipIds, adAccountId, chatbotId, status, analyst',
            domains: 'id, partnershipId, *projectIds',
            profiles: 'id, *pageIds, *bmIds, *projectIds, partnershipId',
            pages: 'id, *profileIds',
            bms: 'id, partnershipId, *projectIds, *profileIds, *pageIds',
            partnerships: 'id, name, *projectIds, *profileIds, *bmIds',
            history: 'id, timestamp'
        }).upgrade(async (tx) => {
            await tx.table('projects').toCollection().modify(p => {
                p.subdomainIds = p.subdomainIds || [];
                p.createdAt = p.createdAt || new Date();
                p.updatedAt = p.updatedAt || new Date();
                delete p.hasRunningCampaigns;
            });
        });

        (this as Dexie).version(8).stores({
            projects: 'id, *domainIds, *subdomainIds, *profileIds, bmId, *pageIds, *partnershipIds, adAccountId, chatbotId, status, analyst',
            domains: 'id, partnershipId, *projectIds',
            profiles: 'id, *pageIds, *bmIds, *projectIds, partnershipId, status, role, accountStatus',
            pages: 'id, *profileIds',
            bms: 'id, partnershipId, *projectIds, *profileIds, *pageIds',
            partnerships: 'id, name, *projectIds, *profileIds, *bmIds',
            history: 'id, timestamp'
        }).upgrade(async (tx) => {
            await tx.table('profiles').toCollection().modify(p => {
                p.facebookId = '';
                p.purchaseDate = new Date();
                p.supplier = p.provider || '';
                p.price = p.cost || 0;
                p.status = 'Stock' as ProfileStatus;
                // Correctly migrate old role or set a default
                const oldRole = (p.role as string)?.toLowerCase();
                if (oldRole === 'bot') {
                    p.role = ProfileRole.Advertiser; // Fix potential data inconsistency from old enum
                } else if (oldRole === 'backup') {
                    p.role = ProfileRole.Backup;
                } else {
                    p.role = ProfileRole.Advertiser;
                }
                p.securityKeys = [];
                p.emails = [];
                p.accountStatus = 'OK' as AccountStatus;
                p.driveLink = '';

                delete p.provider;
                delete p.cost;
            });
        });

        (this as Dexie).version(9).stores({
            projects: 'id, *domainIds, *subdomainIds, *profileIds, bmId, *pageIds, *partnershipIds, adAccountId, chatbotId, status, analyst',
            domains: 'id, partnershipId, *projectIds',
            profiles: 'id, *pageIds, *bmIds, *projectIds, partnershipId, status, role, accountStatus',
            pages: 'id, *profileIds',
            bms: 'id, partnershipId, *projectIds, *profileIds, *pageIds',
            partnerships: 'id, name, *projectIds, *profileIds, *bmIds',
            history: 'id, timestamp'
        }).upgrade(async (tx) => {
            await tx.table('profiles').toCollection().modify(p => {
                p.recoveryEmail = p.recoveryEmail || '';
                p.emailPassword = p.emailPassword || '';
                p.facebookPassword = p.facebookPassword || '';
                p.twoFactorCode = p.twoFactorCode || '';
            });
        });

        (this as Dexie).version(10).stores({
            projects: 'id, *domainIds, *subdomainIds, *profileIds, bmId, *pageIds, *partnershipIds, adAccountId, chatbotId, status, analyst',
            domains: 'id, partnershipId, *projectIds',
            profiles: 'id, *pageIds, *bmIds, *projectIds, partnershipId, status, role, accountStatus',
            pages: 'id, facebookId, *profileIds',
            bms: 'id, partnershipId, *projectIds, *profileIds, *pageIds',
            partnerships: 'id, name, *projectIds, *profileIds, *bmIds',
            history: 'id, timestamp'
        });
    }
}

export const db = new ProjectHubDB();