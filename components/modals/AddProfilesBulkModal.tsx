

import React, { useState, useEffect } from 'react';
import { Profile, ProfileStatus, ProfileRole } from '../../types';
import { TrashIcon } from '../icons';

export type BulkProfileEntry = Partial<Profile> & {
    localId: string;
    email: string; // Flat string for editing, converted to array on save
    error?: string;
};

interface AddProfilesBulkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (profiles: Partial<Profile>[]) => Promise<{ success: boolean; errors: { facebookId: string, message: string }[] }>;
    t: any;
    initialProfiles: Partial<Profile>[];
}

const profileStatusOptions: ProfileStatus[] = ['Warm up', 'Stock', 'In Use', 'Invalidated'];
const profileRoleOptions: ProfileRole[] = [ProfileRole.Advertiser, ProfileRole.Contingency, ProfileRole.Bot, ProfileRole.Backup];

export const AddProfilesBulkModal: React.FC<AddProfilesBulkModalProps> = ({ isOpen, onClose, onSave, t, initialProfiles }) => {
    const [profiles, setProfiles] = useState<BulkProfileEntry[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [summaryError, setSummaryError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setProfiles(initialProfiles.map(p => ({
                ...p,
                localId: crypto.randomUUID(),
                email: (p as any).email || (p.emails && p.emails.length > 0 ? p.emails[0] : '') || '',
                // Ensure other fields are present
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
            })));
            setIsSaving(false);
            setSummaryError('');
        }
    }, [isOpen, initialProfiles]);

    if (!isOpen) return null;

    const handleProfileChange = (localId: string, field: keyof BulkProfileEntry, value: any) => {
        setProfiles(currentProfiles =>
            currentProfiles.map(p => p.localId === localId ? { ...p, [field]: value, error: undefined } : p)
        );
    };

    const handleSecurityKeysChange = (localId: string, value: string) => {
        // Split by comma
        const keys = value.split(',').map(k => k.trim()).filter(k => k !== '');
        setProfiles(currentProfiles =>
            currentProfiles.map(p => p.localId === localId ? { ...p, securityKeys: keys, error: undefined } : p)
        );
    };

    const handleRemoveProfile = (localId: string) => {
        setProfiles(currentProfiles => currentProfiles.filter(p => p.localId !== localId));
    };

    const handleSaveClick = async () => {
        setIsSaving(true);
        setSummaryError('');

        const profilesToSave = profiles.map(({ localId, error, ...rest }) => rest);
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
    
    // Basic validation: requires Facebook ID
    const allFieldsFilled = profiles.every(p => p.facebookId && p.facebookId.trim() !== '');

    const inputClass = "w-full px-2 py-1.5 text-xs rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl shadow-2xl p-8 w-full max-w-[95vw] flex flex-col h-[90vh]" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 text-latte-text dark:text-mocha-text">{t.addProfilesBulk}</h2>
                <p className="text-sm text-latte-subtext1 dark:text-mocha-subtext1 mb-6">{t.addProfilesBulkDescription}</p>
                
                {summaryError && <p className="text-sm text-center text-latte-red dark:text-mocha-red mb-4 p-2 bg-latte-red/10 rounded-md">{summaryError}</p>}
                
                <div className="flex-grow overflow-auto pr-4 -mr-4 border border-latte-surface1 dark:border-mocha-surface1 rounded-lg">
                    <div className="min-w-[2000px] p-2">
                         {/* Header Row */}
                        <div className="grid grid-cols-12 gap-2 px-2 py-2 font-bold text-xs uppercase text-latte-subtext1 dark:text-mocha-subtext1 mb-2">
                            <div className="col-span-1">{t.profileName}</div>
                            <div className="col-span-1">{t.facebookId}</div>
                            <div className="col-span-1">{t.profileStatus}</div>
                            <div className="col-span-1">{t.profileRole}</div>
                            <div className="col-span-1">{t.supplier}</div>
                            <div className="col-span-1">{t.price}</div>
                            <div className="col-span-1">{t.email}</div>
                            <div className="col-span-1">{t.emailPassword}</div>
                            <div className="col-span-1">{t.facebookPassword}</div>
                            <div className="col-span-1">{t.twoFactorCode}</div>
                            <div className="col-span-1">{t.recoveryEmail} / {t.securityKey}</div>
                            <div className="col-span-1">{t.driveLink}</div>
                        </div>

                        {profiles.map((profile) => (
                            <div key={profile.localId} className={`p-2 mb-2 rounded-lg bg-latte-base dark:bg-mocha-base border ${profile.error ? 'border-latte-red dark:border-mocha-red' : 'border-latte-surface1 dark:border-mocha-surface1'}`}>
                                <div className="grid grid-cols-12 gap-2 items-start">
                                    {/* 1. Name */}
                                    <div className="col-span-1">
                                        <input type="text" placeholder={t.profileName} value={profile.name} onChange={e => handleProfileChange(profile.localId, 'name', e.target.value)} className={inputClass} />
                                    </div>
                                    {/* 2. FB ID */}
                                    <div className="col-span-1">
                                        <input type="text" placeholder={t.facebookId} value={profile.facebookId} onChange={e => handleProfileChange(profile.localId, 'facebookId', e.target.value)} className={inputClass} />
                                    </div>
                                    {/* 3. Status */}
                                    <div className="col-span-1">
                                        <select 
                                            value={profile.status} 
                                            onChange={e => handleProfileChange(profile.localId, 'status', e.target.value)} 
                                            className={inputClass}
                                        >
                                            {profileStatusOptions.map(opt => (
                                                <option key={opt} value={opt}>{t[`status${opt.replace(/\s/g, '')}`] || opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* 4. Role */}
                                    <div className="col-span-1">
                                        <select 
                                            value={profile.role} 
                                            onChange={e => handleProfileChange(profile.localId, 'role', e.target.value)} 
                                            className={inputClass}
                                        >
                                            {profileRoleOptions.map(opt => (
                                                <option key={opt} value={opt}>{t[`role${opt}`] || opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* 5. Supplier */}
                                    <div className="col-span-1">
                                        <input type="text" placeholder={t.supplier} value={profile.supplier} onChange={e => handleProfileChange(profile.localId, 'supplier', e.target.value)} className={inputClass} />
                                    </div>
                                    {/* 6. Price */}
                                    <div className="col-span-1">
                                        <input type="number" placeholder={t.price} value={profile.price} onChange={e => handleProfileChange(profile.localId, 'price', parseFloat(e.target.value))} className={inputClass} />
                                    </div>
                                    {/* 7. Email */}
                                    <div className="col-span-1">
                                        <input type="text" placeholder={t.email} value={profile.email} onChange={e => handleProfileChange(profile.localId, 'email', e.target.value)} className={inputClass} />
                                    </div>
                                    {/* 8. Email Pass */}
                                    <div className="col-span-1">
                                        <input type="text" placeholder={t.emailPassword} value={profile.emailPassword} onChange={e => handleProfileChange(profile.localId, 'emailPassword', e.target.value)} className={inputClass} />
                                    </div>
                                    {/* 9. FB Pass */}
                                    <div className="col-span-1">
                                        <input type="text" placeholder={t.facebookPassword} value={profile.facebookPassword} onChange={e => handleProfileChange(profile.localId, 'facebookPassword', e.target.value)} className={inputClass} />
                                    </div>
                                    {/* 10. 2FA */}
                                    <div className="col-span-1">
                                        <input type="text" placeholder={t.twoFactorCode} value={profile.twoFactorCode} onChange={e => handleProfileChange(profile.localId, 'twoFactorCode', e.target.value)} className={inputClass} />
                                    </div>
                                    {/* 11. Recovery / Key */}
                                    <div className="col-span-1 space-y-1">
                                        <input type="text" placeholder={t.recoveryEmail} value={profile.recoveryEmail} onChange={e => handleProfileChange(profile.localId, 'recoveryEmail', e.target.value)} className={inputClass} />
                                        <input 
                                            type="text" 
                                            placeholder={t.securityKey + " (comma sep)"} 
                                            value={profile.securityKeys?.join(', ')} 
                                            onChange={e => handleSecurityKeysChange(profile.localId, e.target.value)} 
                                            className={inputClass} 
                                        />
                                    </div>
                                    {/* 12. Drive Link & Remove */}
                                    <div className="col-span-1 flex gap-1">
                                        <input type="text" placeholder={t.driveLink} value={profile.driveLink} onChange={e => handleProfileChange(profile.localId, 'driveLink', e.target.value)} className={inputClass} />
                                        <button onClick={() => handleRemoveProfile(profile.localId)} className="p-1.5 rounded-lg text-latte-red dark:text-mocha-red hover:bg-latte-red/10 dark:hover:bg-mocha-red/10 h-fit mt-1">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                {profile.error && <p className="text-xs text-latte-red dark:text-mocha-red mt-1 pl-1">{profile.error}</p>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4 pt-4 border-t border-latte-surface1 dark:border-mocha-surface1">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-latte-surface1 dark:bg-mocha-surface1 font-semibold hover:bg-latte-surface2 dark:hover:bg-mocha-surface2">{t.cancel}</button>
                    <button onClick={handleSaveClick} className="px-6 py-2 rounded-lg bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust font-semibold disabled:opacity-50" disabled={isSaving || !allFieldsFilled || profiles.length === 0}>
                        {isSaving ? (t.saving || 'Saving...') : `${t.saveAll} (${profiles.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};