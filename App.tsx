
import React, { useState, useEffect } from 'react';
import { Project, Domain, BM, Partnership, Profile, Page, View, DomainViewMode, Integration, User, DropdownOption } from './types';
import { GoogleGenAI, Type } from "@google/genai";
import { useTranslation } from 'react-i18next';

// Supabase Imports
import { useSupabase } from './hooks/useSupabase';
import { projectApi, domainApi, bmApi, partnershipApi, profileApi, pageApi, integrationApi, userApi } from './api';

import { LoginView } from './components/layout/LoginView';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { UpdateLogoModal } from './components/modals/UpdateLogoModal';

import { DashboardView } from './components/views/DashboardView';
import { ProjectsView } from './components/views/ProjectsView';
import { DomainsView } from './components/views/DomainsView';
import { BMsView } from './components/views/BMsView';
import { ChatbotsView } from './components/views/ChatbotsView';
import { PartnershipsView } from './components/views/PartnershipsView';
import { ProfilesView } from './components/views/ProfilesView';
import { PagesView } from './components/views/PagesView';
import { ConfigurationView } from './components/views/ConfigurationView';
import { ApiDocsView } from './components/views/ApiDocsView';

import { countryList } from './data/countries';
import { languageList } from './data/languages';

export const App = () => {
    const { t, i18n } = useTranslation();
    const [user, setUser] = useState<User | null>(null);
    const [view, setView] = useState<View>('dashboard');
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [logoSrc, setLogoSrc] = useState<string | null>(null);
    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
    
    // API Key state
    const [userApiKey, setUserApiKey] = useState('');
    const [loginError, setLoginError] = useState('');

    const projects = useSupabase<Project>('projects');
    const domains = useSupabase<Domain>('domains');
    const bms = useSupabase<BM>('bms');
    const partnerships = useSupabase<Partnership>('partnerships');
    const profiles = useSupabase<Profile>('profiles');
    const pages = useSupabase<Page>('pages');
    const integrations = useSupabase<Integration>('integrations');
    const users = useSupabase<User>('users');
    const dropdownOptions = useSupabase<DropdownOption>('dropdown_options');

    const [domainViewMode, setDomainViewMode] = useState<DomainViewMode>('grouped');
    const [bmDetailViewType, setBmDetailViewType] = useState<'adAccounts' | 'apps'>('adAccounts');

    // Compatibility Proxy for legacy components still expecting `t` as an object
    const tProxy = new Proxy({}, {
        get: (_, prop) => t(String(prop))
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const handleLogin = async (u: string, p: string) => {
        const user = await userApi.login(u, p);
        if (user) {
            setUser(user);
            setLoginError('');
        } else {
            setLoginError('Invalid credentials');
        }
    };

    const handleRegister = async (u: Omit<User, 'id'>) => {
        await userApi.register(u, user?.name);
    };
    
    const handleLogout = () => {
        setUser(null);
        setView('dashboard');
    };

    // GenAI: Parse Profiles
    const onParseProfiles = async (files: File[]): Promise<Partial<Profile>[]> => {
        if (!process.env.API_KEY) {
            console.error("API Key not configured in environment");
            throw new Error("API Key not configured");
        }
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const results: Partial<Profile>[] = [];

        for (const file of files) {
            const text = await file.text();
            const prompt = `Extract Facebook profiles from this text. Return a JSON array of objects with fields: name, facebookId, facebookPassword, twoFactorCode, email (string), emailPassword, recoveryEmail, supplier, price, status, role, driveLink, securityKeys (array of strings). \n\nText:\n${text}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { 
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                facebookId: { type: Type.STRING },
                                facebookPassword: { type: Type.STRING },
                                twoFactorCode: { type: Type.STRING },
                                email: { type: Type.STRING },
                                emailPassword: { type: Type.STRING },
                                recoveryEmail: { type: Type.STRING },
                                supplier: { type: Type.STRING },
                                price: { type: Type.NUMBER },
                                status: { type: Type.STRING },
                                role: { type: Type.STRING },
                                driveLink: { type: Type.STRING },
                                securityKeys: { type: Type.ARRAY, items: { type: Type.STRING } },
                            }
                        }
                    }
                }
            });
            
            try {
                const json = JSON.parse(response.text);
                if (Array.isArray(json)) results.push(...json);
            } catch (e) { console.error(e); }
        }
        return results;
    };

    // GenAI: Transcribe Image for Pages
    const onTranscribeImage = async (base64: string): Promise<string[]> => {
        if (!process.env.API_KEY) {
             console.error("API Key not configured in environment");
             throw new Error("API Key not configured");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = "Extract all text lines from this image that look like page names. Return a JSON array of strings.";
        
        const base64Data = base64.split(',')[1];
        const mimeType = base64.split(';')[0].split(':')[1];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType, data: base64Data } },
                    { text: prompt }
                ]
            },
            config: { 
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        
         try {
            const json = JSON.parse(response.text);
            return Array.isArray(json) ? json : [];
        } catch (e) { console.error(e); return []; }
    };

    if (!user) {
        return <LoginView onLogin={handleLogin} onRegister={handleRegister} error={loginError} t={tProxy} />;
    }

    const userName = user?.name;

    // Passing tProxy to legacy components that might still use t.key props until full refactor
    const legacyProps = { t: tProxy };

    const renderView = () => {
        switch (view) {
            case 'dashboard': return <DashboardView />;
            case 'projects': return <ProjectsView projects={projects} onSaveProject={(p) => projectApi.save(p, userName)} getCountryName={(c) => c} getLanguageName={(l) => l} countryOptions={countryList.map(c => ({ value: c.en, label: c[i18n.language as 'en'|'pt'|'es'] || c.en }))} languageOptions={languageList.map(l => ({ value: l.en, label: l[i18n.language as 'en'|'pt'|'es'] || l.en }))} domains={domains} bms={bms} partnerships={partnerships} profiles={profiles} pages={pages} users={users} dropdownOptions={dropdownOptions} {...legacyProps} />;
            case 'domains': return <DomainsView domains={domains} partnerships={partnerships} projects={projects} onSaveDomain={(d) => domainApi.save(d, userName)} onDeleteDomain={(d) => domainApi.delete(d, userName)} onToggleDomainActive={(id, a) => domainApi.toggleActive(id, a, domains.find(d => d.id === id)?.name || '', userName)} onToggleSubdomainActive={(did, sid, a) => { 
                const domain = domains.find(d => d.id === did);
                if (domain) {
                    const newSubdomains = domain.subdomains.map(s => s.id === sid ? { ...s, isActive: a } : s);
                    const subName = domain.subdomains.find(s => s.id === sid)?.name || 'Unknown';
                    domainApi.updateSubdomains(did, newSubdomains, domain.name, { name: subName, action: a ? 'Activate' : 'Deactivate' }, userName);
                }
            }} getCountryName={(c) => c} getLanguageName={(l) => l} countryOptions={countryList.map(c => ({ value: c.en, label: c[i18n.language as 'en'|'pt'|'es'] || c.en }))} languageOptions={languageList.map(l => ({ value: l.en, label: l[i18n.language as 'en'|'pt'|'es'] || l.en }))} projectOptions={projects.map(p => ({ value: p.id, label: p.name }))} viewMode={domainViewMode} setViewMode={setDomainViewMode} />;
            case 'profiles': return <ProfilesView profiles={profiles} pages={pages} integrations={integrations} onSaveProfile={(p) => profileApi.save(p, [], userName)} onDeleteProfile={(p) => profileApi.delete(p, userName)} onParseProfiles={onParseProfiles} onBulkSaveProfiles={async (p) => { await profileApi.bulkUpsert(p, userName); return { success: true, errors: [] }; }} onBulkDeleteProfiles={(ids) => profileApi.bulkDelete(ids, userName)} hasApiKey={!!process.env.API_KEY} dropdownOptions={dropdownOptions} />;
            case 'pages': return <PagesView pages={pages} profiles={profiles} integrations={integrations} onSavePage={(p) => pageApi.save(p, [], userName)} onDeletePage={(p) => pageApi.delete(p, userName)} onTranscribeImage={onTranscribeImage} onBulkSavePages={async (p) => { await pageApi.bulkUpsert(p, userName); return { success: true, errors: [] }; }} onBulkDeletePages={(ids) => pageApi.bulkDelete(ids, userName)} hasApiKey={!!process.env.API_KEY} />;
            case 'bms': return <BMsView bms={bms} partnerships={partnerships} onSaveBm={(b) => bmApi.save(b, userName)} onDeleteBm={(b) => bmApi.delete(b, userName)} getCountryName={(c) => c} countryOptions={countryList.map(c => ({ value: c.en, label: c[i18n.language as 'en'|'pt'|'es'] || c.en }))} detailViewType={bmDetailViewType} setDetailViewType={setBmDetailViewType} partnershipOptions={partnerships.map(p => ({ value: p.id, label: p.name }))} projectOptions={projects.map(p => ({ value: p.id, label: p.name }))} profileOptions={profiles.map(p => ({ value: p.id, label: p.name }))} pageOptions={pages.map(p => ({ value: p.id, label: p.name }))} {...legacyProps} />;
            case 'chatbots': return <ChatbotsView bms={bms} partnerships={partnerships} projects={projects} onSaveApp={(app, bmId) => { 
                const bm = bms.find(b => b.id === bmId); 
                if (bm) { 
                    bmApi.saveApp(bmId, app, bm.apps, bm.name, userName);
                } 
            }} {...legacyProps} />;
            case 'partnerships': return <PartnershipsView partnerships={partnerships} onSavePartnership={(p) => partnershipApi.save(p, userName)} onDeletePartnership={(p) => partnershipApi.delete(p, userName)} projectOptions={projects.map(p => ({ value: p.id, label: p.name }))} profileOptions={profiles.map(p => ({ value: p.id, label: p.name }))} bmOptions={bms.map(b => ({ value: b.id, label: b.name }))} {...legacyProps} />;
            case 'configuration': return <ConfigurationView integrations={integrations} onSaveIntegration={(i) => integrationApi.save(i, userName)} onDeleteIntegration={(i) => integrationApi.delete(i, userName)} user={user} userApiKey={userApiKey} onApiKeyChange={setUserApiKey} dropdownOptions={dropdownOptions} {...legacyProps} />;
            case 'api': return <ApiDocsView {...legacyProps} />;
            default: return null;
        }
    };

    return (
        <div className={`flex h-screen bg-latte-base dark:bg-mocha-base ${theme}`}>
            <Sidebar view={view} setView={setView} isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} logoSrc={logoSrc} onLogoClick={() => setIsLogoModalOpen(true)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header theme={theme} onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} onLogout={handleLogout} onSettingsClick={() => setView('configuration')} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {renderView()}
                </main>
            </div>
            <UpdateLogoModal isOpen={isLogoModalOpen} onClose={() => setIsLogoModalOpen(false)} onSave={(src) => { setLogoSrc(src); setIsLogoModalOpen(false); }} t={tProxy} />
        </div>
    );
};
