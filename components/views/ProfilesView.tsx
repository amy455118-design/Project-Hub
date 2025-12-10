
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Profile, Page, Integration, DropdownOption } from '../../types';
import { PlusIcon, EditIcon, TrashIcon, ProfileIcon, ExternalLinkIcon, UploadCloudIcon, DownloadIcon, LayoutGridIcon, ListIcon } from '../icons';
import { AddProfileModal } from '../modals/AddProfileModal';
import { AddProfilesBulkModal } from '../modals/AddProfilesBulkModal';
import { ImportProfilesFromIntegrationModal } from '../modals/ImportProfilesFromIntegrationModal';
import { ConfirmDeleteModal } from '../ui/ConfirmDeleteModal';
import { Checkbox } from '../ui/Checkbox';
import { EntityHistory } from './EntityHistory';
import { ProfileCard } from '../cards/ProfileCard';

interface ProfilesViewProps {
    profiles: Profile[];
    pages: Page[];
    integrations: Integration[];
    onSaveProfile: (profileData: Omit<Profile, 'id'> & { id?: string }) => void;
    onDeleteProfile: (profile: Profile) => void;
    onParseProfiles: (files: File[]) => Promise<Partial<Profile>[]>;
    onBulkSaveProfiles: (profiles: Partial<Profile>[]) => Promise<{ success: boolean; errors: { facebookId: string, message: string }[] }>;
    onBulkDeleteProfiles: (ids: string[]) => Promise<void> | void;
    hasApiKey: boolean;
    dropdownOptions: DropdownOption[];
}

