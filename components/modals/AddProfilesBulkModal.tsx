
import React, { useState, useEffect } from 'react';
import { Profile, ProfileStatus, ProfileRole } from '../../types';
import { TrashIcon, LayersIcon, PlusIcon } from '../icons';
import { SearchableSelect } from '../ui/SearchableSelect';

export type BulkProfileEntry = Partial<Profile> & {
    localId: string;
    email: string; // Flat string for editing, converted to array on save
    pageIds: string[];
    error?: string;
};

interface AddProfilesBulkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (profiles: Partial<Profile>[]) => Promise<{ success: boolean; errors: { facebookId: string, message: string }[] }>;
    t: any;
    initialProfiles: Partial<Profile>[];
    pageOptions?: { value: string; label: string }[];
}

const profileStatusOptions: { value: ProfileStatus; label: string }[] = [
    { value: 'Warm up', label: 'statusWarmUp' },
    { value: 'Stock', label: 'statusStock' },
    { value: 'In Use', label: 'statusInUse' },
    { value: 'Invalidated', label: 'statusInvalidated' }
];

const profileRoleOptions: { value: ProfileRole; label: string }[] = [
    { value: ProfileRole.Advertiser, label: 'roleAdvertiser' },
    { value: ProfileRole.Contingency, label: 'roleContingency' },
    { value: ProfileRole.Bot, label: 'roleBot' },
    { value: ProfileRole.Backup, label: 'roleBackup' }
];

const securityKeyOptions = [
    { value: 'Sara', label: 'Sara' },
    { value: 'Marcos', label: 'Marcos' },
    { value: 'Francisco', label: 'Francisco' }
];

