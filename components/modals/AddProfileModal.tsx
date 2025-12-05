
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Profile, ProfileRole, ProfileStatus, AccountStatus, DropdownOption } from '../../types';
import { SearchableSelect } from '../ui/SearchableSelect';

interface AddProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (profileData: Omit<Profile, 'id'> & { id?: string }) => void;
    t: any;
    editingProfile?: Profile | null;
    pageOptions: { value: string; label: string }[];
    dropdownOptions: DropdownOption[];
}

export const AddProfileModal: React.FC<AddProfileModalProps> = ({ isOpen, onClose, onSave, t, editingProfile, pageOptions, dropdownOptions }) => {
    const [name, setName] = useState('');
    const [facebookId, setFacebookId] = useState('');
    const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
    const [supplier, setSupplier] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [status, setStatus] = useState<ProfileStatus>('Stock');
    const [role, setRole] = useState<ProfileRole>('Advertiser');
    const [securityKeys, setSecurityKeys] = useState<string[]>([]);
    const [email, setEmail] = useState('');
    const [accountStatus, setAccountStatus] = useState<AccountStatus>('OK');
    const [driveLink, setDriveLink] = useState('');
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [emailPassword, setEmailPassword] = useState('');
    const [facebookPassword, setFacebookPassword] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [pageIds, setPageIds] = useState<string[]>([]);

    const resetForm = useCallback(() => {
        setName('');
        setFacebookId('');
        setPurchaseDate(new Date().toISOString().split('T')[0]);
        setSupplier('');
        setPrice('');
        setStatus('Stock');
        setRole('Advertiser');
        setSecurityKeys([]);
        setEmail('');
        setAccountStatus('OK');
        setDriveLink('');
        setRecoveryEmail('');
        setEmailPassword('');
        setFacebookPassword('');
        setTwoFactorCode('');
        setPageIds([]);
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (editingProfile) {
                setName(editingProfile.name);
                setFacebookId(editingProfile.facebookId);
                setPurchaseDate(new Date(editingProfile.purchaseDate).toISOString().split('T')[0]);
                setSupplier(editingProfile.supplier);
                setPrice(editingProfile.price);
                setStatus(editingProfile.status);
                setRole(editingProfile.role);
                setSecurityKeys(editingProfile.securityKeys);
                setEmail(editingProfile.emails && editingProfile.emails.length > 0 ? editingProfile.emails[0] : '');
                setAccountStatus(editingProfile.accountStatus);
                setDriveLink(editingProfile.driveLink);
                setRecoveryEmail(editingProfile.recoveryEmail || '');
                setEmailPassword(editingProfile.emailPassword || '');
                setFacebookPassword(editingProfile.facebookPassword || '');
                setTwoFactorCode(editingProfile.twoFactorCode || '');
                setPageIds(editingProfile.pageIds || []);
            } else {
                resetForm();
            }
        }
    }, [isOpen, editingProfile, resetForm]);

    // Use dynamic options with safety checks
    const profileStatusOptions = useMemo(() => 
        (dropdownOptions || [])
            .filter(o => o.context === 'profile_status')
            .map(o => ({ value: o.value, label: t[o.value] || o.value })) 
    , [dropdownOptions, t]);

    const profileRoleOptions = useMemo(() => 
        (dropdownOptions || [])
            .filter(o => o.context === 'profile_role')
            .map(o => ({ value: o.value, label: t[o.value] || o.value }))
    , [dropdownOptions, t]);

    const accountStatusOptions = useMemo(() => 
        (dropdownOptions || [])
            .filter(o => o.context === 'account_status')
            .map(o => ({ value: o.value, label: t[o.value] || o.value }))
    , [dropdownOptions, t]);

    const securityKeyOptions = useMemo(() => 
        (dropdownOptions || [])
            .filter(o => o.context === 'security_keys')
            .map(o => ({ value: o.value, label: o.value }))
    , [dropdownOptions]);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (name.trim()) {
            const profileData = {
                name,
                facebookId,
                purchaseDate: new Date(purchaseDate),
                supplier,
                price: Number(price) || 0,
                status,
                role,
                securityKeys,
                emails: email ? [email] : [],
                accountStatus,
                driveLink,
                recoveryEmail,
                emailPassword,
                facebookPassword,
                twoFactorCode,
                pageIds,
            };

            onSave(editingProfile ? { ...profileData, id: editingProfile.id } : profileData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl shadow-2xl p-8 w-full max-w-4xl transform transition-all" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-latte-text dark:text-mocha-text">{editingProfile ? t.editProfile : t.addProfile}</h2>
                <div className="space-y-6 max-h-[70vh] overflow-y-auto py-2 pr-6 -mr-2">
                    {/* Basic Info */}
                    <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.profileName}</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.facebookId}</label>
                                <input type="text" value={facebookId} onChange={(e) => setFacebookId(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Purchase Info */}
                    <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.purchaseDate}</label>
                                <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.supplier}</label>
                                <input type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.price}</label>
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Status & Classification */}
                    <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.profileStatus}</label>
                                <SearchableSelect options={profileStatusOptions} selected={status} onChange={setStatus} placeholder={t.selectProfileStatus} searchPlaceholder={t.searchStatus} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.profileRole}</label>
                                <SearchableSelect options={profileRoleOptions} selected={role} onChange={setRole} placeholder={t.selectRole} searchPlaceholder={t.searchRole} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.accountStatus}</label>
                                <SearchableSelect options={accountStatusOptions} selected={accountStatus} onChange={setAccountStatus} placeholder={t.selectAccountStatus} searchPlaceholder={t.searchStatus} />
                            </div>
                        </div>
                    </div>

                    {/* Credentials & Links */}
                     <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.recoveryEmail}</label>
                                <input type="email" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                            </div>
                             <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.email}</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.emailPassword}</label>
                                <input type="text" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.facebookPassword}</label>
                                <input type="text" value={facebookPassword} onChange={(e) => setFacebookPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.twoFactorCode}</label>
                                <input type="text" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                            </div>
                             <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.securityKey}</label>
                                <SearchableSelect options={securityKeyOptions} selected={securityKeys} onChange={setSecurityKeys} placeholder={t.selectSecurityKey} searchPlaceholder={t.search} multiple />
                            </div>
                             <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.driveLink}</label>
                                <input type="url" value={driveLink} onChange={(e) => setDriveLink(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Pages Relationship */}
                    <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                        <h3 className="font-semibold mb-3 text-latte-text dark:text-mocha-text">{t.pages}</h3>
                        <div>
                            <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.selectPages}</label>
                            <SearchableSelect options={pageOptions} selected={pageIds} onChange={setPageIds} placeholder={t.selectPages} searchPlaceholder={t.searchPages} multiple />
                        </div>
                    </div>

                </div>
                <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-latte-surface1 dark:bg-mocha-surface1 font-semibold hover:bg-latte-surface2 dark:hover:bg-mocha-surface2 transition-colors">{t.cancel}</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust font-semibold hover:opacity-90 transition-opacity disabled:opacity-50" disabled={!name.trim()}>{t.save}</button>
                </div>
            </div>
        </div>
    );
};