export const ProfilesView: React.FC<ProfilesViewProps> = ({ profiles, pages, integrations, onSaveProfile, onDeleteProfile, onParseProfiles, onBulkSaveProfiles, onBulkDeleteProfiles, hasApiKey, dropdownOptions }) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
    const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
    
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isImportIntegrationModalOpen, setIsImportIntegrationModalOpen] = useState(false);
    const [parsedProfiles, setParsedProfiles] = useState<Partial<Profile>[]>([]);
    const [isParsing, setIsParsing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedProfileIds, setSelectedProfileIds] = useState<Set<string>>(new Set());
    const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
    const [activeTab, setActiveTab] = useState<'list' | 'history'>('list');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    const handleSave = (profileData: Omit<Profile, 'id'> & { id?: string }) => {
        onSaveProfile(profileData);
        setIsModalOpen(false);
        setEditingProfile(null);
    };

    const handleAddClick = () => {
        setEditingProfile(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (profile: Profile) => {
        setEditingProfile(profile);
        setIsModalOpen(true);
    };
    
    const handleDeleteConfirm = () => {
        if (profileToDelete) {
            onDeleteProfile(profileToDelete);
            setProfileToDelete(null);
        }
    };
    
    const handleBulkUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleImportIntegrationClick = () => {
        setIsImportIntegrationModalOpen(true);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsParsing(true);
            const files = Array.from(e.target.files);
            const extractedProfiles = await onParseProfiles(files);
            setParsedProfiles(extractedProfiles);
            setIsParsing(false);
            setIsBulkModalOpen(true);
            // Reset input
            e.target.value = ''; 
        }
    };
    
    const handleIntegrationImport = (profiles: Partial<Profile>[]) => {
        setParsedProfiles(profiles);
        setIsImportIntegrationModalOpen(false);
        setIsBulkModalOpen(true);
    };
    
    const handleBulkSave = async (profilesToSave: Partial<Profile>[]) => {
        const result = await onBulkSaveProfiles(profilesToSave);
        if (result.success) {
            setSelectedProfileIds(new Set()); // Clear selection after successful bulk edit
        }
        return result;
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedProfileIds(new Set(profiles.map(p => p.id)));
        } else {
            setSelectedProfileIds(new Set());
        }
    };

    const handleSelectProfile = (id: string, checked: boolean) => {
        const newSelected = new Set(selectedProfileIds);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedProfileIds(newSelected);
    };

    const handleBulkEditClick = () => {
        const selectedProfiles = profiles.filter(p => selectedProfileIds.has(p.id));
        setParsedProfiles(selectedProfiles);
        setIsBulkModalOpen(true);
    };

    const handleBulkDeleteClick = () => {
        setShowBulkDeleteConfirm(true);
    };

    const confirmBulkDelete = async () => {
        await onBulkDeleteProfiles(Array.from(selectedProfileIds));
        setSelectedProfileIds(new Set());
        setShowBulkDeleteConfirm(false);
    };

    const handleExport = () => {
        const selectedProfiles = profiles.filter(p => selectedProfileIds.has(p.id));
        if (selectedProfiles.length === 0) return;

        const separator = "******************************************************************************";
        
        const content = selectedProfiles.map(p => {
            const email = p.emails && p.emails.length > 0 ? p.emails[0] : '';
            const username = p.facebookId || email;

            return [
                `name=${p.name}`,
                `remark=${p.supplier}`,
                `tab=`,
                `platform=facebook.com`,
                `username=${username}`,
                `password=${p.facebookPassword || ''}`,
                `fakey=${p.twoFactorCode || ''}`,
                `cookie=`,
                `proxytype=noproxy`,
                `ipchecker=`,
                `proxy=`,
                `proxyurl=`,
                `ip=`,
                `countrycode=`,
                `regioncode=`,
                `citycode=`,
                `proxyid=`,
                `ua=`,
                `resolution=`
            ].join('\n');
        }).join(`\n${separator}\n`);
        
        const finalContent = `${content}\n\n${separator}\nWhen importing, please delete this line and all content above it.`;

        const blob = new Blob([finalContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'adspower_import.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getStatusColor = (status: string) => {
        // Dynamic check
        const dynamicOption = (dropdownOptions || []).find(o => o.context === 'profile_status' && o.value === status);
        if (dynamicOption?.color) return dynamicOption.color;

        // Fallback
        switch (status) {
            case 'In Use': return 'bg-latte-green/20 text-latte-green dark:bg-mocha-green/20 dark:text-mocha-green';
            case 'Warm up': return 'bg-latte-blue/20 text-latte-blue dark:bg-mocha-blue/20 dark:text-mocha-blue';
            case 'Stock': return 'bg-latte-yellow/20 text-latte-yellow dark:bg-mocha-yellow/20 dark:text-mocha-yellow';
            case 'Invalidated': return 'bg-latte-red/20 text-latte-red dark:bg-mocha-red/20 dark:text-mocha-red';
            default: return 'bg-latte-surface1 dark:bg-mocha-surface1';
        }
    };
    
    const getRoleColor = (role: string) => {
        // Dynamic check
        const dynamicOption = (dropdownOptions || []).find(o => o.context === 'profile_role' && o.value === role);
        if (dynamicOption?.color) return dynamicOption.color;

        // Fallback
        switch (role) {
            case 'Advertiser': return 'bg-latte-mauve/20 text-latte-mauve dark:bg-mocha-mauve/20 dark:text-mocha-mauve';
            case 'Contingency': return 'bg-latte-peach/20 text-latte-peach dark:bg-mocha-peach/20 dark:text-mocha-peach';
            case 'Bot': return 'bg-latte-sky/20 text-latte-sky dark:bg-mocha-sky/20 dark:text-mocha-sky';
            case 'Backup': return 'bg-latte-sapphire/20 text-latte-sapphire dark:bg-mocha-sapphire/20 dark:text-mocha-sapphire';
            default: return 'bg-latte-surface1 dark:bg-mocha-surface1';
        }
    };

    const pageOptions = pages.map(p => ({ value: p.id, label: p.name }));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text">{t('profiles')}</h1>
                <div className="flex items-center space-x-2">
                    {selectedProfileIds.size === 0 && (
                        <button onClick={handleImportIntegrationClick} className="flex items-center space-x-2 bg-latte-teal text-white dark:bg-mocha-teal dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                            <UploadCloudIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">{t('importFromIntegration')}</span>
                        </button>
                    )}

                    {selectedProfileIds.size > 0 && (
                        <>
                            <button
                                onClick={handleBulkEditClick}
                                className="flex items-center space-x-2 bg-latte-blue text-white dark:bg-mocha-blue dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            >
                                <EditIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">{t('editSelected')} ({selectedProfileIds.size})</span>
                            </button>
                            <button
                                onClick={handleExport}
                                className="flex items-center space-x-2 bg-latte-surface2 text-latte-text dark:bg-mocha-surface2 dark:text-mocha-text px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            >
                                <DownloadIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">{t('exportToAdsPower')}</span>
                            </button>
                            <button 
                                onClick={handleBulkDeleteClick} 
                                className="flex items-center space-x-2 bg-latte-red text-white dark:bg-mocha-red dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            >
                                <TrashIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">{t('deleteSelected')} ({selectedProfileIds.size})</span>
                            </button>
                        </>
                    )}

                    {selectedProfileIds.size === 0 && (
                        <div className="relative group">
                            <button 
                                onClick={handleBulkUploadClick} 
                                disabled={isParsing || !hasApiKey}
                                className="flex items-center space-x-2 bg-latte-sky text-white dark:bg-mocha-sky dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isParsing ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <UploadCloudIcon className="w-5 h-5" />
                                )}
                                <span className="hidden sm:inline">{isParsing ? t('parsingProfiles') : t('addProfilesBulk')}</span>
                            </button>
                            {!hasApiKey && (
                                <div className="absolute bottom-full mb-2 right-0 w-64 p-2 bg-latte-surface2 dark:bg-mocha-surface2 rounded shadow-lg text-xs z-10 text-latte-text dark:text-mocha-text border border-latte-overlay0 dark:border-mocha-overlay0 hidden group-hover:block">
                                    {t('aiDisabledWarning')} <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-latte-mauve dark:text-mocha-mauve underline font-bold ml-1">{t('getApiKey')}</a>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        multiple 
                        accept=".txt" 
                    />
                    
                    <div className="flex items-center bg-latte-surface0 dark:bg-mocha-surface0 rounded-lg p-1 ml-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust' : 'text-latte-subtext1 dark:text-mocha-subtext1 hover:bg-latte-surface1 dark:hover:bg-mocha-surface1'}`}
                        >
                            <LayoutGridIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust' : 'text-latte-subtext1 dark:text-mocha-subtext1 hover:bg-latte-surface1 dark:hover:bg-mocha-surface1'}`}
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <button onClick={handleAddClick} className="flex items-center space-x-2 bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        <PlusIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">{t('addProfile')}</span>
                    </button>
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

            {activeTab === 'list' ? (
                profiles.length === 0 ? (
                    <div className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md">
                        <div className="text-center py-12">
                            <ProfileIcon className="w-16 h-16 mx-auto text-latte-overlay1 dark:text-mocha-overlay1 mb-4" />
                            <p className="text-lg text-latte-subtext0 dark:text-mocha-subtext0">{t('noProfiles')}</p>
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {profiles.map(profile => (
                            <ProfileCard 
                                key={profile.id}
                                profile={profile} 
                                t={t} 
                                onEdit={handleEditClick} 
                                onDelete={() => setProfileToDelete(profile)}
                                getStatusColor={getStatusColor}
                                getRoleColor={getRoleColor}
                                selectionControl={
                                    <Checkbox 
                                        label="" 
                                        checked={selectedProfileIds.has(profile.id)} 
                                        onChange={(checked) => handleSelectProfile(profile.id, checked)} 
                                    />
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md">
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-latte-surface1 dark:border-mocha-surface1">
                                <tr>
                                    <th className="p-4 w-10">
                                        <Checkbox 
                                            label="" 
                                            checked={selectedProfileIds.size === profiles.length && profiles.length > 0} 
                                            onChange={handleSelectAll} 
                                        />
                                    </th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t('profileName')}</th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t('profileStatus')}</th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t('profileRole')}</th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t('supplier')}</th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-right">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profiles.map((profile) => (
                                    <tr key={profile.id} className="border-b border-latte-surface0 dark:border-mocha-surface0 last:border-b-0 hover:bg-latte-surface0 dark:hover:bg-mocha-surface0">
                                        <td className="p-4">
                                            <Checkbox 
                                                label="" 
                                                checked={selectedProfileIds.has(profile.id)} 
                                                onChange={(checked) => handleSelectProfile(profile.id, checked)} 
                                            />
                                        </td>
                                        <td className="p-4 font-medium">{profile.name}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(profile.status)}`}>
                                                {t(`status${profile.status.replace(/\s/g, '')}`) || profile.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${getRoleColor(profile.role)}`}>
                                                {t(`role${profile.role}`) || profile.role}
                                            </span>
                                        </td>
                                        <td className="p-4">{profile.supplier}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                 {profile.driveLink && (
                                                    <a href={profile.driveLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-green dark:text-mocha-green" aria-label={`Drive link for ${profile.name}`}>
                                                        <ExternalLinkIcon className="w-5 h-5" />
                                                    </a>
                                                )}
                                                <button onClick={() => handleEditClick(profile)} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue"><EditIcon className="w-5 h-5" /></button>
                                                <button onClick={() => setProfileToDelete(profile)} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-red dark:text-mocha-red"><TrashIcon className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <EntityHistory t={t} entityTypes={['Profile']} />
            )}

            <AddProfileModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave}
                t={t} 
                editingProfile={editingProfile}
                pageOptions={pageOptions}
                dropdownOptions={dropdownOptions}
            />
            <AddProfilesBulkModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onSave={handleBulkSave}
                t={t}
                initialProfiles={parsedProfiles}
                pageOptions={pageOptions}
            />
            
            <ImportProfilesFromIntegrationModal
                isOpen={isImportIntegrationModalOpen}
                onClose={() => setIsImportIntegrationModalOpen(false)}
                integrations={integrations}
                onImport={handleIntegrationImport}
                t={t}
            />

            <ConfirmDeleteModal
                isOpen={!!profileToDelete}
                onClose={() => setProfileToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title={t('confirmDelete')}
                message={<>{t('areYouSureDeleteProfile')} <strong className="text-latte-text dark:text-mocha-text">{profileToDelete?.name}</strong>?</>}
                t={t}
            />

            <ConfirmDeleteModal
                isOpen={showBulkDeleteConfirm}
                onClose={() => setShowBulkDeleteConfirm(false)}
                onConfirm={confirmBulkDelete}
                title={t('confirmBulkDelete') || "Confirm Bulk Delete"}
                message={`${t('areYouSureBulkDeleteProfiles') || "Are you sure you want to delete the selected profiles?"} (${selectedProfileIds.size})`}
                t={t}
            />
        </div>
    );
};