export const AddProfilesBulkModal: React.FC<AddProfilesBulkModalProps> = ({ isOpen, onClose, onSave, t, initialProfiles, pageOptions = [] }) => {
    const [profiles, setProfiles] = useState<BulkProfileEntry[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [summaryError, setSummaryError] = useState('');
    
    // State for bulk page selection
    const [bulkPageIds, setBulkPageIds] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setProfiles(initialProfiles.map(p => ({
                ...p,
                localId: crypto.randomUUID(),
                email: (p as any).email || (p.emails && p.emails.length > 0 ? p.emails[0] : '') || '',
                name: p.name || '',
                facebookId: p.facebookId || '',
                facebookPassword: p.facebookPassword || '',
                twoFactorCode: p.twoFactorCode || '',
                emailPassword: p.emailPassword || '',
                recoveryEmail: p.recoveryEmail || '',
                supplier: p.supplier || '',
                price: p.price || 0,
                status: p.status || 'Stock' as ProfileStatus,
                role: p.role || ProfileRole.Advertiser,
                driveLink: p.driveLink || '',
                securityKeys: p.securityKeys || [],
                pageIds: p.pageIds || [],
            })));
            setIsSaving(false);
            setSummaryError('');
            setBulkPageIds([]);
        }
    }, [isOpen, initialProfiles]);

    if (!isOpen) return null;

    const handleProfileChange = (localId: string, field: keyof BulkProfileEntry, value: any) => {
        setProfiles(currentProfiles =>
            currentProfiles.map(p => p.localId === localId ? { ...p, [field]: value, error: undefined } : p)
        );
    };

    const handleRemoveProfile = (localId: string) => {
        setProfiles(currentProfiles => currentProfiles.filter(p => p.localId !== localId));
    };

    const handleApplyBulkPages = () => {
        if (bulkPageIds.length === 0) return;
        setProfiles(currentProfiles => 
            currentProfiles.map(p => {
                const existing = new Set(p.pageIds || []);
                bulkPageIds.forEach(id => existing.add(id));
                return { ...p, pageIds: Array.from(existing) };
            })
        );
        setBulkPageIds([]);
    };

    const handleSaveClick = async () => {
        setIsSaving(true);
        setSummaryError('');

        // Transform data: Remove temporary fields (localId, error, email) and map 'email' -> 'emails'
        const profilesToSave = profiles.map(({ localId, error, email, ...rest }) => ({
            ...rest,
            emails: email ? [email] : []
        }));

        const { success, errors } = await onSave(profilesToSave);

        if (success) {
            onClose();
        } else {
            setSummaryError(t.bulkSaveError || 'Some items could not be saved.');
            setProfiles(currentProfiles =>
                currentProfiles.map(p => {
                    const error = errors.find(e => e.facebookId === p.facebookId);
                    return error ? { ...p, error: error.message } : p;
                })
            );
        }
        setIsSaving(false);
    };
    
    const allFieldsFilled = profiles.every(p => p.facebookId && p.facebookId.trim() !== '');

    const inputClass = "w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none text-sm";
    const labelClass = "block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl shadow-2xl p-8 w-full max-w-6xl flex flex-col h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-latte-text dark:text-mocha-text">{t.addProfilesBulk}</h2>
                        <p className="text-sm text-latte-subtext1 dark:text-mocha-subtext1">{t.addProfilesBulkDescription}</p>
                    </div>
                </div>
                
                {/* Bulk Actions Toolbar */}
                <div className="mb-6 p-4 bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 rounded-lg flex flex-col md:flex-row md:items-end gap-4">
                    <div className="flex-grow max-w-md">
                        <label className={labelClass}>Add Pages to All Selected ({profiles.length} profiles)</label>
                        <SearchableSelect 
                            options={pageOptions} 
                            selected={bulkPageIds} 
                            onChange={setBulkPageIds} 
                            placeholder={t.selectPages} 
                            searchPlaceholder={t.searchPages}
                            multiple
                        />
                    </div>
                    <button 
                        onClick={handleApplyBulkPages}
                        disabled={bulkPageIds.length === 0}
                        className="px-4 py-2 bg-latte-blue text-white dark:bg-mocha-blue dark:text-mocha-crust rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 h-[42px]"
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span>Apply Pages</span>
                    </button>
                </div>
                
                {summaryError && <p className="text-sm text-center text-latte-red dark:text-mocha-red mb-4 p-2 bg-latte-red/10 rounded-md">{summaryError}</p>}
                
                <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                    {profiles.map((profile) => (
                        <div key={profile.localId} className={`p-6 rounded-lg bg-latte-base dark:bg-mocha-base border ${profile.error ? 'border-latte-red dark:border-mocha-red' : 'border-latte-surface1 dark:border-mocha-surface1'} relative shadow-sm`}>
                            <button onClick={() => handleRemoveProfile(profile.localId)} className="absolute top-4 right-4 p-2 rounded-lg text-latte-red dark:text-mocha-red hover:bg-latte-red/10 dark:hover:bg-mocha-red/10 transition-colors">
                                <TrashIcon className="w-5 h-5" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-10">
                                <div>
                                    <label className={labelClass}>{t.profileName}</label>
                                    <input type="text" value={profile.name} onChange={e => handleProfileChange(profile.localId, 'name', e.target.value)} className={inputClass} placeholder={t.profileName} />
                                </div>
                                <div>
                                    <label className={labelClass}>{t.facebookId}</label>
                                    <input type="text" value={profile.facebookId} onChange={e => handleProfileChange(profile.localId, 'facebookId', e.target.value)} className={inputClass} placeholder={t.facebookId} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label className={labelClass}>{t.profileStatus}</label>
                                    <SearchableSelect 
                                        options={profileStatusOptions.map(opt => ({...opt, label: t[opt.label] || opt.label}))}
                                        selected={profile.status || 'Stock'}
                                        onChange={val => handleProfileChange(profile.localId, 'status', val)}
                                        placeholder={t.selectProfileStatus}
                                        searchPlaceholder={t.searchStatus}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>{t.profileRole}</label>
                                    <SearchableSelect 
                                        options={profileRoleOptions.map(opt => ({...opt, label: t[opt.label] || opt.label}))}
                                        selected={profile.role || 'Advertiser'}
                                        onChange={val => handleProfileChange(profile.localId, 'role', val)}
                                        placeholder={t.selectRole}
                                        searchPlaceholder={t.searchRole}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>{t.supplier}</label>
                                    <input type="text" value={profile.supplier} onChange={e => handleProfileChange(profile.localId, 'supplier', e.target.value)} className={inputClass} placeholder={t.supplier} />
                                </div>
                                <div>
                                    <label className={labelClass}>{t.price}</label>
                                    <input type="number" value={profile.price} onChange={e => handleProfileChange(profile.localId, 'price', parseFloat(e.target.value))} className={inputClass} placeholder={t.price} />
                                </div>
                            </div>

                            {/* Page Relationships */}
                            <div className="mb-4 p-3 bg-latte-surface0 dark:bg-mocha-surface0 rounded-lg border border-latte-surface1 dark:border-mocha-surface1">
                                <label className={`flex items-center space-x-2 ${labelClass} mb-2`}>
                                    <LayersIcon className="w-4 h-4" />
                                    <span>{t.pages}</span>
                                </label>
                                <SearchableSelect 
                                    options={pageOptions} 
                                    selected={profile.pageIds || []} 
                                    onChange={val => handleProfileChange(profile.localId, 'pageIds', val)} 
                                    placeholder={t.selectPages} 
                                    searchPlaceholder={t.searchPages}
                                    multiple
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className={labelClass}>{t.email}</label>
                                    <input type="text" value={profile.email} onChange={e => handleProfileChange(profile.localId, 'email', e.target.value)} className={inputClass} placeholder={t.email} />
                                </div>
                                <div>
                                    <label className={labelClass}>{t.emailPassword}</label>
                                    <input type="text" value={profile.emailPassword} onChange={e => handleProfileChange(profile.localId, 'emailPassword', e.target.value)} className={inputClass} placeholder={t.emailPassword} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className={labelClass}>{t.facebookPassword}</label>
                                    <input type="text" value={profile.facebookPassword} onChange={e => handleProfileChange(profile.localId, 'facebookPassword', e.target.value)} className={inputClass} placeholder={t.facebookPassword} />
                                </div>
                                <div>
                                    <label className={labelClass}>{t.twoFactorCode}</label>
                                    <input type="text" value={profile.twoFactorCode} onChange={e => handleProfileChange(profile.localId, 'twoFactorCode', e.target.value)} className={inputClass} placeholder={t.twoFactorCode} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className={labelClass}>{t.recoveryEmail}</label>
                                    <input type="text" value={profile.recoveryEmail} onChange={e => handleProfileChange(profile.localId, 'recoveryEmail', e.target.value)} className={inputClass} placeholder={t.recoveryEmail} />
                                </div>
                                <div>
                                    <label className={labelClass}>{t.securityKey}</label>
                                    <SearchableSelect 
                                        options={securityKeyOptions} 
                                        selected={profile.securityKeys || []} 
                                        onChange={val => handleProfileChange(profile.localId, 'securityKeys', val)} 
                                        placeholder={t.selectSecurityKey} 
                                        searchPlaceholder={t.search}
                                        multiple
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>{t.driveLink}</label>
                                <input type="text" value={profile.driveLink} onChange={e => handleProfileChange(profile.localId, 'driveLink', e.target.value)} className={inputClass} placeholder={t.driveLink} />
                            </div>

                            {profile.error && <p className="text-sm text-latte-red dark:text-mocha-red mt-2">{profile.error}</p>}
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end space-x-4 pt-4 border-t border-latte-surface1 dark:border-mocha-surface1">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-latte-surface1 dark:bg-mocha-surface1 font-semibold hover:bg-latte-surface2 dark:hover:bg-mocha-surface2 transition-colors">{t.cancel}</button>
                    <button onClick={handleSaveClick} className="px-6 py-2 rounded-lg bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust font-semibold hover:opacity-90 transition-opacity disabled:opacity-50" disabled={isSaving || !allFieldsFilled || profiles.length === 0}>
                        {isSaving ? (t.saving || 'Saving...') : `${t.saveAll} (${profiles.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};
