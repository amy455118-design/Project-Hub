
export type View = 'projects' | 'domains' | 'profiles' | 'pages' | 'bms' | 'chatbots' | 'history' | 'dashboard' | 'configuration' | 'partnerships' | 'api';
export type DomainViewMode = 'grouped' | 'language' | 'workflow' | 'ungrouped'; // Updated view modes

// Keep these types as loose strings now since they are dynamic, 
// but we keep the type aliases for code readability
export type ProfileStatus = string;
export type AccountStatus = string;
export type ProfileRole = string;
export type ProjectStatus = string;

export type UserRole = 'Content' | 'Support' | 'Structure' | 'Analyst' | 'Creatives' | 'Broadcast' | 'Development' | 'Management' | 'Owner';

export interface User {
    id: string;
    username: string;
    password?: string; // Only used during auth/creation
    name: string;
    role: UserRole;
}

export interface Subdomain {
    id: string;
    name: string;
    countries: string[];
    language: string;
    planningSheetUrl: string;
    hasOfferwall: boolean;
    hasPreloader: boolean;
    categories: string[];
    isActive: boolean;
}

export interface Partnership {
    id: string;
    name: string;
    acronym?: string;
    discord?: string;
    whatsapp?: string;
    notes?: string;
    projectIds?: string[];
    profileIds?: string[];
    bmIds?: string[];
}

export interface Domain {
    id: string;
    name: string;
    countries: string[];
    language: string;
    gamAccount: string;
    gamCountry: string;
    partnershipId?: string;
    planningSheetUrl: string;
    publisherAdx: string;
    hasPreloader: boolean;
    hasOfferwall: boolean;
    hasPin: boolean;
    categories: string[];
    subdomains: Subdomain[];
    isActive: boolean;
    projectIds?: string[];
}

export interface Page {
    id:string;
    name: string;
    facebookId: string;
    provider: string;
    profileIds?: string[];
    status?: string; // 'OK' | 'Checkpoint' | 'Restricted' | 'Suspended'
}

export interface BM {
    id: string;
    name: string;
    bmId: string;
    country: string;
    hasAccessVerification: boolean;
    isItProviderVerified: boolean;
    adAccounts: AdAccount[];
    apps: App[];
    partnershipId?: string;
    projectIds?: string[];
    profileIds?: string[];
    pageIds?: string[];
}

export interface App {
    id: string;
    name: string;
    appId: string;
    appDomain: string;
    permissions: string[];
    approvalStep: number; // 1 to 4
    // Chatbot specific fields
    url?: string;
    username?: string;
    password?: string;
    partnershipId?: string;
    profileIds?: string[];
    projectIds?: string[];
}

export interface AdAccount {
    id: string;
    name: string;
    accountId: string;
    paymentMethod: string;
    paymentMethodOwner: string;
}

export interface Profile {
    id: string;
    name: string;
    facebookId: string;
    purchaseDate: Date;
    supplier: string;
    price: number;
    status: ProfileStatus;
    role: ProfileRole;
    securityKeys: string[];
    emails: string[];
    accountStatus: AccountStatus;
    driveLink: string;
    pageIds?: string[];
    bmIds?: string[];
    projectIds?: string[];
    partnershipId?: string;
    recoveryEmail?: string;
    emailPassword?: string;
    facebookPassword?: string;
    twoFactorCode?: string;
}

export type Analyst = string;

export interface Project {
    id: string;
    name: string;
    countries: string[];
    language: string;
    domainIds?: string[];
    subdomainIds?: string[];
    profileIds?: string[];
    bmId?: string;
    pageIds?: string[];
    adAccountId?: string;
    chatbotId?: string;
    partnershipIds?: string[];
    category?: string;
    status: ProjectStatus;
    analyst: Analyst;
    createdAt: Date;
    updatedAt: Date;
}

export interface HistoryEntry {
    id: string;
    timestamp: Date;
    entityType: 'Domain' | 'Subdomain' | 'BM' | 'Project' | 'App' | 'Page' | 'Profile' | 'Partnership' | 'Integration' | 'User' | 'Settings';
    entityName: string;
    action: 'Create' | 'Update' | 'Delete' | 'Activate' | 'Deactivate';
    details?: string;
    userName?: string;
    oldData?: any;
    newData?: any;
}

export interface Integration {
    id: string;
    name: string;
    baseUrl: string;
    loginUrl: string;
    username: string;
    password: string;
    userId: string;
}

export interface DropdownOption {
    id: string;
    context: string;
    value: string;
    order_index?: number;
    color?: string;
}
